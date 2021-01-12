/* eslint-disable no-underscore-dangle */
import React, { useEffect, useMemo, useState } from 'react';

import { connect } from 'react-redux';
import { withRouter, useParams, Link } from 'react-router-dom';

import { SwapOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Token } from '@thorchain/asgardex-binance';
import { bnOrZero } from '@thorchain/asgardex-util';
import { Row, Col, Grid, Popover } from 'antd';
import { get as _get } from 'lodash';
import { compose } from 'redux';

import Chart from 'components/chart';
import {
  ChartDetail,
  ChartValues,
  ChartData,
} from 'components/chart/types';
import { PoolStatBar } from 'components/statBar';
import TxTable from 'components/transaction/txTable';
import Button from 'components/uielements/button';
import Loader from 'components/utility/loaders/pageLoader';

import * as midgardActions from 'redux/midgard/actions';
import {
  AssetDetailMap,
  PoolDataMap,
  PriceDataIndex,
  RTAggregateData,
} from 'redux/midgard/types';
import { RootState } from 'redux/store';

import useMidgard from 'hooks/useMidgard';
import useNetwork from 'hooks/useNetwork';
import usePrice from 'hooks/usePrice';

import { getAppContainer } from 'helpers/elementHelper';
import { getTokenName } from 'helpers/stringHelper';
import { getPoolData } from 'helpers/utils/poolUtils';
import { PoolData } from 'helpers/utils/types';

import { RUNE_SYMBOL } from 'settings/assetData';

import { PoolDetailStatusEnum } from 'types/generated/midgard';

import {
  ContentWrapper,
  PoolCaptionWrapper,
  PoolCaptionTitle,
  PoolCaptionPrice,
  PoolCaptionButtonsWrapper,
  ChartContainer,
  PopoverContent,
  PopoverIcon,
} from './PoolDetail.style';

type Props = {
  poolDetailedData: PoolDataMap;
  poolDetailedDataLoading: boolean;
  assets: AssetDetailMap;
  priceIndex: PriceDataIndex;
  rtAggregateLoading: boolean;
  rtAggregate: RTAggregateData;
  tokenList: Token[];
  getRTAggregate: typeof midgardActions.getRTAggregateByAsset;
  getPoolDetailByAsset: typeof midgardActions.getPoolDetailByAsset;
};

const PoolDetail: React.FC<Props> = (props: Props) => {
  const {
    poolDetailedData,
    poolDetailedDataLoading,
    priceIndex,
    rtAggregateLoading,
    rtAggregate,
    tokenList,
    getRTAggregate,
    getPoolDetailByAsset,
  } = props;

  const { isValidPool } = useMidgard();

  const { getUSDPrice, pricePrefix, runePrice } = usePrice();
  const [selectedChart, setSelectedChart] = useState('Volume');

  const {
    isValidFundCaps,
    statusColor,
    isOutboundDelayed,
    getOutboundBusyTooltip,
  } = useNetwork();
  const isDesktopView = Grid.useBreakpoint().md;
  const viewModeClass = isDesktopView ? 'desktop-view' : 'mobile-view';

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
      <Chart
        chartIndexes={['Liquidity', 'Volume']}
        chartData={chartData}
        selectedIndex={selectedChart}
        selectChart={setSelectedChart}
      />
    </ChartContainer>
  );

  useEffect(() => {
    getPoolDetailByAsset({
      asset: tokenSymbol,
    });
  }, [getPoolDetailByAsset, tokenSymbol]);

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

  if (!isValidPool(symbol)) {
    return <Loader />;
  }

  const poolInfo = poolDetailedData[tokenSymbol] || {};
  const poolStats = getPoolData(tokenSymbol, poolInfo, priceIndex);

  return (
    <ContentWrapper className="pool-detail-wrapper" transparent>
      <Row>{renderDetailCaption(poolStats)}</Row>
      <Row>
        <Col xs={24} sm={24} md={8}>
          <PoolStatBar
            stats={poolStats}
            poolInfo={poolInfo}
            loading={poolDetailedDataLoading}
          />
        </Col>
        <Col xs={24} sm={24} md={16}>
          {renderChart()}
        </Col>
      </Row>
      <TxTable asset={tokenSymbol} />
    </ContentWrapper>
  );
};

export default compose(
  connect(
    (state: RootState) => ({
      tokenList: state.Binance.tokenList,
      poolDetailedData: state.Midgard.poolDetailedData,
      poolDetailedDataLoading: state.Midgard.poolDetailedDataLoading,
      priceIndex: state.Midgard.priceIndex,
      rtAggregateLoading: state.Midgard.rtAggregateLoading,
      rtAggregate: state.Midgard.rtAggregate,
    }),
    {
      getRTAggregate: midgardActions.getRTAggregateByAsset,
      getPoolDetailByAsset: midgardActions.getPoolDetailByAsset,
    },
  ),
  withRouter,
)(PoolDetail);
