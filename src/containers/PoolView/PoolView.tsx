/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { withRouter, useHistory, Link } from 'react-router-dom';
import { Row, Col, Grid } from 'antd';
import moment from 'moment';
import { random } from 'lodash';
import {
  SyncOutlined,
  SwapOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { bnOrZero } from '@thorchain/asgardex-util';
import { baseAmount, formatBaseAsTokenAmount } from '@thorchain/asgardex-token';
import themes, { ThemeType } from '@thorchain/asgardex-theme';

import Label from '../../components/uielements/label';
import AddIcon from '../../components/uielements/addIcon';
import CoinIcon from '../../components/uielements/coins/coinIcon';
import Table from '../../components/uielements/table';
import Button from '../../components/uielements/button';
import PoolFilter from '../../components/poolFilter';
import StatBar from '../../components/statBar';

import {
  ContentWrapper,
  ActionHeader,
  ActionColumn,
  TransactionWrapper,
  StyledPagination,
} from './PoolView.style';
import {
  getAvailableTokensToCreate,
  getPoolData,
} from '../../helpers/utils/poolUtils';
import { PoolData } from '../../helpers/utils/types';
import { getTickerFormat } from '../../helpers/stringHelper';

import * as midgardActions from '../../redux/midgard/actions';
import { RootState } from '../../redux/store';
import { AssetData, User } from '../../redux/wallet/types';
import {
  PoolDataMap,
  PriceDataIndex,
  AssetDetailMap,
  TxDetailData,
  RTVolumeData,
} from '../../redux/midgard/types';
import { getAssetFromString } from '../../redux/midgard/utils';
import { ViewType, Maybe } from '../../types/bepswap';
import {
  PoolDetailStatusEnum,
  StatsData,
  AssetDetail,
} from '../../types/generated/midgard/api';
import showNotification from '../../components/uielements/notification';
import { RUNE_SYMBOL } from '../../settings/assetData';

import LabelLoader from '../../components/utility/loaders/label';
import PoolChart from '../../components/poolChart';
import TxTable from '../../components/transaction/txTable';

type Props = {
  history: H.History;
  pools: string[];
  poolData: PoolDataMap;
  txData: TxDetailData;
  stats: StatsData;
  assets: AssetDetailMap;
  priceIndex: PriceDataIndex;
  assetData: AssetData[];
  user: Maybe<User>;
  poolLoading: boolean;
  assetLoading: boolean;
  poolDataLoading: boolean;
  rtVolumeLoading: boolean;
  rtVolume: RTVolumeData;
  getPools: typeof midgardActions.getPools;
  getTransactions: typeof midgardActions.getTransaction;
  getRTVolume: typeof midgardActions.getRTVolumeByAsset;
};

const generateRandomTimeSeries = (
  minValue: number,
  maxValue: number,
  startDate: string,
) => {
  const series = [];
  for (
    let itr = moment(startDate);
    itr.isBefore(moment.now());
    itr = itr.add(1, 'day')
  ) {
    series.push({
      time: itr.unix(),
      value: (minValue + (random(100) / 100) * (maxValue - minValue)).toString(),
    });
  }
  return series;
};

const PoolView: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    pools,
    poolData,
    txData,
    stats,
    assets,
    priceIndex,
    assetData,
    user,
    poolLoading,
    assetLoading,
    poolDataLoading,
    rtVolumeLoading,
    rtVolume,
    getPools,
    getTransactions,
    getRTVolume,
  } = props;

  const [poolStatus, selectPoolStatus] = useState<PoolDetailStatusEnum>(
    PoolDetailStatusEnum.Enabled,
  );
  const history = useHistory();

  const themeType = useSelector((state: RootState) => state.App.themeType);
  const isLight = themeType === ThemeType.LIGHT;
  const theme = isLight ? themes.light : themes.dark;

  const loading = poolLoading || poolDataLoading;
  const wallet: Maybe<string> = user ? user.wallet : null;

  const busdToken = Object.keys(assets).find(
    item => getTickerFormat(item) === 'busd',
  );
  const busdPrice = busdToken ? assets[busdToken]?.priceRune ?? 'RUNE' : 'RUNE';
  const isDesktopView = Grid.useBreakpoint()?.lg ?? false;

  const chartData = useMemo(() => {
    if (rtVolumeLoading) {
      return { liquidity: [], volume: [], loading: true };
    }

    const volumeSeriesData = rtVolume?.map(volume => {
      const price = busdPrice === 'RUNE' ? 1 : Number(busdPrice);
      const bnValue = bnOrZero(volume?.totalVolume ?? '0').dividedBy(price);
      const amount = baseAmount(bnValue);

      return {
        time: volume?.time ?? 0,
        value: formatBaseAsTokenAmount(amount),
      };
    });

    return {
      liquidity: generateRandomTimeSeries(0, 15, '2020-05-01'),
      volume: volumeSeriesData,
      loading: false,
    };
  }, [rtVolume, rtVolumeLoading, busdPrice]);

  const getTransactionInfo = useCallback(
    (offset: number, limit: number) => {
      getTransactions({ offset, limit });
    },
    [getTransactions],
  );

  const getRTVolumeInfo = useCallback(
    (
      from: number,
      to: number,
      interval: '5min' | 'hour' | 'day' | 'week' | 'month' | 'year',
    ) => {
      getRTVolume({ asset: '', from, to, interval });
    },
    [getRTVolume],
  );

  useEffect(() => {
    getTransactionInfo(0, 10);
  }, [getTransactionInfo]);

  useEffect(() => {
    const timeStamp: number = moment().unix();
    getRTVolumeInfo(0, timeStamp, 'day');
  }, [getRTVolumeInfo]);

  const handleGetPools = () => {
    getPools();
  };

  const handleNewPool = () => {
    if (!wallet) {
      showNotification({
        type: 'warning',
        message: 'Create Pool Failed',
        description: 'Please connect your wallet to add a new pool.',
      });
    } else {
      const possibleTokens = getAvailableTokensToCreate(assetData, pools);
      if (possibleTokens.length) {
        const symbol = possibleTokens[0].asset;
        if (getTickerFormat(symbol) !== 'rune') {
          const URL = `/pool/${symbol}/new`;
          history.push(URL);
        }
      } else {
        showNotification({
          type: 'warning',
          message: 'Create Pool Failed',
          description: 'You don\'t have available asset to create a new pool.',
        });
      }
    }
  };

  const handlePagination = useCallback(
    (page: number) => {
      getTransactionInfo((page - 1) * 10, 10);
    },
    [getTransactionInfo],
  );

  const renderCell = (text: string) => {
    if (loading) {
      return <LabelLoader />;
    }
    return <span>{text}</span>;
  };

  const renderPoolPriceCell = (text: string) => {
    if (assetLoading) {
      return <LabelLoader />;
    }
    return <span>{text}</span>;
  };

  const renderPoolTable = (poolViewData: PoolData[], view: ViewType) => {
    const buttonCol = {
      key: 'stake',
      title: (
        <ActionHeader>
          <Button onClick={handleGetPools} typevalue="outline" round="true">
            <SyncOutlined />
            refresh
          </Button>
        </ActionHeader>
      ),
      render: (text: string, record: PoolData) => {
        const { target, values } = record;
        if (target) {
          const swapUrl = `/swap/${RUNE_SYMBOL}:${values.symbol}`;
          const stakeUrl = `/stake/${values.symbol.toUpperCase()}`;

          return (
            <ActionColumn>
              <div className="action-column-wrapper">
                <Link
                  to={stakeUrl}
                  onClick={ev => {
                    ev.stopPropagation();
                  }}
                >
                  <Button
                    style={{ margin: 'auto' }}
                    round="true"
                    typevalue="outline"
                  >
                    <DatabaseOutlined />
                    stake
                  </Button>
                </Link>
                {poolStatus !== PoolDetailStatusEnum.Bootstrapped && (
                  <Link
                    to={swapUrl}
                    onClick={ev => {
                      ev.stopPropagation();
                    }}
                  >
                    <Button style={{ margin: 'auto' }} round="true">
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
        render: renderPoolPriceCell,
        sorter: (a: PoolData, b: PoolData) => a.poolPrice.minus(b.poolPrice),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder:
          poolStatus === PoolDetailStatusEnum.Enabled ? 'descend' : undefined,
      },
      {
        key: 'depth',
        title: 'depth',
        dataIndex: ['values', 'depth'],
        render: renderCell,
        sorter: (a: PoolData, b: PoolData) =>
          a.depth.amount().minus(b.depth.amount()),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder:
          poolStatus !== PoolDetailStatusEnum.Enabled ? 'descend' : undefined,
      },
      {
        key: 'volume24',
        title: '24h vol',
        dataIndex: ['values', 'volume24'],
        render: renderCell,
        sorter: (a: PoolData, b: PoolData) =>
          a.volume24.amount().minus(b.volume24.amount()),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'apy',
        title: 'APY',
        dataIndex: ['values', 'apy'],
        render: renderCell,
        sorter: (a: PoolData, b: PoolData) => Number(a.apy) - Number(b.apy),
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
        onRow={(record: PoolData) => {
          return {
            onClick: () => {
              const URL = `/pool/${record?.values?.symbol?.toUpperCase()}`;
              history.push(URL);
            },
          };
        }}
        columns={columns}
        dataSource={poolViewData}
        loading={poolLoading}
        rowKey="key"
        key={poolStatus}
      />
    );
  };

  const renderPoolList = (view: ViewType) => {
    const poolViewData = pools.map((poolName, index) => {
      const { symbol = '' } = getAssetFromString(poolName);

      const poolInfo = poolData[symbol] || {};
      const assetDetail: AssetDetail = assets?.[symbol] ?? {};

      const poolDataDetail: PoolData = getPoolData(
        symbol,
        poolInfo,
        assetDetail,
        priceIndex,
      );

      return {
        ...poolDataDetail,
        status: poolInfo?.status ?? null,
        key: index,
      };
    });

    const filteredData = poolViewData.filter(poolData => {
      return (
        (poolStatus === PoolDetailStatusEnum.Enabled && !poolData.status) ||
        poolData.status === poolStatus
      );
    });

    return renderPoolTable(filteredData, view);
  };

  return (
    <ContentWrapper className="pool-view-wrapper">
      <StatBar loading={loading} stats={stats} basePrice={busdPrice} />
      <div>
        <PoolChart
          chartData={chartData}
          textColor={theme.palette.text[0]}
          lineColor={isLight ? '#436eb9' : '#1dd3e6'}
          backgroundGradientStart={isLight ? '#e4ebf8' : '#365979'}
          backgroundGradientStop={isLight ? '#ffffff' : '#0f1922'}
          gradientStart={isLight ? '#c5d3f0' : '#365979'}
          gradientStop={isLight ? '#ffffff' : '#0f1922'}
          viewMode={isDesktopView ? 'desktop-view' : 'mobile-view'}
        />
      </div>
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
      <TransactionWrapper>
        <Label size="big" color="primary">
          Transactions
        </Label>
        <TxTable txData={txData} />
        <StyledPagination
          defaultCurrent={0}
          total={txData._tag === 'RemoteSuccess' ? txData.value.count : 0}
          showSizeChanger={false}
          onChange={handlePagination}
        />
      </TransactionWrapper>
    </ContentWrapper>
  );
};

export default compose(
  connect(
    (state: RootState) => ({
      pools: state.Midgard.pools,
      poolData: state.Midgard.poolData,
      stats: state.Midgard.stats,
      assets: state.Midgard.assets,
      poolLoading: state.Midgard.poolLoading,
      assetLoading: state.Midgard.assetLoading,
      poolDataLoading: state.Midgard.poolDataLoading,
      priceIndex: state.Midgard.priceIndex,
      txData: state.Midgard.txData,
      assetData: state.Wallet.assetData,
      user: state.Wallet.user,
      rtVolumeLoading: state.Midgard.rtVolumeLoading,
      rtVolume: state.Midgard.rtVolume,
    }),
    {
      getPools: midgardActions.getPools,
      getTransactions: midgardActions.getTransaction,
      getRTVolume: midgardActions.getRTVolumeByAsset,
    },
  ),
  withRouter,
)(PoolView);
