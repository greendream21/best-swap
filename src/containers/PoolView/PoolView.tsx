/* eslint-disable no-underscore-dangle */
import React, { useCallback, useMemo, useState } from 'react';

import { connect } from 'react-redux';
import { withRouter, useHistory, Link } from 'react-router-dom';

import {
  SearchOutlined,
  SyncOutlined,
  SwapOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { Token } from '@thorchain/asgardex-binance';
import { Row, Col, Grid, Popover } from 'antd';
import * as H from 'history';
import { compose } from 'redux';

import Helmet from 'components/helmet';
import PoolFilter from 'components/poolFilter';
import StatBar from 'components/statBar';
import TxTable from 'components/transaction/txTable';
import AddIcon from 'components/uielements/addIcon';
import Button from 'components/uielements/button';
import CoinIcon from 'components/uielements/coins/coinIcon';
import Input from 'components/uielements/input';
import Label from 'components/uielements/label';
import showNotification from 'components/uielements/notification';
import LabelLoader from 'components/utility/loaders/label';

import * as midgardActions from 'redux/midgard/actions';
import { PoolDataMap } from 'redux/midgard/types';
import { getAssetFromString } from 'redux/midgard/utils';
import { RootState } from 'redux/store';
import { AssetData, User } from 'redux/wallet/types';

import useNetwork from 'hooks/useNetwork';
import usePrice from 'hooks/usePrice';

import { getAppContainer } from 'helpers/elementHelper';
import { getTickerFormat, getTokenName } from 'helpers/stringHelper';
import {
  getAvailableTokensToCreate,
  getPoolData,
} from 'helpers/utils/poolUtils';
import { PoolData } from 'helpers/utils/types';

import { RUNE_SYMBOL } from 'settings/assetData';

import { Maybe } from 'types/bepswap';
import {
  PoolDetailStatusEnum,
  StatsData,
  NetworkInfo,
} from 'types/generated/midgard/api';

import ChartView from './ChartView';
import {
  ContentWrapper,
  ActionHeader,
  ActionColumn,
  PoolViewTools,
  PoolSearchWrapper,
  StyledTable as Table,
  PopoverContent,
  PopoverIcon,
} from './PoolView.style';
import { PoolViewData } from './types';

type Props = {
  history: H.History;
  pools: string[];
  poolData: PoolDataMap;
  stats: StatsData;
  assetData: AssetData[];
  user: Maybe<User>;
  statsLoading: boolean;
  poolLoading: boolean;
  poolDataLoading: boolean;
  networkInfo: NetworkInfo;
  networkInfoLoading: boolean;
  tokenList: Token[];
  getPools: typeof midgardActions.getPools;
};

const PoolView: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    pools,
    poolData,
    stats,
    assetData,
    user,
    statsLoading,
    poolLoading,
    poolDataLoading,
    networkInfo,
    networkInfoLoading,
    tokenList,
    getPools,
  } = props;

  const isDesktopView = Grid.useBreakpoint()?.md ?? true;
  const [poolStatus, selectPoolStatus] = useState<PoolDetailStatusEnum>(
    PoolDetailStatusEnum.Enabled,
  );
  const [keyword, setKeyword] = useState<string>('');

  const history = useHistory();
  const { reducedPricePrefix, priceIndex } = usePrice();

  const loading = poolLoading || poolDataLoading;
  const wallet: Maybe<string> = user ? user.wallet : null;

  const {
    isValidFundCaps,
    statusColor,
    isOutboundDelayed,
    getOutboundBusyTooltip,
  } = useNetwork();

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
        render: renderCell,
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
    [renderCell],
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
        render: renderCell,
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
    [renderCell, renderTextCell, buttonCol, tokenList],
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
      <Helmet title="BEPSwap" content="BEPSwap is Binance Chain's first decentralised finance application allowing BEP2 token holders to swap their assets, or stake them to provide liquidity to the market." />
      <StatBar
        loading={statsLoading || networkInfoLoading}
        stats={stats}
        networkInfo={networkInfo}
      />
      <ChartView />
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
      <TxTable />
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
      statsLoading: state.Midgard.statsLoading,
      poolLoading: state.Midgard.poolLoading,
      poolDataLoading: state.Midgard.poolDataLoading,
      assetData: state.Wallet.assetData,
      user: state.Wallet.user,
      networkInfo: state.Midgard.networkInfo,
      networkInfoLoading: state.Midgard.networkInfoLoading,
    }),
    {
      getPools: midgardActions.getPools,
    },
  ),
  withRouter,
)(PoolView);
