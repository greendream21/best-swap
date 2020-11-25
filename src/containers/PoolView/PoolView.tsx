/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { withRouter, useHistory, Link } from 'react-router-dom';
import { Row, Col, Grid, Popover } from 'antd';
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
  PopoverContent,
  PopoverIcon,
} from './PoolView.style';
import {
  getAvailableTokensToCreate,
  getPoolData,
} from '../../helpers/utils/poolUtils';
import { PoolData } from '../../helpers/utils/types';
import { getTickerFormat, getTokenName } from '../../helpers/stringHelper';
import { getAppContainer } from '../../helpers/elementHelper';

import * as midgardActions from '../../redux/midgard/actions';
import { RootState } from '../../redux/store';
import { AssetData, User } from '../../redux/wallet/types';
import {
  PoolDataMap,
  TxDetailData,
  RTVolumeData,
} from '../../redux/midgard/types';
import { getAssetFromString } from '../../redux/midgard/utils';
import { Maybe } from '../../types/bepswap';
import {
  PoolDetailStatusEnum,
  StatsData,
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
import { PoolViewData } from './types';

type Props = {
  history: H.History;
  pools: string[];
  poolData: PoolDataMap;
  txData: TxDetailData;
  refreshTxStatus: boolean;
  stats: StatsData;
  assetData: AssetData[];
  user: Maybe<User>;
  poolLoading: boolean;
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
    assetData,
    user,
    poolLoading,
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

  const isDesktopView = Grid.useBreakpoint()?.md ?? true;
  const history = useHistory();
  const {
    getUSDPrice,
    reducedPricePrefix,
    priceIndex,
    hasBUSDPrice,
  } = usePrice();

  const themeType = useSelector((state: RootState) => state.App.themeType);
  const isLight = themeType === ThemeType.LIGHT;
  const theme = isLight ? themes.light : themes.dark;

  const loading = poolLoading || poolDataLoading;
  const wallet: Maybe<string> = user ? user.wallet : null;

  const {
    isValidFundCaps,
    statusColor,
    isOutboundDelayed,
    getOutboundBusyTooltip,
  } = useNetwork();

  const chartData = useMemo(() => {
    if (rtVolumeLoading) {
      return {
        liquidity: {
          allTime: [],
          week: [],
        },
        volume: {
          allTime: [],
          week: [],
        },
        loading: true,
      };
    }

    const { allTimeData, weekData } = rtVolume;

    const allTimeVolumeData = allTimeData?.map(volume => {
      return {
        time: volume?.time ?? 0,
        value: getUSDPrice(bnOrZero(volume?.totalVolume)),
      };
    });

    const weekVolumeData = weekData?.map(volume => {
      return {
        time: volume?.time ?? 0,
        value: getUSDPrice(bnOrZero(volume?.totalVolume)),
      };
    });

    const randomSeries = generateRandomTimeSeries(0, 15, '2020-05-01');

    return {
      liquidity: {
        allTime: randomSeries,
        week: randomSeries,
      },
      volume: {
        allTime: allTimeVolumeData,
        week: weekVolumeData,
      },
      loading: false,
    };
  }, [rtVolume, rtVolumeLoading, getUSDPrice]);

  const getTransactionInfo = useCallback(
    (offset: number, limit: number) => {
      getTransactions({ offset, limit });
    },
    [getTransactions],
  );

  useEffect(() => {
    if (refreshTxStatus) setCurrentTxPage(1);
  }, [refreshTxStatus]);

  useEffect(() => {
    getTransactionInfo((currentTxPage - 1) * 10, 10);
  }, [currentTxPage, getTransactionInfo]);

  useEffect(() => {
    getRTVolume({});
  }, [getRTVolume]);

  const handleSelectPoolStatus = useCallback(
    (status: PoolDetailStatusEnum) => {
      selectPoolStatus(status);

      if (status === PoolDetailStatusEnum.Enabled) {
        getPools('enabled');
      } else {
        getPools('bootstrap');
      }
    },
    [selectPoolStatus, getPools],
  );

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

  const handleRefresh = useCallback(() => {
    if (poolStatus === PoolDetailStatusEnum.Enabled) {
      getPools('enabled');
    } else {
      getPools('bootstrap');
    }
  }, [getPools, poolStatus]);

  const renderTextCell = useCallback(
    (text: string) => {
      if (loading) {
        return <LabelLoader />;
      }
      return <span>{text}</span>;
    },
    [loading],
  );

  const renderCell = useCallback(
    (text: string) => {
      if (loading) {
        return <LabelLoader />;
      }
      return (
        <span>
          {reducedPricePrefix} {text}
        </span>
      );
    },
    [loading, reducedPricePrefix],
  );

  const renderPoolPriceCell = useCallback(
    (text: string) => {
      if (poolLoading) {
        return <LabelLoader />;
      }
      return (
        <span>
          {reducedPricePrefix} {text}
        </span>
      );
    },
    [poolLoading, reducedPricePrefix],
  );

  const withOutboundTooltip = useCallback(
    (Component: JSX.Element) => {
      if (!isOutboundDelayed) {
        return Component;
      }

      return (
        <Popover
          content={<PopoverContent>{getOutboundBusyTooltip()}</PopoverContent>}
          getPopupContainer={getAppContainer}
          placement="topRight"
          overlayStyle={{
            padding: '6px',
            animationDuration: '0s !important',
            animation: 'none !important',
          }}
        >
          {Component}
        </Popover>
      );
    },
    [isOutboundDelayed, getOutboundBusyTooltip],
  );

  const buttonCol = useMemo(
    () => ({
      key: 'refresh',
      title: (
        <ActionHeader>
          <Button
            onClick={handleRefresh}
            typevalue="outline"
            round="true"
            color={!isValidFundCaps ? 'error' : statusColor}
          >
            <SyncOutlined />
            refresh
          </Button>
          {isOutboundDelayed && (
            <Popover
              content={
                <PopoverContent>{getOutboundBusyTooltip()}</PopoverContent>
              }
              getPopupContainer={getAppContainer}
              placement="topRight"
              overlayStyle={{
                padding: '6px',
                animationDuration: '0s !important',
                animation: 'none !important',
              }}
            >
              <PopoverIcon color={statusColor} />
            </Popover>
          )}
        </ActionHeader>
      ),
      render: (text: string, record: PoolData) => {
        const { target, values } = record;
        if (target) {
          const swapUrl = `/swap/${RUNE_SYMBOL}:${values.symbol}`;
          const liquidityUrl = `/liquidity/${values.symbol.toUpperCase()}`;

          return (
            <ActionColumn>
              <div className="action-column-wrapper">
                {withOutboundTooltip(
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
                      color={!isValidFundCaps ? 'error' : statusColor}
                    >
                      <DatabaseOutlined />
                      MANAGE
                    </Button>
                  </Link>,
                )}
                {poolStatus !== PoolDetailStatusEnum.Bootstrapped &&
                  withOutboundTooltip(
                    <Link
                      to={swapUrl}
                      onClick={ev => {
                        ev.stopPropagation();
                      }}
                    >
                      <Button
                        style={{ margin: 'auto' }}
                        round="true"
                        color={statusColor}
                      >
                        <SwapOutlined />
                        SWAP
                      </Button>
                    </Link>,
                  )}
              </div>
            </ActionColumn>
          );
        }
      },
    }),
    [
      statusColor,
      isValidFundCaps,
      poolStatus,
      isOutboundDelayed,
      getOutboundBusyTooltip,
      withOutboundTooltip,
      handleRefresh,
    ],
  );

  const mobileColumns = useMemo(
    () => [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ target }: { target: string }) => (
          <Row>
            <Col xs={24} style={{ display: 'flex', justifyContent: 'center' }}>
              <CoinIcon type={target} size="small" />
            </Col>
          </Row>
        ),
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
    ],
    [renderCell, renderPoolPriceCell],
  );

  const desktopColumns = useMemo(
    () => [
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
    ],
    [renderCell, renderTextCell, renderPoolPriceCell, buttonCol, tokenList],
  );

  // calculate data to show in the pool list

  const poolViewData: PoolViewData[] = useMemo(
    () =>
      pools.map((poolName, index) => {
        const { symbol = '' } = getAssetFromString(poolName);

        const poolInfo = poolData[symbol] || {};
        const poolDataDetail: PoolData = getPoolData(
          symbol,
          poolInfo,
          priceIndex,
        );

        return {
          ...poolDataDetail,
          status: poolInfo?.status ?? null,
          key: index,
        };
      }),
    [poolData, pools, priceIndex],
  );

  const filteredData = useMemo(
    () =>
      poolViewData
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
        }),
    [poolViewData, keyword, poolStatus, tokenList],
  );

  const columns = isDesktopView ? desktopColumns : mobileColumns;

  const renderPoolTable = useMemo(() => {
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
        dataSource={filteredData}
        loading={poolLoading}
        rowKey="key"
      />
    );
  }, [columns, filteredData, poolLoading, history]);

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
          hasBUSDPrice={hasBUSDPrice}
        />
      </div>
      <PoolViewTools>
        <PoolFilter selected={poolStatus} onClick={handleSelectPoolStatus} />
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
      <div className="pool-list-view">{renderPoolTable}</div>
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
      poolLoading: state.Midgard.poolLoading,
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
