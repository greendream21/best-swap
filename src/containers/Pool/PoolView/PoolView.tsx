import React, { useState, useEffect } from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link, useHistory } from 'react-router-dom';
import { notification, Row, Col } from 'antd';
import {
  SyncOutlined,
  SwapOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

import Label from '../../../components/uielements/label';
import AddIcon from '../../../components/uielements/addIcon';
import CoinIcon from '../../../components/uielements/coins/coinIcon';
import Table from '../../../components/uielements/table';
import Button from '../../../components/uielements/button';
import PoolFilter from '../../../components/poolFilter';

import { ContentWrapper, ActionHeader, ActionColumn } from './PoolView.style';
import { getCreatePoolTokens, getPoolData } from '../utils';
import { PoolData } from '../types';
import { getTickerFormat } from '../../../helpers/stringHelper';
import { getAppContainer } from '../../../helpers/elementHelper';
import * as midgardActions from '../../../redux/midgard/actions';
import { RootState } from '../../../redux/store';
import { AssetData, User } from '../../../redux/wallet/types';
import { PoolDataMap, PriceDataIndex } from '../../../redux/midgard/types';
import { getAssetFromString } from '../../../redux/midgard/utils';
import { ViewType, Maybe } from '../../../types/bepswap';
import { PoolDetailStatusEnum } from '../../../types/generated/midgard/api';

type ComponentProps = {
  loading: boolean;
};
type ConnectedProps = {
  history: H.History;
  getPools: typeof midgardActions.getPools;
  pools: string[];
  poolData: PoolDataMap;
  priceIndex: PriceDataIndex;
  assetData: AssetData[];
  user: Maybe<User>;
};

type State = {
  poolStatus: PoolDetailStatusEnum;
};

type Props = ComponentProps & ConnectedProps;

const PoolView: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    pools,
    poolData,
    priceIndex,
    assetData,
    user,
    loading,
    getPools,
  } = props;
  const [poolStatus, selectPoolStatus] = useState<PoolDetailStatusEnum>(
    PoolDetailStatusEnum.Enabled,
  );
  const history = useHistory();

  const wallet: Maybe<string> = user ? user.wallet : null;

  useEffect(() => {
    getPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const handleNewPool = () => {
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
          history.push(URL);
        }
      } else {
        notification.warning({
          message: 'Create Pool Failed',
          description: 'You don\'t have available asset to create a new pool.',
          getContainer: getAppContainer,
        });
      }
    }
  };

  const renderPoolTable = (poolViewData: PoolData[], view: ViewType) => {
    const buttonCol = {
      key: 'stake',
      title: (
        <ActionHeader>
          <Button
            onClick={() => {
              getPools();
            }}
            typevalue="outline"
            round="true"
          >
            <SyncOutlined />
            refresh
          </Button>
        </ActionHeader>
      ),
      render: (text: string, record: PoolData) => {
        const { asset, target, values } = record;
        if (target) {
          const swapUrl = `/swap/${asset.toLowerCase()}-${target.toLowerCase()}`;
          const stakeUrl = `/pool/${values.symbol.toUpperCase()}`;
          const dataTest = `stake-button-${target.toLowerCase()}`;

          return (
            <ActionColumn>
              <div className="action-column-wrapper">
                <Link to={stakeUrl}>
                  <Button
                    style={{ margin: 'auto' }}
                    round="true"
                    typevalue="outline"
                    data-test={dataTest}
                  >
                    <DatabaseOutlined />
                    stake
                  </Button>
                </Link>
                {poolStatus !== PoolDetailStatusEnum.Bootstrapped && (
                  <Link to={swapUrl}>
                    <Button
                      style={{ margin: 'auto' }}
                      round="true"
                      data-test={dataTest}
                    >
                      <SwapOutlined />
                      swap
                    </Button>
                  </Link>
                )}
              </div>
            </ActionColumn>
          );
        }
      },
    };

    const mobileColumns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ target }: { target: string }) => (
          <Row>
            <Col xs={24} style={{ display: 'flex', justifyContent: 'center' }}>
              <CoinIcon type={target} />
            </Col>
          </Row>
        ),
      },
      buttonCol,
    ];
    const desktopColumns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ target }: { target: string }) => (
          <Row>
            <Col xs={24} style={{ display: 'flex', justifyContent: 'center' }}>
              <CoinIcon type={target} />
            </Col>
          </Row>
        ),
      },
      {
        key: 'asset',
        title: 'asset',
        dataIndex: 'pool',
        render: ({ target }: { target: string }) => <p>{target}</p>,
        sorter: (a: PoolData, b: PoolData) => a.target.localeCompare(b.target),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'poolprice',
        title: 'pool price',
        dataIndex: ['values', 'poolPrice'],
        sorter: (a: PoolData, b: PoolData) => a.poolPrice.minus(b.poolPrice),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
      },
      {
        key: 'depth',
        title: 'depth',
        dataIndex: ['values', 'depth'],
        sorter: (a: PoolData, b: PoolData) =>
          a.depth.amount().minus(b.depth.amount()),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'volume24',
        title: '24h vol',
        dataIndex: ['values', 'volume24'],
        sorter: (a: PoolData, b: PoolData) =>
          a.volume24.amount().minus(b.volume24.amount()),
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
        dataSource={poolViewData}
        loading={loading}
        rowKey="key"
      />
    );
  };

  const renderPoolList = (view: ViewType) => {
    const poolViewData = pools.map((poolName, index) => {
      const { symbol = '' } = getAssetFromString(poolName);

      const poolInfo = poolData[symbol] || {};

      const poolDataDetail: PoolData = getPoolData(
        'rune',
        poolInfo,
        priceIndex,
      );

      return {
        ...poolDataDetail,
        status: poolInfo?.status ?? null,
        key: index,
      };
    });

    const filteredData = poolViewData.filter(
      poolData => poolData.status === poolStatus,
    );

    return renderPoolTable(filteredData, view);
  };

  return (
    <ContentWrapper className="pool-view-wrapper">
      <PoolFilter selected={poolStatus} onClick={selectPoolStatus} />
      <div className="pool-list-view desktop-view">
        {renderPoolList(ViewType.DESKTOP)}
      </div>
      <div className="pool-list-view mobile-view">
        {renderPoolList(ViewType.MOBILE)}
      </div>
      <div className="add-new-pool" onClick={handleNewPool}>
        <AddIcon />
        <Label size="normal" weight="bold" color="normal">
          ADD NEW POOL
        </Label>
      </div>
    </ContentWrapper>
  );
};

export default compose(
  connect(
    (state: RootState) => ({
      pools: state.Midgard.pools,
      poolData: state.Midgard.poolData,
      loading: state.Midgard.poolLoading,
      priceIndex: state.Midgard.priceIndex,
      assetData: state.Wallet.assetData,
      user: state.Wallet.user,
    }),
    {
      getPools: midgardActions.getPools,
    },
  ),
  withRouter,
)(PoolView) as React.ComponentClass<ComponentProps, State>;
