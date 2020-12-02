/* eslint-disable no-underscore-dangle */
import React, { useEffect, useCallback, useMemo, useState } from 'react';

import { connect } from 'react-redux';
import { withRouter, useParams, Link, useHistory } from 'react-router-dom';

import { SwapOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Token } from '@thorchain/asgardex-binance';
import { bnOrZero } from '@thorchain/asgardex-util';
import { Row, Col, Grid, Popover } from 'antd';
import { get as _get } from 'lodash';
import { compose } from 'redux';

import PoolChart from 'components/poolChart';
import {
  ChartDetail,
  ChartValues,
  ChartData,
} from 'components/poolChart/types';
import { PoolStatBar } from 'components/statBar';
import TxTable from 'components/transaction/txTable';
import Button from 'components/uielements/button';
import Label from 'components/uielements/label';

import * as midgardActions from 'redux/midgard/actions';
import {
  AssetDetailMap,
  PoolDataMap,
  PriceDataIndex,
  TxDetailData,
  RTAggregateData,
  PoolEarningDetailsMap,
} from 'redux/midgard/types';
import { RootState } from 'redux/store';

import useNetwork from 'hooks/useNetwork';
import usePrice from 'hooks/usePrice';

import { getAppContainer } from 'helpers/elementHelper';
import { getTokenName } from 'helpers/stringHelper';
import { getPoolData, isValidPool } from 'helpers/utils/poolUtils';
import { PoolData } from 'helpers/utils/types';

import { RUNE_SYMBOL } from 'settings/assetData';

import { PoolDetailStatusEnum } from 'types/generated/midgard';

import {
  ContentWrapper,
  PoolCaptionWrapper,
  PoolCaptionTitle,
  PoolCaptionPrice,
  PoolCaptionButtonsWrapper,
  TransactionWrapper,
  StyledPagination,
  ChartContainer,
  PopoverContent,
  PopoverIcon,
} from './PoolDetail.style';

type Props = {
  txData: TxDetailData;
  poolDetailedData: PoolDataMap;
  poolDetailedDataLoading: boolean;
  poolEarningDetails: PoolEarningDetailsMap;
  poolEarningDetailsLoading: boolean;
  assets: AssetDetailMap;
  pools: string[];
  poolLoading: boolean;
  priceIndex: PriceDataIndex;
  rtAggregateLoading: boolean;
  rtAggregate: RTAggregateData;
  tokenList: Token[];
  refreshTxStatus: boolean;
  getRTAggregate: typeof midgardActions.getRTAggregateByAsset;
  getTxByAsset: typeof midgardActions.getTxByAsset;
  getPoolDetailByAsset: typeof midgardActions.getPoolDetailByAsset;
  getPoolEarningDetails: typeof midgardActions.getPoolEarningDetails;
};

const PoolDetail: React.FC<Props> = (props: Props) => {
  const {
    pools,
    poolLoading,
    poolDetailedData,
    poolDetailedDataLoading,
    poolEarningDetails,
    poolEarningDetailsLoading,
    txData,
    priceIndex,
    rtAggregateLoading,
    rtAggregate,
    tokenList,
    refreshTxStatus,
    getRTAggregate,
    getTxByAsset,
    getPoolDetailByAsset,
    getPoolEarningDetails,
  } = props;

  const { getUSDPrice, pricePrefix, runePrice } = usePrice();
  const [currentTxPage, setCurrentTxPage] = useState<number>(1);
  const [selectedChart, setSelectedChart] = useState('Volume');

  const {
    isValidFundCaps,
    statusColor,
    isOutboundDelayed,
    getOutboundBusyTooltip,
  } = useNetwork();
  const isDesktopView = Grid.useBreakpoint().md;
  const viewModeClass = isDesktopView ? 'desktop-view' : 'mobile-view';

  const history = useHistory();
  const { symbol = '' } = useParams();
  const tokenSymbol = symbol.toUpperCase();

  const chartData: ChartData = useMemo(() => {
    const defaultChartValues: ChartValues = {
      allTime: [],
      week: [],
    };
    if (rtAggregateLoading) {
      return {
        Liquidity: {
          values: defaultChartValues,
          loading: true,
        },
        Volume: {
          values: defaultChartValues,
          loading: true,
        },
      };
    }
    const { allTimeData, weekData } = rtAggregate;

    const volumeSeriesDataAT: ChartDetail[] = [];
    const liquiditySeriesDataAT: ChartDetail[] = [];

    allTimeData.forEach(data => {
      const time = data?.time ?? 0;
      const volumeData = {
        time,
        value: getUSDPrice(bnOrZero(data?.poolVolume).multipliedBy(2)),
      };
      const liquidityData = {
        time,
        value: getUSDPrice(bnOrZero(data?.runeDepth).multipliedBy(2)),
      };

      volumeSeriesDataAT.push(volumeData);
      liquiditySeriesDataAT.push(liquidityData);
    });

    const volumeSeriesDataWeek: ChartDetail[] = [];
    const liquiditySeriesDataWeek: ChartDetail[] = [];

    weekData.forEach(data => {
      const time = data?.time ?? 0;
      const volumeData = {
        time,
        value: getUSDPrice(bnOrZero(data?.poolVolume).multipliedBy(2)),
      };
      const liquidityData = {
        time,
        value: getUSDPrice(bnOrZero(data?.runeDepth).multipliedBy(2)),
      };

      volumeSeriesDataWeek.push(volumeData);
      liquiditySeriesDataWeek.push(liquidityData);
    });

    return {
      Liquidity: {
        values: {
          allTime: liquiditySeriesDataAT,
          week: liquiditySeriesDataWeek,
        },
        loading: false,
        type: 'line',
      },
      Volume: {
        values: {
          allTime: volumeSeriesDataAT,
          week: volumeSeriesDataWeek,
        },
        loading: false,
        type: 'bar',
      },
    };
  }, [rtAggregate, rtAggregateLoading, getUSDPrice]);

  const renderChart = () => (
    <ChartContainer>
      <PoolChart
        chartIndexes={['Liquidity', 'Volume']}
        chartData={chartData}
        selectedIndex={selectedChart}
        selectChart={setSelectedChart}
      />
    </ChartContainer>
  );

  const getTransactionInfo = useCallback(
    (asset: string, offset: number, limit: number) => {
      getTxByAsset({ asset, offset, limit });
    },
    [getTxByAsset],
  );

  useEffect(() => {
    getPoolDetailByAsset({
      asset: tokenSymbol,
    });
  }, [getPoolDetailByAsset, tokenSymbol]);

  useEffect(() => {
    getPoolEarningDetails(tokenSymbol);
  }, [getPoolEarningDetails, tokenSymbol]);

  useEffect(() => {
    getTransactionInfo(tokenSymbol, 0, 10);
  }, [getTransactionInfo, tokenSymbol]);

  useEffect(() => {
    if (refreshTxStatus) {
      setCurrentTxPage(1);
      getTransactionInfo(tokenSymbol, 0, 10);
    }
  }, [getTransactionInfo, tokenSymbol, refreshTxStatus]);

  // check if asset pool is valid
  useEffect(() => {
    if (!poolLoading && !isValidPool(pools, symbol)) {
      history.push('/');
    }
  }, [pools, history, symbol, poolLoading]);

  const handlePagination = useCallback(
    (page: number) => {
      setCurrentTxPage(page);
      getTransactionInfo(tokenSymbol, (page - 1) * 10, 10);
    },
    [getTransactionInfo, tokenSymbol],
  );

  useEffect(() => {
    getRTAggregate({ asset: tokenSymbol });
  }, [getRTAggregate, tokenSymbol]);

  const renderDetailCaption = (poolStats: PoolData) => {
    const swapUrl = `/swap/${RUNE_SYMBOL}:${poolStats.values.symbol}`;
    const liquidityUrl = `/liquidity/${poolStats.values.symbol.toUpperCase()}`;

    const targetName = `${getTokenName(tokenList, poolStats.values.symbol)} (${
      poolStats.target
    })`;

    const poolPrice = `${pricePrefix} ${bnOrZero(poolInfo?.price)
      .multipliedBy(runePrice)
      .toFixed(3)}`;

    const poolStatus = poolInfo?.status ?? null;

    return (
      <Col className={`pool-caption-container ${viewModeClass}`}>
        <PoolCaptionWrapper>
          <PoolCaptionTitle>{targetName}</PoolCaptionTitle>
          <PoolCaptionPrice>{poolPrice}</PoolCaptionPrice>
        </PoolCaptionWrapper>
        <PoolCaptionButtonsWrapper>
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
          <Link to={liquidityUrl}>
            <Button
              round="true"
              typevalue="outline"
              color={!isValidFundCaps ? 'error' : statusColor}
            >
              <DatabaseOutlined />
              add
            </Button>
          </Link>
          {poolStatus === PoolDetailStatusEnum.Enabled && (
            <Link to={swapUrl}>
              <Button
                round="true"
                color={!isValidFundCaps ? 'error' : statusColor}
              >
                <SwapOutlined />
                swap
              </Button>
            </Link>
          )}
        </PoolCaptionButtonsWrapper>
      </Col>
    );
  };

  const poolInfo = poolDetailedData[tokenSymbol] || {};
  const poolEarning = poolEarningDetails[tokenSymbol] || {};
  const poolStats = getPoolData(tokenSymbol, poolInfo, priceIndex);

  return (
    <ContentWrapper className="pool-detail-wrapper" transparent>
      <Row>{renderDetailCaption(poolStats)}</Row>
      <Row>
        <Col xs={24} sm={24} md={8}>
          <PoolStatBar
            stats={poolStats}
            poolInfo={poolInfo}
            poolEarning={poolEarning}
            loading={poolDetailedDataLoading && poolEarningDetailsLoading}
          />
        </Col>
        <Col xs={24} sm={24} md={16}>
          {renderChart()}
        </Col>
      </Row>
      <Row className="detail-transaction-view">
        <TransactionWrapper>
          <Label size="big" color="primary">
            Transactions (
            {txData._tag === 'RemoteSuccess' ? txData.value.count : 0})
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
      </Row>
    </ContentWrapper>
  );
};

export default compose(
  connect(
    (state: RootState) => ({
      tokenList: state.Binance.tokenList,
      poolDetailedData: state.Midgard.poolDetailedData,
      poolDetailedDataLoading: state.Midgard.poolDetailedDataLoading,
      poolEarningDetails: state.Midgard.poolEarningDetails,
      poolEarningDetailsLoading: state.Midgard.poolEarningDetailsLoading,
      refreshTxStatus: state.Midgard.refreshTxStatus,
      pools: state.Midgard.pools,
      poolLoading: state.Midgard.poolLoading,
      priceIndex: state.Midgard.priceIndex,
      txData: state.Midgard.txData,
      rtAggregateLoading: state.Midgard.rtAggregateLoading,
      rtAggregate: state.Midgard.rtAggregate,
    }),
    {
      getRTAggregate: midgardActions.getRTAggregateByAsset,
      getTxByAsset: midgardActions.getTxByAsset,
      getPoolDetailByAsset: midgardActions.getPoolDetailByAsset,
      getPoolEarningDetails: midgardActions.getPoolEarningDetails,
    },
  ),
  withRouter,
)(PoolDetail);
