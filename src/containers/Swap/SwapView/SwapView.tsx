import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { SyncOutlined, SwapOutlined } from '@ant-design/icons';

import { bn } from '@thorchain/asgardex-util';
import CoinPair from '../../../components/uielements/coins/coinPair';
import Trend from '../../../components/uielements/trend';
import Button from '../../../components/uielements/button';
import Table from '../../../components/uielements/table';

import { getSwapData } from '../utils';
import { SwapTableRowType, SwapCardType } from './types';
import * as midgardActions from '../../../redux/midgard/actions';
import { PriceDataIndex, PoolDataMap } from '../../../redux/midgard/types';
import { FixmeType, Maybe, ViewType, Nothing } from '../../../types/bepswap';

import { ContentWrapper, ActionHeader } from './SwapView.style';
import { RootState } from '../../../redux/store';
import { getAssetFromString } from '../../../redux/midgard/utils';
import { PoolInfoType } from '../../Pool/types';
import { PoolDetailStatusEnum } from '../../../types/generated/midgard/api';
import PoolFilter from '../../../components/poolFilter';

type ComponentProps = {};

type ConnectedProps = {
  pools: string[];
  poolData: PoolDataMap;
  priceIndex: PriceDataIndex;
  basePriceAsset: string;
  loading: boolean;
  getPools: typeof midgardActions.getPools;
};

type Props = ComponentProps & ConnectedProps;

const SwapView: React.FC<Props> = (props): JSX.Element => {
  const {
    pools,
    poolData,
    priceIndex,
    basePriceAsset,
    loading,
    getPools,
  } = props;

  const [poolStatus, selectPoolStatus] = useState<PoolDetailStatusEnum>(
    PoolDetailStatusEnum.Enabled,
  );

  useEffect(() => {
    getPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSwapTable = (
    swapViewData: SwapTableRowType[],
    view: ViewType,
  ) => {
    const btnCol = {
      key: 'swap',
      title: (
        <ActionHeader>
          <Button onClick={getPools} typevalue="outline">
            <SyncOutlined />
            refresh
          </Button>
        </ActionHeader>
      ),
      render: (text: string, record: SwapTableRowType) => {
        const {
          pool: { asset, target },
        } = record;
        const URL = `/swap/${asset.toLowerCase()}-${target.toLowerCase()}`;
        const dataTest = `swap-button-${target.toLowerCase()}`;

        return (
          <Link to={URL}>
            <Button
              style={{ margin: 'auto' }}
              round="true"
              data-test={dataTest}
              disabled={poolStatus === PoolDetailStatusEnum.Bootstrapped}
            >
              <SwapOutlined />
              swap
            </Button>
          </Link>
        );
      },
    };

    const mobileColumns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ asset, target }: PoolInfoType) => (
          <CoinPair from={asset} to={target} />
        ),
      },
      btnCol,
    ];

    const desktopColumns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ asset, target }: PoolInfoType) => (
          <CoinPair from={asset} to={target} />
        ),
      },
      {
        key: 'asset',
        title: 'asset',
        dataIndex: 'pool',
        render: ({ target }: { target: string }) => <p>{target}</p>,
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.pool.target.localeCompare(b.pool.target),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'poolprice',
        title: 'pool price',
        dataIndex: 'poolPrice',
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.poolPrice.minus(b.raw.poolPrice),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
      },
      {
        key: 'depth',
        title: 'depth',
        dataIndex: 'depth',
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.depth.minus(b.raw.depth),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'vol',
        title: '24h vol',
        dataIndex: 'volume',
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.volume.minus(b.raw.volume),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'transaction',
        title: 'avg. transaction',
        dataIndex: 'transaction',
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.transaction.minus(b.raw.transaction),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'slip',
        title: 'avg. slip',
        dataIndex: 'slip',
        render: (slip: string) => <Trend amount={bn(slip)} />,
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.slip.minus(b.raw.slip),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'trade',
        title: 'no. of trades',
        dataIndex: 'trade',
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.trade.minus(b.raw.trade),
        sortDirections: ['descend', 'ascend'],
      },
      btnCol,
    ];

    const columnData: { desktop: FixmeType; mobile: FixmeType } = {
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

  const renderSwapList = (view: ViewType) => {
    let key = 0;
    const swapViewData = pools.reduce((result: FixmeType[], pool) => {
      const { symbol } = getAssetFromString(pool);
      const poolInfo = symbol ? poolData[symbol] : Nothing;

      const swapCardData: Maybe<SwapCardType> = getSwapData(
        'rune',
        poolInfo,
        priceIndex,
        basePriceAsset,
      );

      if (swapCardData) {
        result.push({
          ...swapCardData,
          key,
          status: poolInfo?.status ?? Nothing,
        });
        key += 1;
      }

      return result;
    }, []);

    const filteredData = swapViewData.filter(
      poolData => poolData.status === poolStatus,
    );

    return renderSwapTable(filteredData, view);
  };

  return (
    <ContentWrapper className="swap-view-wrapper">
      <PoolFilter selected={poolStatus} onClick={selectPoolStatus} />
      <div className="swap-list-view desktop-view">
        {renderSwapList(ViewType.DESKTOP)}
      </div>
      <div className="swap-list-view mobile-view">
        {renderSwapList(ViewType.MOBILE)}
      </div>
    </ContentWrapper>
  );
};

export default compose(
  connect(
    (state: RootState) => ({
      pools: state.Midgard.pools,
      poolData: state.Midgard.poolData,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      loading: state.Midgard.poolLoading,
    }),
    {
      getPools: midgardActions.getPools,
    },
  ),
  withRouter,
)(SwapView) as React.FC<ComponentProps>;
