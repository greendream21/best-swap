import React, { useEffect, useCallback } from 'react';
import * as H from 'history';
import moment from 'moment';
import { compose } from 'redux';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { connect, useSelector } from 'react-redux';
import { get as _get, random } from 'lodash';
import { withRouter, useParams, Link } from 'react-router-dom';
import themes, { ThemeType } from '@thorchain/asgardex-theme';

import {
  SwapOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

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
} from './PoolDetail.style';

import { getPoolData } from '../../helpers/utils/poolUtils';
import { PoolData } from '../../helpers/utils/types';
import { RootState } from '../../redux/store';

import {
  AssetDetailMap,
  PoolDataMap,
  PriceDataIndex,
  TxDetailData,
} from '../../redux/midgard/types';
import { RUNE_SYMBOL } from '../../settings/assetData';
import { PoolStatBar } from '../../components/statBar';
import PoolChart from '../../components/poolChart';
import TxTable from '../../components/transaction/txTable';

type Props = {
  history: H.History;
  txData: TxDetailData;
  poolData: PoolDataMap;
  assets: AssetDetailMap;
  priceIndex: PriceDataIndex;
  getTransactions: typeof midgardActions.getTransaction;
};

const generateRandomTimeSeries = (minValue: number, maxValue: number, startDate: string) => {
  const series = [];
  for (let itr = moment(startDate); itr.isBefore(moment.now()); itr = itr.add(1, 'day')) {
    series.push({
      time: itr.format('YYYY-MM-DD'),
      value: minValue + (random(100) / 100) * (maxValue - minValue),
    });
  }
  return series;
};

const chartData = {
  liquidity: generateRandomTimeSeries(1, 10, '2020-05-01'),
  volume: generateRandomTimeSeries(2, 15, '2020-05-01'),
};

const PoolDetail: React.FC<Props> = (props: Props) => {
  const {
    assets,
    poolData,
    txData,
    priceIndex,
    getTransactions,
  } = props;

  const { symbol = '' } = useParams();
  const tokenSymbol = symbol.toUpperCase();
  const busdPrice = assets?.['BUSD-BAF']?.priceRune ?? '1';

  const themeType = useSelector((state: RootState) => state.App.themeType);
  const isLight = themeType === ThemeType.LIGHT;
  const theme = isLight ? themes.light : themes.dark;

  const getTransactionInfo = useCallback(
    (offset: number, limit: number) => {
      getTransactions({ offset, limit });
    },
    [getTransactions],
  );

  useEffect(() => {
    getTransactionInfo(0, 10);
  }, [getTransactionInfo]);

  const renderDetailCaption = (poolStats: PoolData, viewMode: string) => {
    const swapUrl = `/swap/${RUNE_SYMBOL}:${poolStats.values.symbol}`;
    const stakeUrl = `/stake/${poolStats.values.symbol.toUpperCase()}`;

    const targetName = `${poolStats.target} (${poolStats.values.symbol.toUpperCase()})`;
    const poolPrice = `$${poolStats.values.poolPrice}`;

    return (
      <Col className={`pool-caption-container ${viewMode}`}>
        <PoolCaptionWrapper>
          <PoolCaptionTitle>
            {targetName}
          </PoolCaptionTitle>
          <PoolCaptionPrice>{poolPrice}</PoolCaptionPrice>
        </PoolCaptionWrapper>
        <PoolCaptionButtonsWrapper>
          <Link to={stakeUrl}>
            <Button
              round="true"
              typevalue="outline"
            >
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

  const poolInfo = poolData[tokenSymbol] || {};
  const poolStats = getPoolData(tokenSymbol, poolInfo, priceIndex);

  return (
    <ContentWrapper className="pool-detail-wrapper" transparent>
      <Row className="detail-info-header">
        {renderDetailCaption(poolStats, 'desktop-view')}
        {renderDetailCaption(poolStats, 'mobile-view')}
      </Row>
      <Row className="detail-info-view desktop-view">
        <Col span={8}>
          <PoolStatBar stats={poolStats} poolInfo={poolInfo} basePrice={busdPrice} />
        </Col>
        <Col span={16}>
          <PoolChart
            chartData={chartData}
            textColor={theme.palette.text[0]}
            lineColor={isLight ? '#436eb9' : '#1dd3e6'}
            gradientStart={isLight ? '#c5d3f0' : '#365979'}
            gradientStop={isLight ? '#ffffff' : '#0f1922'}
            viewMode="desktop-view"
          />
        </Col>
      </Row>
      <Row className="detail-info-view mobile-view">
        <Col span={24}>
          <PoolStatBar stats={poolStats} poolInfo={poolInfo} basePrice={busdPrice} />
        </Col>
        <Col span={24}>
          <PoolChart
            chartData={chartData}
            textColor={theme.palette.text[0]}
            lineColor={isLight ? '#436eb9' : '#1dd3e6'}
            gradientStart={isLight ? '#c5d3f0' : '#365979'}
            gradientStop={isLight ? '#ffffff' : '#0f1922'}
            viewMode="mobile-view"
          />
        </Col>
      </Row>
      <Row className="detail-transaction-view">
        <TransactionWrapper>
          <Label size="big" color="primary">
            Transactions
          </Label>
          <TxTable txData={txData} />
          <StyledPagination
            defaultCurrent={0}
            // eslint-disable-next-line no-underscore-dangle
            total={txData._tag === 'RemoteSuccess' ? txData.value.count : 0}
            showSizeChanger={false}
            onChange={page => {
              getTransactionInfo((page - 1) * 10, 10);
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
      poolData: state.Midgard.poolData,
      assets: state.Midgard.assets,
      priceIndex: state.Midgard.priceIndex,
      txData: state.Midgard.txData,
    }),
    {
      getTransactions: midgardActions.getTransaction,
    },
  ),
  withRouter,
)(PoolDetail);
