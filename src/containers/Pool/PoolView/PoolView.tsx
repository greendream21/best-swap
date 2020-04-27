import React from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { notification } from 'antd';
import { SyncOutlined, DatabaseOutlined } from '@ant-design/icons';

import Label from '../../../components/uielements/label';
import AddIcon from '../../../components/uielements/addIcon';
import CoinPair from '../../../components/uielements/coins/coinPair';
import Table from '../../../components/uielements/table';
import Button from '../../../components/uielements/button';

import { ContentWrapper } from './PoolView.style';
import { getCreatePoolTokens, getPoolData } from '../utils';
import { PoolData } from '../types';
import { getTickerFormat } from '../../../helpers/stringHelper';
import { getAppContainer } from '../../../helpers/elementHelper';
import * as midgardActions from '../../../redux/midgard/actions';
import { RootState } from '../../../redux/store';
import { AssetData, User } from '../../../redux/wallet/types';
import { PoolDataMap, PriceDataIndex } from '../../../redux/midgard/types';
import { getAssetFromString } from '../../../redux/midgard/utils';
import { ViewType, FixmeType, Maybe } from '../../../types/bepswap';

type ComponentProps = {
  loading: boolean;
};
type ConnectedProps = {
  history: H.History;
  getPools: typeof midgardActions.getPools;
  pools: string[];
  poolData: PoolDataMap;
  basePriceAsset: string;
  priceIndex: PriceDataIndex;
  assetData: AssetData[];
  user: Maybe<User>;
};

type State = {
  activeAsset: string;
};

type Props = ComponentProps & ConnectedProps;

class PoolView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeAsset: 'rune',
    };
  }

  componentDidMount() {
    const { getPools } = this.props;
    getPools();
  }

  handleNewPool = () => {
    const { assetData, pools, user } = this.props;

    const wallet = user ? user.wallet : null;

    if (!wallet) {
      notification.warning({
        message: 'Create Pool Failed',
        description: 'Please connect your wallet to add a new pool.',
        getContainer: getAppContainer,
      });
    } else {
      const possibleTokens = getCreatePoolTokens(assetData, pools);
      if (possibleTokens.length) {
        const symbol = possibleTokens[0].asset;
        if (getTickerFormat(symbol) !== 'rune') {
          const URL = `/pool/${symbol}/new`;
          this.props.history.push(URL);
        }
      } else {
        notification.warning({
          message: 'Create Pool Failed',
          description: 'You cannot create a new pool.',
          getContainer: getAppContainer,
        });
      }
    }
  };

  renderPoolTable = (swapViewData: FixmeType, view: ViewType) => {
    const { getPools, loading } = this.props;

    const buttonCol = {
      key: 'stake',
      title: (
        <Button
          onClick={() => {
            getPools();
          }}
          typevalue="outline"
        >
          <SyncOutlined />
          refresh
        </Button>
      ),
      render: (text: string, record: { symbol?: string }) => {
        const { symbol } = record;
        if (symbol) {
          const URL = `/pool/${symbol.toUpperCase()}`;
          const dataTest = `stake-button-${symbol.toLowerCase()}`;

          return (
            <Link to={URL}>
              <Button
                style={{ margin: 'auto' }}
                round="true"
                data-test={dataTest}
              >
                <DatabaseOutlined />
                stake
              </Button>
            </Link>
          );
        }
      },
    };

    const mobileColumns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ asset, target }: { asset: string; target: string }) => (
          <CoinPair from={asset} to={target} />
        ),
      },
      buttonCol,
    ];
    const desktopColumns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ asset, target }: { asset: string; target: string }) => (
          <CoinPair from={asset} to={target} />
        ),
      },
      {
        key: 'asset',
        title: 'asset',
        dataIndex: 'pool',
        render: ({ target }: { target: string }) => <p>{target}</p>,
        sorter: (a: FixmeType, b: FixmeType) =>
          a.pool.target.localeCompare(b.pool.target),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'poolprice',
        title: 'pool price',
        dataIndex: 'poolPrice',
        sorter: (a: FixmeType, b: FixmeType) =>
          a.raw.poolPrice.minus(b.raw.poolPrice),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
      },
      {
        key: 'depth',
        title: 'depth',
        dataIndex: 'depth',
        sorter: (a: FixmeType, b: FixmeType) => a.raw.depth - b.raw.depth,
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'volume24',
        title: '24h vol',
        dataIndex: 'volume24',
        sorter: (a: FixmeType, b: FixmeType) => a.raw.volume24 - b.raw.volume24,
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'transaction',
        title: 'avg. transaction',
        dataIndex: 'transaction',
        sorter: (a: FixmeType, b: FixmeType) =>
          a.raw.transaction - b.raw.transaction,
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'liqFee',
        title: 'avg. liq fee',
        dataIndex: 'liqFee',
        sorter: (a: FixmeType, b: FixmeType) => a.raw.liqFee - b.raw.liqFee,
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'roiAT',
        title: 'historical roi',
        dataIndex: 'roiAT',
        sorter: (a: FixmeType, b: FixmeType) => a.raw.roiAT - b.raw.roiAT,
        sortDirections: ['descend', 'ascend'],
      },
      buttonCol,
    ];

    const columnData = {
      desktop: desktopColumns,
      mobile: mobileColumns,
    };
    const columns = columnData[view] || desktopColumns;

    return (
      <Table
        columns={columns}
        dataSource={swapViewData}
        loading={loading}
        rowKey="key"
      />
    );
  };

  renderPoolList = (view: ViewType) => {
    const { pools, poolData, priceIndex, basePriceAsset } = this.props;
    const { activeAsset } = this.state;

    let key = 0;
    const stakeViewData = pools.reduce((result, pool) => {
      const { symbol = '' } = getAssetFromString(pool);
      const poolInfo = poolData[symbol] || {};

      const { values: stakeCardData, raw }: PoolData = getPoolData(
        'rune',
        poolInfo,
        priceIndex,
        basePriceAsset,
      );

      if (stakeCardData.target !== activeAsset) {
        result.push({ ...stakeCardData, raw, key });
        key += 1;
      }

      return result;
    }, [] as FixmeType[]);

    return this.renderPoolTable(stakeViewData, view);
  };

  render() {
    return (
      <ContentWrapper className="pool-view-wrapper">
        <div className="pool-list-view desktop-view">
          {this.renderPoolList(ViewType.DESKTOP)}
        </div>
        <div className="pool-list-view mobile-view">
          {this.renderPoolList(ViewType.MOBILE)}
        </div>
        <div className="add-new-pool" onClick={this.handleNewPool}>
          <AddIcon />
          <Label size="normal" weight="bold" color="normal">
            ADD NEW POOL
          </Label>
        </div>
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    (state: RootState) => ({
      pools: state.Midgard.pools,
      poolData: state.Midgard.poolData,
      loading: state.Midgard.poolLoading,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      assetData: state.Wallet.assetData,
      user: state.Wallet.user,
    }),
    {
      getPools: midgardActions.getPools,
    },
  ),
  withRouter,
)(PoolView) as React.ComponentClass<ComponentProps, State>;
