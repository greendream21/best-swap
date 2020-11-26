/* eslint-disable no-underscore-dangle */
import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { compose } from 'redux';
import { Row, Col, Grid, Popover } from 'antd';
import { connect } from 'react-redux';
import { get as _get } from 'lodash';
import { withRouter, useParams, Link, useHistory } from 'react-router-dom';
import { Token } from '@thorchain/asgardex-binance';
import { bnOrZero } from '@thorchain/asgardex-util';

import { SwapOutlined, DatabaseOutlined } from '@ant-design/icons';

import useNetwork from '../../hooks/useNetwork';

import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';

import * as midgardActions from '../../redux/midgard/actions';

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

import { getPoolData, isValidPool } from '../../helpers/utils/poolUtils';
import { PoolData } from '../../helpers/utils/types';
import { RootState } from '../../redux/store';
import { getAppContainer } from '../../helpers/elementHelper';

import {
  AssetDetailMap,
  PoolDataMap,
  PriceDataIndex,
  TxDetailData,
  RTAggregateData,
} from '../../redux/midgard/types';
import { RUNE_SYMBOL } from '../../settings/assetData';
import { PoolStatBar } from '../../components/statBar';
import PoolChart from '../../components/poolChart';
import TxTable from '../../components/transaction/txTable';
import { getTokenName } from '../../helpers/stringHelper';
import { PoolDetailStatusEnum } from '../../types/generated/midgard';

import usePrice from '../../hooks/usePrice';

type ChartDataValue = {
  time: number;
  value: string;
};

type ChartData = {
  liquidity: {
    allTime: ChartDataValue[];
    week: ChartDataValue[];
  };
  volume: {
    allTime: ChartDataValue[];
    week: ChartDataValue[];
  };
  loading: boolean;
};

type Props = {
  txData: TxDetailData;
  poolDetailedData: PoolDataMap;
  poolDetailedDataLoading: boolean;
  assets: AssetDetailMap;
  pools: string[];
  priceIndex: PriceDataIndex;
  rtAggregateLoading: boolean;
  rtAggregate: RTAggregateData;
  tokenList: Token[];
  refreshTxStatus: boolean;
  getRTAggregate: typeof midgardActions.getRTAggregateByAsset;
  getTxByAsset: typeof midgardActions.getTxByAsset;
  getPoolDetailByAsset: typeof midgardActions.getPoolDetailByAsset;
};

const PoolDetail: React.FC<Props> = (props: Props) => {
  const {
    pools,
    poolDetailedData,
    poolDetailedDataLoading,
    txData,
    priceIndex,
    rtAggregateLoading,
    rtAggregate,
    tokenList,
    refreshTxStatus,
    getRTAggregate,
    getTxByAsset,
    getPoolDetailByAsset,
  } = props;

  const { getUSDPrice, pricePrefix, runePrice } = usePrice();
  const [currentTxPage, setCurrentTxPage] = useState<number>(1);

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
    if (rtAggregateLoading) {
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
    const { allTimeData, weekData } = rtAggregate;

    const volumeSeriesDataAT: ChartDataValue[] = [];
    const liquiditySeriesDataAT: ChartDataValue[] = [];

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

    const volumeSeriesDataWeek: ChartDataValue[] = [];
    const liquiditySeriesDataWeek: ChartDataValue[] = [];

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
      liquidity: {
        allTime: liquiditySeriesDataAT,
        week: liquiditySeriesDataWeek,
      },
      volume: {
        allTime: volumeSeriesDataAT,
        week: volumeSeriesDataWeek,
      },
      loading: false,
    };
  }, [rtAggregate, rtAggregateLoading, getUSDPrice]);

  const getTransactionInfo = useCallback(
    (asset: string, offset: number, limit: number) => {
      getTxByAsset({ asset, offset, limit });
    },
    [getTxByAsset],
  );

  const getPoolDetailInfo = useCallback(
    (asset: string) => {
      getPoolDetailByAsset({ asset });
    },
    [getPoolDetailByAsset],
  );

  useEffect(() => {
    getPoolDetailInfo(tokenSymbol);
  }, [getPoolDetailInfo, tokenSymbol]);

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
    if (!isValidPool(pools, symbol)) {
      history.push('/');
    }
  }, [pools, history, symbol]);

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
  const poolStats = getPoolData(tokenSymbol, poolInfo, priceIndex);

  return (
    <ContentWrapper className="pool-detail-wrapper" transparent>
      <Row className="detail-info-header">{renderDetailCaption(poolStats)}</Row>
      <Row className="detail-info-view">
        <Col xs={24} sm={24} md={8}>
          <PoolStatBar
            stats={poolStats}
            poolInfo={poolInfo}
            loading={poolDetailedDataLoading}
          />
        </Col>
        <Col xs={24} sm={24} md={16}>
          <ChartContainer>
            <PoolChart chartData={chartData} />
          </ChartContainer>
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
      refreshTxStatus: state.Midgard.refreshTxStatus,
      pools: state.Midgard.pools,
      priceIndex: state.Midgard.priceIndex,
      txData: state.Midgard.txData,
      rtAggregateLoading: state.Midgard.rtAggregateLoading,
      rtAggregate: state.Midgard.rtAggregate,
    }),
    {
      getRTAggregate: midgardActions.getRTAggregateByAsset,
      getTxByAsset: midgardActions.getTxByAsset,
      getPoolDetailByAsset: midgardActions.getPoolDetailByAsset,
    },
  ),
  withRouter,
)(PoolDetail);
