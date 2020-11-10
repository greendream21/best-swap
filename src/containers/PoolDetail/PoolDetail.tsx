/* eslint-disable no-underscore-dangle */
import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { compose } from 'redux';
import { Row, Col } from 'antd';
import { connect, useSelector } from 'react-redux';
import { get as _get } from 'lodash';
import { withRouter, useParams, Link, useHistory } from 'react-router-dom';
import { Token } from '@thorchain/asgardex-binance';
import themes, { ThemeType } from '@thorchain/asgardex-theme';
import { bnOrZero } from '@thorchain/asgardex-util';

import { SwapOutlined, DatabaseOutlined } from '@ant-design/icons';

import useNetwork from '../../hooks/useNetwork';

import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import { ButtonColor } from '../../components/uielements/button/types';

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
} from './PoolDetail.style';

import { getPoolData, isValidPool } from '../../helpers/utils/poolUtils';
import { PoolData } from '../../helpers/utils/types';
import { RootState } from '../../redux/store';

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
import { getTickerFormat, getTokenName } from '../../helpers/stringHelper';
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
    assets,
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

  const { outboundQueueLevel, isValidFundCaps } = useNetwork();

  const history = useHistory();
  const { symbol = '' } = useParams();
  const tokenSymbol = symbol.toUpperCase();

  const busdToken = Object.keys(assets).find(
    item => getTickerFormat(item) === 'busd',
  );
  const busdPrice = busdToken ? assets[busdToken]?.priceRune ?? 'RUNE' : 'RUNE';

  const themeType = useSelector((state: RootState) => state.App.themeType);
  const isLight = themeType === ThemeType.LIGHT;
  const theme = isLight ? themes.light : themes.dark;

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

  const renderDetailCaption = (poolStats: PoolData, viewMode: string) => {
    const swapUrl = `/swap/${RUNE_SYMBOL}:${poolStats.values.symbol}`;
    const liquidityUrl = `/liquidity/${poolStats.values.symbol.toUpperCase()}`;

    const targetName = `${getTokenName(tokenList, poolStats.values.symbol)} (${
      poolStats.target
    })`;

    const poolPrice = `${pricePrefix} ${bnOrZero(poolInfo?.price)
      .multipliedBy(runePrice)
      .toFixed(3)}`;

    const poolStatus = poolInfo?.status ?? null;
    const buttonColors: {
      [key: string]: ButtonColor;
    } = {
      GOOD: 'primary',
      SLOW: 'warning',
      BUSY: 'error',
    };
    const btnColor: ButtonColor = buttonColors[outboundQueueLevel];

    return (
      <Col className={`pool-caption-container ${viewMode}`}>
        <PoolCaptionWrapper>
          <PoolCaptionTitle>{targetName}</PoolCaptionTitle>
          <PoolCaptionPrice>{poolPrice}</PoolCaptionPrice>
        </PoolCaptionWrapper>
        <PoolCaptionButtonsWrapper>
          <Link to={liquidityUrl}>
            <Button
              round="true"
              typevalue="outline"
              color={!isValidFundCaps ? 'error' : btnColor}
            >
              <DatabaseOutlined />
              add
            </Button>
          </Link>
          {poolStatus === PoolDetailStatusEnum.Enabled && (
            <Link to={swapUrl}>
              <Button
                round="true"
                color={!isValidFundCaps ? 'error' : btnColor}
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
  const assetDetail = assets?.[tokenSymbol];
  const poolStats = getPoolData(tokenSymbol, poolInfo, assetDetail, priceIndex);

  return (
    <ContentWrapper className="pool-detail-wrapper" transparent>
      <Row className="detail-info-header">
        {renderDetailCaption(poolStats, 'desktop-view')}
        {renderDetailCaption(poolStats, 'mobile-view')}
      </Row>
      <Row className="detail-info-view desktop-view">
        <Col span={8}>
          <PoolStatBar
            stats={poolStats}
            poolInfo={poolInfo}
            loading={poolDetailedDataLoading}
          />
        </Col>
        <Col span={16}>
          <ChartContainer>
            <PoolChart
              chartData={chartData}
              textColor={theme.palette.text[0]}
              lineColor={isLight ? '#436eb9' : '#1dd3e6'}
              backgroundGradientStart={isLight ? '#e4ebf8' : '#365979'}
              backgroundGradientStop={isLight ? '#ffffff' : '#0f1922'}
              gradientStart={isLight ? '#c5d3f0' : '#365979'}
              gradientStop={isLight ? '#ffffff' : '#0f1922'}
              viewMode="desktop-view"
              basePrice={busdPrice}
            />
          </ChartContainer>
        </Col>
      </Row>
      <Row className="detail-info-view mobile-view">
        <Col span={24}>
          <PoolStatBar stats={poolStats} poolInfo={poolInfo} />
        </Col>
        <Col span={24}>
          <PoolChart
            chartData={chartData}
            textColor={theme.palette.text[0]}
            lineColor={isLight ? '#436eb9' : '#1dd3e6'}
            backgroundGradientStart={isLight ? '#e4ebf8' : '#365979'}
            backgroundGradientStop={isLight ? '#ffffff' : '#0f1922'}
            gradientStart={isLight ? '#c5d3f0' : '#365979'}
            gradientStop={isLight ? '#ffffff' : '#0f1922'}
            viewMode="mobile-view"
            basePrice={busdPrice}
          />
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
      assets: state.Midgard.assets,
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
