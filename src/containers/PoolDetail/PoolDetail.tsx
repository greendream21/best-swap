/* eslint-disable no-underscore-dangle */
import React, { useEffect, useCallback, useMemo } from 'react';
import * as H from 'history';
import moment from 'moment';
import { compose } from 'redux';
import { Row, Col } from 'antd';
import { connect, useSelector } from 'react-redux';
import { get as _get, random } from 'lodash';
import { withRouter, useParams, Link } from 'react-router-dom';
import { Token } from '@thorchain/asgardex-binance';
import themes, { ThemeType } from '@thorchain/asgardex-theme';
import { baseAmount, formatBaseAsTokenAmount } from '@thorchain/asgardex-token';
import { bnOrZero } from '@thorchain/asgardex-util';

import { SwapOutlined, DatabaseOutlined } from '@ant-design/icons';

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
} from './PoolDetail.style';

import { getPoolData } from '../../helpers/utils/poolUtils';
import { PoolData } from '../../helpers/utils/types';
import { RootState } from '../../redux/store';

import {
  AssetDetailMap,
  PoolDataMap,
  PriceDataIndex,
  TxDetailData,
  RTVolumeData,
} from '../../redux/midgard/types';
import { RUNE_SYMBOL } from '../../settings/assetData';
import { PoolStatBar } from '../../components/statBar';
import PoolChart from '../../components/poolChart';
import TxTable from '../../components/transaction/txTable';
import { getTickerFormat, getTokenName } from '../../helpers/stringHelper';

type Props = {
  history: H.History;
  txData: TxDetailData;
  poolDetailedData: PoolDataMap;
  poolDetailedDataLoading: boolean;
  assets: AssetDetailMap;
  priceIndex: PriceDataIndex;
  rtVolumeLoading: boolean;
  rtVolume: RTVolumeData;
  tokenList: Token[];
  getRTVolume: typeof midgardActions.getRTVolumeByAsset;
  getTxByAsset: typeof midgardActions.getTxByAsset;
  getPoolDetailByAsset: typeof midgardActions.getPoolDetailByAsset;
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
      value: (
        minValue +
        (random(100) / 100) * (maxValue - minValue)
      ).toString(),
    });
  }
  return series;
};

const PoolDetail: React.FC<Props> = (props: Props) => {
  const {
    assets,
    poolDetailedData,
    poolDetailedDataLoading,
    txData,
    priceIndex,
    rtVolumeLoading,
    rtVolume,
    tokenList,
    getRTVolume,
    getTxByAsset,
    getPoolDetailByAsset,
  } = props;

  const { symbol = '' } = useParams();
  const tokenSymbol = symbol.toUpperCase();
  const busdToken = Object.keys(assets).find(
    item => getTickerFormat(item) === 'busd',
  );
  const busdPrice = busdToken ? assets[busdToken]?.priceRune ?? 'RUNE' : 'RUNE';

  const themeType = useSelector((state: RootState) => state.App.themeType);
  const isLight = themeType === ThemeType.LIGHT;
  const theme = isLight ? themes.light : themes.dark;

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

  const getRTVolumeInfo = useCallback(
    (
      asset: string,
      from: number,
      to: number,
      interval: '5min' | 'hour' | 'day' | 'week' | 'month' | 'year',
    ) => {
      getRTVolume({ asset, from, to, interval });
    },
    [getRTVolume],
  );

  useEffect(() => {
    const timeStamp: number = moment().unix();
    getRTVolumeInfo(tokenSymbol, 0, timeStamp, 'day');
  }, [getRTVolumeInfo, tokenSymbol]);

  const getUSDPrice = (price: number, busdPrice: number) => {
    const prefix = busdPrice ? '$' : 'ᚱ';
    const bnValue = busdPrice
      ? bnOrZero(price)
          .dividedBy(busdPrice)
          .toNumber()
      : price;
    return `${prefix}${bnValue.toFixed(3)}`;
  };

  const renderDetailCaption = (poolStats: PoolData, viewMode: string) => {
    const swapUrl = `/swap/${RUNE_SYMBOL}:${poolStats.values.symbol}`;
    const stakeUrl = `/stake/${poolStats.values.symbol.toUpperCase()}`;

    const targetName = `${
      poolStats.target
    } (${getTokenName(tokenList, poolStats.target)})`;

    const poolPriceInRune = bnOrZero(poolInfo?.price).toNumber();
    const busdPriceInRune = busdToken
      ? bnOrZero(assets[busdToken]?.priceRune).toNumber()
      : 0;
    const poolPrice = getUSDPrice(poolPriceInRune, busdPriceInRune);

    return (
      <Col className={`pool-caption-container ${viewMode}`}>
        <PoolCaptionWrapper>
          <PoolCaptionTitle>{targetName}</PoolCaptionTitle>
          <PoolCaptionPrice>{poolPrice}</PoolCaptionPrice>
        </PoolCaptionWrapper>
        <PoolCaptionButtonsWrapper>
          <Link to={stakeUrl}>
            <Button round="true" typevalue="outline">
              <DatabaseOutlined />
              stake
            </Button>
          </Link>
          <Link to={swapUrl}>
            <Button round="true">
              <SwapOutlined />
              swap
            </Button>
          </Link>
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
            basePrice={busdPrice}
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
          <PoolStatBar
            stats={poolStats}
            poolInfo={poolInfo}
            basePrice={busdPrice}
          />
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
            defaultCurrent={0}
            total={txData._tag === 'RemoteSuccess' ? txData.value.count : 0}
            showSizeChanger={false}
            onChange={page => {
              getTransactionInfo(tokenSymbol, (page - 1) * 10, 10);
            }}
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
      assets: state.Midgard.assets,
      priceIndex: state.Midgard.priceIndex,
      txData: state.Midgard.txData,
      rtVolumeLoading: state.Midgard.rtVolumeLoading,
      rtVolume: state.Midgard.rtVolume,
    }),
    {
      getRTVolume: midgardActions.getRTVolumeByAsset,
      getTxByAsset: midgardActions.getTxByAsset,
      getPoolDetailByAsset: midgardActions.getPoolDetailByAsset,
    },
  ),
  withRouter,
)(PoolDetail);
