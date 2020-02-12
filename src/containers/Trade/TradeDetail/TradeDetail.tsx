import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, Icon } from 'antd';

import CoinCard from '../../../components/uielements/coins/coinCard';
import Status from '../../../components/uielements/status';
import Slider from '../../../components/uielements/slider';
import TxTimer from '../../../components/uielements/txTimer';
import CoinData from '../../../components/uielements/coins/coinData';
import Label from '../../../components/uielements/label';
import Button from '../../../components/uielements/button';
import Logo from '../../../components/uielements/logo';

import {
  ContentWrapper,
  TradeModalContent,
  TradeModal,
} from './TradeDetail.style';

import * as appActions from '../../../redux/app/actions';
import * as midgardActions from '../../../redux/midgard/actions';
import * as binanceActions from '../../../redux/binance/actions';
import { getBepswapValues, getBnbPrice, getPriceDiff } from '../utils';
import { getTickerFormat, getFixedNumber } from '../../../helpers/stringHelper';
import { MAX_VALUE } from '../../../redux/app/const';
import { RootState } from '../../../redux/store';
import { AssetData } from '../../../redux/wallet/types';
import { FixmeType, Maybe } from '../../../types/bepswap';
import { Asset } from '../../../types/generated/midgard';
import { PoolDataMap, PriceDataIndex } from '../../../redux/midgard/types';
import { TickerStatistics } from '../../../types/binance';
import { TxStatus, TxTypes } from '../../../redux/app/types';

type BEPSwapValues = {
  poolPriceBNB: number;
  poolBuyDepth: number;
  poolSellDepth: number;
  X: number;
  Y: number;
  R: number;
  Z: number;
};

type ComponentProps = {
  symbol: string;
  chainData: FixmeType; // PropTypes.object.isRequired,
  swapData: FixmeType; // PropTypes.object.isRequired,
};

type ConnectedProps = {
  assetData: AssetData[];
  pools: Asset[];
  poolData: PoolDataMap;
  priceIndex: PriceDataIndex;
  tickerData: Maybe<TickerStatistics>;
  txStatus: TxStatus;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxTimerStatus: typeof appActions.setTxTimerStatus;
  countTxTimerValue: typeof appActions.countTxTimerValue;
  resetTxStatus: typeof appActions.resetTxStatus;
  getPools: typeof midgardActions.getPools;
  getRunePrice: typeof midgardActions.getRunePrice;
  getBinanceTicker: typeof binanceActions.getBinanceTicker;
};

type Props = ConnectedProps & ComponentProps;

type State = {};

class TradeDetail extends React.Component<Props, State> {
  componentDidMount() {
    const { symbol, getPools, getRunePrice, getBinanceTicker } = this.props;

    getPools();
    getRunePrice();
    getBinanceTicker(symbol);
  }

  componentWillUnmount() {
    const { resetTxStatus } = this.props;
    resetTxStatus();
  }

  handleStartTimer = () => {
    const { resetTxStatus } = this.props;
    resetTxStatus({
      type: TxTypes.TRADE,
      modal: true,
      status: true,
      startTime: Date.now(),
    } as TxStatus);
  };

  handleConfirm = () => {
    this.handleCloseModal();
  };

  handleCloseModal = () => {
    const {
      txStatus: { status },
      setTxTimerModal,
      resetTxStatus,
    } = this.props;

    if (!status) resetTxStatus();
    else setTxTimerModal(false);
  };

  handleChangeTxValue = () => {
    const { countTxTimerValue } = this.props;
    // ATM we just count a `quarter` w/o any other checks
    countTxTimerValue(25);
  };

  handleEndTxTimer = () => {
    const { setTxTimerStatus } = this.props;
    setTxTimerStatus(false);
  };

  renderTradeModalContent = () => {
    const {
      symbol,
      txStatus: { status, value, startTime },
    } = this.props;

    const transactionLabels = [
      'sending transaction',
      'processing transaction',
      'signing transaction',
      'finishing transaction',
      'complete',
    ];

    const completed = value !== null && !status;
    const tradeText = !completed ? 'YOU ARE TRADING' : 'YOU TRADED';
    const receiveText = !completed ? 'YOU SHOULD RECEIVE' : 'YOU RECEIVED';
    const expectation = !completed
      ? 'EXPECTED FEES & SLIP'
      : 'FINAL FEES & SLIP';

    return (
      <TradeModalContent>
        <div className="left-container">
          <Label weight="bold">{tradeText}</Label>
          <CoinData asset="bnb" assetValue={2.49274} price={217.92} />
        </div>
        <div className="center-container">
          <TxTimer
            status={status}
            value={value}
            maxValue={MAX_VALUE}
            startTime={startTime}
            onChange={this.handleChangeTxValue}
            onEnd={this.handleEndTxTimer}
          />
          {value !== 0 && (
            <Label weight="bold">{transactionLabels[value - 1]}</Label>
          )}
          {completed && <Label weight="bold">complete</Label>}
        </div>
        <div className="right-container">
          <Label weight="bold">{receiveText}</Label>
          <CoinData asset={symbol} assetValue={2.49274} price={217.92} />
          <Label weight="bold">{expectation}</Label>
          <div className="expected-status">
            <div className="status-item">
              <Status title="FEES" value="1.234 RUNE" />
              <Label className="price-label" size="normal" color="gray">
                $USD 110
              </Label>
            </div>
            <div className="status-item">
              <Status title="SLIP" value="0.3%" />
            </div>
          </div>
        </div>
      </TradeModalContent>
    );
  };

  renderBepswapPrice = (bepswapPrices: BEPSwapValues) => {
    const { symbol } = this.props;
    const { poolPriceBNB, poolBuyDepth, poolSellDepth } = bepswapPrices;

    const ticker = getTickerFormat(symbol);
    const poolPrice = `${getFixedNumber(poolPriceBNB, 4)} BNB`;

    return (
      <div className="bepswap-price-status">
        <Row>
          <Col lg={24}>
            <Status title="Pool Price" value={poolPrice} />
          </Col>
        </Row>
        <Row>
          <Col lg={12} xs={12}>
            <Status
              title="Pool Buy Depth"
              value={`${getFixedNumber(poolBuyDepth, 0)} BNB`}
            />
          </Col>
          <Col lg={12} xs={12}>
            <Status
              title="Pool Sell Depth"
              value={`${getFixedNumber(poolSellDepth, 0)} ${ticker}`}
            />
          </Col>
        </Row>
      </div>
    );
  };

  renderBinancePrice = () => {
    return (
      <div className="binance-price-status">
        <Row>
          <Col lg={24}>
            <Status title="Market Price" value="0.1000 BNB" />
          </Col>
        </Row>
        <Row>
          <Col lg={12} xs={12}>
            <Status title="Buy Depth" value="123 BNB" />
          </Col>
          <Col lg={12} xs={12}>
            <Status title="Sell Depth" value="123,000 TOMO" />
          </Col>
        </Row>
      </div>
    );
  };

  renderPriceAnalysis = (priceDiff: number, reward?: number) => {
    const prefix = priceDiff > 0 ? '+' : '';
    const differential = `${prefix}${Math.round(priceDiff * 100)}%`;
    const bepswapDirection = priceDiff > 0 ? 'Buy' : 'Sell';
    const binanceDirection = priceDiff > 0 ? 'Sell' : 'Buy';

    return (
      <div className="trade-price-analysis">
        <Row>
          <Col lg={12} xs={12}>
            <Status title="Pool Differential" value={differential} />
          </Col>
          {reward && (
            <Col lg={12} xs={12}>
              <Status
                title="Potential Reward"
                value={`${getFixedNumber(reward)} BNB`}
              />
            </Col>
          )}
        </Row>
        <Row>
          <Col lg={24}>
            <Label size="tiny" weight="bold">
              Recommended Trade Move
            </Label>
            <Label className="trade-move-value" size="big" weight="normal">
              BEPSwap Pool: <strong>{bepswapDirection}</strong>
            </Label>
            <Label className="trade-move-value" size="big" weight="normal">
              BinanceDex: <strong>{binanceDirection}</strong>
            </Label>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const {
      symbol,
      txStatus,
      chainData: { tokenInfo },
      pools,
      tickerData,
    } = this.props;

    const ticker = getTickerFormat(symbol);
    const openTradeModal = txStatus.type === 'trade' ? txStatus.modal : false;
    const coinCloseIconType = txStatus.status ? 'fullscreen-exit' : 'close';

    const tokensData = Object.keys(tokenInfo).map(tokenName => {
      const { symbol, price } = tokenInfo[tokenName];

      return {
        asset: symbol,
        price,
      };
    });

    const bnbPrice = getBnbPrice(pools);
    const bepswapValues = getBepswapValues(
      symbol,
      pools,
      bnbPrice,
    ) as BEPSwapValues;

    const lastPrice = tickerData ? Number(tickerData.lastPrice) : 0;
    const marketPrice = !Number.isNaN(lastPrice) ? lastPrice : 0;
    const priceDiff = getPriceDiff(marketPrice, bepswapValues.poolPriceBNB);

    return (
      <ContentWrapper className="trade-detail-wrapper">
        <Row className="trade-logos">
          <Col lg={12} xs={12}>
            <Logo name="bepswap" />
          </Col>
          <Col lg={12} xs={12}>
            <Logo name="binanceDex" />
          </Col>
        </Row>
        <Row className="trade-values">
          <Col lg={8} xs={24}>
            {this.renderBepswapPrice(bepswapValues)}
          </Col>
          <Col lg={8} xs={24}>
            {this.renderPriceAnalysis(priceDiff)}
          </Col>
          <Col lg={8} xs={24}>
            {this.renderBinancePrice()}
          </Col>
        </Row>
        <Row className="trade-panel">
          <Col lg={12} xs={24}>
            <div className="trade-card">
              <CoinCard
                asset={ticker}
                assetData={tokensData}
                amount={13}
                price={0.4}
                unit="BNB"
              />
              <Slider defaultValue={50} min={1} max={100} />
            </div>
            <div className="trade-btn">
              <Button typevalue="outline" color="success">
                buy
              </Button>
            </div>
          </Col>
          <Col lg={12} xs={24}>
            <div className="trade-btn">
              <Button typevalue="outline" color="error">
                sell
              </Button>
            </div>
            <div className="trade-card">
              <CoinCard
                asset={ticker}
                assetData={tokensData}
                amount={13}
                price={0.4}
                unit="BNB"
              />
              <Slider defaultValue={50} min={1} max={100} />
            </div>
          </Col>
        </Row>
        <Row className="trade-expectations">
          <Col lg={8} xs={24}>
            <Status title="Pool Price After Trade:" value="0.1100 BNB" />
          </Col>
          <Col lg={8} xs={24}>
            <div className="trade-asset-container">
              <CoinData asset={ticker} assetValue={0.01} price={0.04} />
              <CoinData asset="bnb" assetValue={0.01} price={0.04} />
              <Label>BNB is the trading asset.</Label>
            </div>
          </Col>
          <Col lg={8} xs={24}>
            <Status title="Market Price After Trade:" value="0.1100 BNB" />
          </Col>
        </Row>
        <TradeModal
          title="TRADE CONFIRMATION"
          closeIcon={
            <Icon type={coinCloseIconType} style={{ color: '#33CCFF' }} />
          }
          visible={openTradeModal}
          footer={null}
          onCancel={this.handleCloseModal}
        >
          {this.renderTradeModalContent()}
        </TradeModal>
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    (state: RootState) => ({
      txStatus: state.App.txStatus,
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      priceIndex: state.Midgard.priceIndex,
      pools: state.Midgard.pools,
      poolData: state.Midgard.poolData,
      tickerData: state.Binance.ticker,
    }),
    {
      getPools: midgardActions.getPools,
      getRunePrice: midgardActions.getRunePrice,
      getBinanceTicker: binanceActions.getBinanceTicker,
      setTxTimerModal: appActions.setTxTimerModal,
      setTxTimerStatus: appActions.setTxTimerStatus,
      countTxTimerValue: appActions.countTxTimerValue,
      resetTxStatus: appActions.resetTxStatus,
    },
  ),
  withRouter,
)(TradeDetail) as React.ComponentClass<ComponentProps, State>;
