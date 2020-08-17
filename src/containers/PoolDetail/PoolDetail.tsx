import React, { useEffect, useCallback } from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { withRouter, useParams, Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import {
  SwapOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

import { get as _get, random } from 'lodash';

import themes, { ThemeType } from '@thorchain/asgardex-theme';
import moment from 'moment';

import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';

import * as appActions from '../../redux/app/actions';
import * as midgardActions from '../../redux/midgard/actions';
import * as walletActions from '../../redux/wallet/actions';

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
import { User, AssetData } from '../../redux/wallet/types';
import { Maybe } from '../../types/bepswap';
import { TxStatus, TxResult } from '../../redux/app/types';
import {
  AssetDetailMap,
  StakerPoolData,
  PoolDataMap,
  PriceDataIndex,
  ThorchainData,
  TxDetailData,
} from '../../redux/midgard/types';
import { TransferFeesRD } from '../../redux/binance/types';
import usePrevious from '../../hooks/usePrevious';
import { RUNE_SYMBOL } from '../../settings/assetData';
import StatBar from '../../components/statBar/poolStatBar';
import PoolChart from '../../components/poolChart';
import TxTable from '../../components/transaction/txTable';

type Props = {
  history: H.History;
  txStatus: TxStatus;
  txResult?: TxResult;
  txData: TxDetailData;
  user: Maybe<User>;
  assetData: AssetData[];
  poolAddress: Maybe<string>;
  poolData: PoolDataMap;
  assets: AssetDetailMap;
  stakerPoolData: Maybe<StakerPoolData>;
  stakerPoolDataLoading: boolean;
  stakerPoolDataError: Maybe<Error>;
  priceIndex: PriceDataIndex;
  basePriceAsset: string;
  poolLoading: boolean;
  thorchainData: ThorchainData;
  getStakerPoolData: typeof midgardActions.getStakerPoolData;
  getTransactions: typeof midgardActions.getTransaction;
  setTxResult: typeof appActions.setTxResult;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxHash: typeof appActions.setTxHash;
  resetTxStatus: typeof appActions.resetTxStatus;
  refreshBalance: typeof walletActions.refreshBalance;
  refreshStakes: typeof walletActions.refreshStakes;
  transferFees: TransferFeesRD;
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
    user,
    assets,
    poolData,
    txData,
    priceIndex,
    txStatus,
    refreshBalance,
    refreshStakes,
    getStakerPoolData,
    getTransactions,
  } = props;

  const { symbol = '' } = useParams();
  const tokenSymbol = symbol.toUpperCase();
  const busdPrice = assets?.['BUSD-BAF']?.priceRune ?? '1';

  const themeType = useSelector((state: RootState) => state.App.themeType);
  const isLight = themeType === ThemeType.LIGHT;
  const theme = isLight ? themes.light : themes.dark;


  const getStakerPoolDetail = useCallback(() => {
    if (user) {
      getStakerPoolData({ asset: symbol, address: user.wallet });
    }
  }, [getStakerPoolData, symbol, user]);

  const getTransactionInfo = useCallback(
    (offset: number, limit: number) => {
      getTransactions({ offset, limit });
    },
    [getTransactions],
  );

  useEffect(() => {
    getTransactionInfo(0, 10);
  }, [getTransactionInfo]);

  const refreshStakerData = useCallback(() => {
    // get staker info again after finished
    getStakerPoolDetail();

    if (user) {
      const wallet = user.wallet;
      refreshStakes(wallet);
      refreshBalance(wallet);
    }
  }, [getStakerPoolDetail, refreshBalance, refreshStakes, user]);

  useEffect(() => {
    // TODO: check if it needs to fetch staker detail on mount
    getStakerPoolDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // stakerPoolData needs to be updated whenever pool changed
  useEffect(() => {
    getStakerPoolDetail();
  }, [symbol, getStakerPoolDetail]);

  const prevTxStatus = usePrevious(txStatus);
  // if tx is completed, should refresh staker details
  useEffect(() => {
    if (prevTxStatus?.status === true && txStatus.status === false) {
      refreshStakerData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txStatus]);

  const renderDetailCaption = (poolStats: PoolData) => {
    const swapUrl = `/swap/${RUNE_SYMBOL}:${poolStats.values.symbol}`;
    const stakeUrl = `/stake/${poolStats.values.symbol.toUpperCase()}`;

    const targetName = `${poolStats.target} (${poolStats.values.symbol.toUpperCase()})`;
    const poolPrice = `$${poolStats.values.poolPrice}`;

    return (
      <Col className="pool-caption-container">
        <PoolCaptionWrapper>
          <PoolCaptionTitle>
            {targetName}
          </PoolCaptionTitle>
          <PoolCaptionPrice>{poolPrice}</PoolCaptionPrice>
        </PoolCaptionWrapper>
        <PoolCaptionButtonsWrapper>
          <Link to={stakeUrl}>
            <Button
              style={{ margin: 'auto' }}
              round="true"
              typevalue="outline"
            >
              <DatabaseOutlined />
              stake
            </Button>
          </Link>
          <Link to={swapUrl}>
            <Button style={{ margin: 'auto' }} round="true">
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
        {renderDetailCaption(poolStats)}
      </Row>
      <Row className="detail-info-view">
        <Col span={8}>
          <StatBar stats={poolStats} poolInfo={poolInfo} basePrice={busdPrice} />
        </Col>
        <Col span={16}>
          <PoolChart
            chartData={chartData}
            textColor={theme.palette.text[0]}
            lineColor={isLight ? '#436eb9' : '#1dd3e6'}
            gradientStart={isLight ? '#c5d3f0' : '#365979'}
            gradientStop={isLight ? '#ffffff' : '#0f1922'}
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
      txResult: state.App.txResult,
      txStatus: state.App.txStatus,
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      poolAddress: state.Midgard.poolAddress,
      poolData: state.Midgard.poolData,
      assets: state.Midgard.assets,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      poolLoading: state.Midgard.poolLoading,
      stakerPoolData: state.Midgard.stakerPoolData,
      stakerPoolDataLoading: state.Midgard.stakerPoolDataLoading,
      stakerPoolDataError: state.Midgard.stakerPoolDataError,
      txData: state.Midgard.txData,
      transferFees: state.Binance.transferFees,
      thorchainData: state.Midgard.thorchain,
    }),
    {
      getStakerPoolData: midgardActions.getStakerPoolData,
      setTxResult: appActions.setTxResult,
      setTxTimerModal: appActions.setTxTimerModal,
      setTxHash: appActions.setTxHash,
      resetTxStatus: appActions.resetTxStatus,
      refreshBalance: walletActions.refreshBalance,
      refreshStakes: walletActions.refreshStakes,
      getTransactions: midgardActions.getTransaction,
    },
  ),
  withRouter,
)(PoolDetail);
