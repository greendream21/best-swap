/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { withRouter, useHistory, Link } from 'react-router-dom';
import { Row, Col, Grid } from 'antd';
import moment from 'moment';
import {
  SearchOutlined,
  SyncOutlined,
  SwapOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { Token } from '@thorchain/asgardex-binance';
import { bnOrZero } from '@thorchain/asgardex-util';
import themes, { ThemeType } from '@thorchain/asgardex-theme';

import Label from '../../components/uielements/label';
import AddIcon from '../../components/uielements/addIcon';
import CoinIcon from '../../components/uielements/coins/coinIcon';
import Button from '../../components/uielements/button';
import Input from '../../components/uielements/input';
import PoolFilter from '../../components/poolFilter';
import StatBar from '../../components/statBar';

import {
  ContentWrapper,
  ActionHeader,
  ActionColumn,
  TransactionWrapper,
  StyledPagination,
  PoolViewTools,
  PoolSearchWrapper,
  StyledTable as Table,
} from './PoolView.style';
import {
  getAvailableTokensToCreate,
  getPoolData,
} from '../../helpers/utils/poolUtils';
import { PoolData } from '../../helpers/utils/types';
import { getTickerFormat, getTokenName } from '../../helpers/stringHelper';

import * as midgardActions from '../../redux/midgard/actions';
import { RootState } from '../../redux/store';
import { AssetData, User } from '../../redux/wallet/types';
import {
  PoolDataMap,
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
  NetworkInfo,
} from '../../types/generated/midgard/api';
import showNotification from '../../components/uielements/notification';
import { RUNE_SYMBOL } from '../../settings/assetData';

import LabelLoader from '../../components/utility/loaders/label';
import PoolChart from '../../components/poolChart';
import TxTable from '../../components/transaction/txTable';

import { generateRandomTimeSeries } from './utils';
import usePrice from '../../hooks/usePrice';
import useNetwork from '../../hooks/useNetwork';
import { ButtonColor } from '../../components/uielements/button/types';

type Props = {
  history: H.History;
  pools: string[];
  poolData: PoolDataMap;
  txData: TxDetailData;
  refreshTxStatus: boolean;
  stats: StatsData;
  assets: AssetDetailMap;
  assetData: AssetData[];
  user: Maybe<User>;
  poolLoading: boolean;
  assetLoading: boolean;
  poolDataLoading: boolean;
  networkInfo: NetworkInfo;
  networkInfoLoading: boolean;
  rtVolumeLoading: boolean;
  rtVolume: RTVolumeData;
  tokenList: Token[];
  getPools: typeof midgardActions.getPools;
  getTransactions: typeof midgardActions.getTransaction;
  getRTVolume: typeof midgardActions.getRTVolumeByAsset;
};

const PoolView: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    pools,
    poolData,
    txData,
    refreshTxStatus,
    stats,
    assets,
    assetData,
    user,
    poolLoading,
    assetLoading,
    poolDataLoading,
    networkInfo,
    networkInfoLoading,
    rtVolumeLoading,
    rtVolume,
    tokenList,
    getPools,
    getTransactions,
    getRTVolume,
  } = props;

  const [poolStatus, selectPoolStatus] = useState<PoolDetailStatusEnum>(
    PoolDetailStatusEnum.Enabled,
  );
  const [currentTxPage, setCurrentTxPage] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>('');
  const history = useHistory();
  const { getUSDPrice, reducedPricePrefix, priceIndex } = usePrice();

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

  const { isValidFundCaps, outboundQueueLevel } = useNetwork();

  const chartData = useMemo(() => {
    if (rtVolumeLoading) {
      return { liquidity: [], volume: [], loading: true };
    }

    const volumeSeriesData = rtVolume?.map(volume => {
      return {
        time: volume?.time ?? 0,
        value: getUSDPrice(bnOrZero(volume?.totalVolume)),
      };
    });

    return {
      liquidity: generateRandomTimeSeries(0, 15, '2020-05-01'),
      volume: volumeSeriesData,
      loading: false,
    };
  }, [rtVolume, rtVolumeLoading, getUSDPrice]);

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
    if (refreshTxStatus) setCurrentTxPage(1);
  }, [refreshTxStatus]);

  useEffect(() => {
    getTransactionInfo((currentTxPage - 1) * 10, 10);
  }, [currentTxPage, getTransactionInfo]);

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
          description: 'You do not have available asset to create a new pool.',
        });
      }
    }
  };

  const handlePagination = useCallback(
    (page: number) => {
      setCurrentTxPage(page);
      getTransactionInfo((page - 1) * 10, 10);
    },
    [getTransactionInfo],
  );

  const onChangeKeywordHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    },
    [],
  );

  const renderTextCell = (text: string) => {
    if (loading) {
      return <LabelLoader />;
    }
    return <span>{text}</span>;
  };

  const renderCell = (text: string) => {
    if (loading) {
      return <LabelLoader />;
    }
    return (
      <span>
        {reducedPricePrefix} {text}
      </span>
    );
  };

  const renderPoolPriceCell = (text: string) => {
    if (assetLoading) {
      return <LabelLoader />;
    }
    return (
      <span>
        {reducedPricePrefix} {text}
      </span>
    );
  };

  const renderPoolTable = (poolViewData: PoolData[], view: ViewType) => {
    const buttonCol = {
      key: 'liquidity',
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
          const liquidityUrl = `/liquidity/${values.symbol.toUpperCase()}`;

          const buttonColors: {
            [key: string]: ButtonColor;
          } = {
            GOOD: 'primary',
            SLOW: 'warning',
            BUSY: 'error',
          };
          const btnColor: ButtonColor = buttonColors[outboundQueueLevel];

          return (
            <ActionColumn>
              <div className="action-column-wrapper">
                <Link
                  to={liquidityUrl}
                  onClick={ev => {
                    ev.stopPropagation();
                  }}
                >
                  <Button
                    style={{ margin: 'auto' }}
                    round="true"
                    typevalue="outline"
                    color={!isValidFundCaps ? 'error' : btnColor}
                  >
                    <DatabaseOutlined />
                    MANAGE
                  </Button>
                </Link>
                {poolStatus !== PoolDetailStatusEnum.Bootstrapped && (
                  <Link
                    to={swapUrl}
                    onClick={ev => {
                      ev.stopPropagation();
                    }}
                  >
                    <Button
                      style={{ margin: 'auto' }}
                      round="true"
                      color={btnColor}
                    >
                      <SwapOutlined />
                      SWAP
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
        render: (_: { target: string }, record: PoolData) => {
          const tokenName = getTokenName(tokenList, record.values.symbol);
          return <p>{tokenName}</p>;
        },
        sorter: (a: PoolData, b: PoolData) => a.target.localeCompare(b.target),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'symbol',
        title: 'symbol',
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
      },
      {
        key: 'depth',
        title: 'depth',
        dataIndex: ['values', 'depth'],
        render: renderCell,
        sorter: (a: PoolData, b: PoolData) =>
          a.depth.amount().minus(b.depth.amount()),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
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
        render: renderTextCell,
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

    const filteredData = poolViewData
      .filter(poolItem => {
        const tokenSymbol = poolItem.values.symbol.toLowerCase();
        const tokenName = getTokenName(
          tokenList,
          tokenSymbol.toUpperCase(),
        ).toLowerCase();

        return (
          tokenName.includes(keyword.toLowerCase()) ||
          tokenSymbol.includes(keyword.toLowerCase())
        );
      })
      .filter(poolData => {
        return (
          (poolStatus === PoolDetailStatusEnum.Enabled && !poolData.status) ||
          poolData.status === poolStatus
        );
      });

    return renderPoolTable(filteredData, view);
  };

  return (
    <ContentWrapper className="pool-view-wrapper">
      <StatBar
        loading={loading || networkInfoLoading}
        stats={stats}
        networkInfo={networkInfo}
      />
      <div>
        <PoolChart
          hasLiquidity={false}
          chartData={chartData}
          textColor={theme.palette.text[0]}
          lineColor={isLight ? '#436eb9' : '#1dd3e6'}
          backgroundGradientStart={isLight ? '#e4ebf8' : '#365979'}
          backgroundGradientStop={isLight ? '#ffffff' : '#0f1922'}
          gradientStart={isLight ? '#c5d3f0' : '#365979'}
          gradientStop={isLight ? '#ffffff' : '#0f1922'}
          viewMode={isDesktopView ? 'desktop-view' : 'mobile-view'}
          basePrice={busdPrice}
        />
      </div>
      <PoolViewTools>
        <PoolFilter selected={poolStatus} onClick={selectPoolStatus} />
        <div className="add-new-pool" onClick={handleNewPool}>
          <AddIcon />
          {isDesktopView && (
            <Label size="normal" weight="bold" color="normal">
              ADD NEW POOL
            </Label>
          )}
        </div>
      </PoolViewTools>
      <PoolSearchWrapper>
        <Input
          prefix={<SearchOutlined />}
          sizevalue="big"
          placeholder="Search pools..."
          value={keyword}
          onChange={onChangeKeywordHandler}
        />
      </PoolSearchWrapper>
      <div className="pool-list-view desktop-view">
        {renderPoolList(ViewType.DESKTOP)}
      </div>
      <div className="pool-list-view mobile-view">
        {renderPoolList(ViewType.MOBILE)}
      </div>
      <TransactionWrapper>
        <Label size="large" weight="bold" color="primary">
          Transactions
        </Label>
        <TxTable txData={txData} />
        <StyledPagination
          defaultCurrent={1}
          current={currentTxPage}
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
      tokenList: state.Binance.tokenList,
      pools: state.Midgard.pools,
      poolData: state.Midgard.poolData,
      stats: state.Midgard.stats,
      assets: state.Midgard.assets,
      poolLoading: state.Midgard.poolLoading,
      assetLoading: state.Midgard.assetLoading,
      poolDataLoading: state.Midgard.poolDataLoading,
      txData: state.Midgard.txData,
      refreshTxStatus: state.Midgard.refreshTxStatus,
      assetData: state.Wallet.assetData,
      user: state.Wallet.user,
      networkInfo: state.Midgard.networkInfo,
      networkInfoLoading: state.Midgard.networkInfoLoading,
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
