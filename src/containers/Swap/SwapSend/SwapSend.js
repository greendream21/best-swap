import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Form, notification } from 'antd';
import { crypto } from '@binance-chain/javascript-sdk';

import Binance from '../../../clients/binance';

import Button from '../../../components/uielements/button';
import Drag from '../../../components/uielements/drag';
import TokenCard from '../../../components/uielements/tokens/tokenCard';
import Label from '../../../components/uielements/label';
import Input from '../../../components/uielements/input';
import CoinData from '../../../components/uielements/coins/coinData';
import Status from '../../../components/uielements/status';
import TxTimer from '../../../components/uielements/txTimer';
import Modal from '../../../components/uielements/modal';

import {
  ContentWrapper,
  SwapModalContent,
  SwapModal,
  SwapAssetCard,
  PrivateModal,
  CardForm,
  CardFormHolder,
  CardFormItem,
  CardFormItemError,
  SwapStatusPanel,
} from './SwapSend.style';
import {
  getTickerFormat,
  getPair,
  getFixedNumber,
} from '../../../helpers/stringHelper';
import { TESTNET_TX_BASE_URL } from '../../../helpers/apiHelper';
import { getCalcResult, confirmSwap, getTxResult } from '../utils';
import { withBinanceTransferWS } from '../../../HOC/websocket/WSBinance';

import appActions from '../../../redux/app/actions';
import chainActions from '../../../redux/chainservice/actions';
import statechainActions from '../../../redux/statechain/actions';
import walletactions from '../../../redux/wallet/actions';
import AddressInput from '../../../components/uielements/addressInput';
import ContentTitle from '../../../components/uielements/contentTitle';
import Slider from '../../../components/uielements/slider';
import StepBar from '../../../components/uielements/stepBar';
import Trend from '../../../components/uielements/trend';

const {
  setTxTimerType,
  setTxTimerModal,
  setTxTimerStatus,
  setTxTimerValue,
  resetTxStatus,
} = appActions;

const { getTokens } = chainActions;
const { getPools } = statechainActions;
const { getRunePrice, refreshBalance } = walletactions;

class SwapSend extends Component {
  static propTypes = {
    info: PropTypes.string,
    view: PropTypes.string.isRequired,
    history: PropTypes.object,
    txStatus: PropTypes.object.isRequired,
    chainData: PropTypes.object.isRequired,
    assetData: PropTypes.array.isRequired,
    pools: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    runePrice: PropTypes.number.isRequired,
    wsTransfers: PropTypes.object.isRequired,
    setTxTimerType: PropTypes.func.isRequired,
    setTxTimerModal: PropTypes.func.isRequired,
    setTxTimerStatus: PropTypes.func.isRequired,
    setTxTimerValue: PropTypes.func.isRequired,
    resetTxStatus: PropTypes.func.isRequired,
    getTokens: PropTypes.func.isRequired,
    getPools: PropTypes.func.isRequired,
    getRunePrice: PropTypes.func.isRequired,
    refreshBalance: PropTypes.func.isRequired,
  };

  static defaultProps = {
    info: '',
  };

  state = {
    address: '',
    invalidAddress: false,
    dragReset: true,
    xValue: 0,
    percent: 0,
    openPrivateModal: false,
    password: '',
    invalidPassword: false,
    openWalletAlert: false,
    slipProtection: true,
    maxSlip: 30,
    txResult: null,
    timerStatus: true,
  };

  addressRef = React.createRef();

  delta = 1000;

  componentDidMount() {
    const { getTokens, getPools, getRunePrice } = this.props;

    getTokens();
    getPools();
    getRunePrice();
  }

  componentDidUpdate(prevProps) {
    const {
      wsTransfers,
      refreshBalance,
      user: { wallet },
    } = this.props;
    const length = wsTransfers.length;
    console.log(prevProps.wsTransfers.length);
    console.log(length);
    if (length !== prevProps.wsTransfers.length && length > 1) {
      const lastTx = wsTransfers[length - 1];
      const { fromAddr, toAddr, fromToken, toToken } = this.txData;
      console.log('txData ', this.txData);
      console.log('lastTx ', lastTx);
      const txResult = getTxResult(
        lastTx,
        fromAddr,
        toAddr,
        fromToken,
        toToken,
      );
      console.log('txResult ', txResult);

      if (txResult) {
        const curTime = new Date();
        this.delta = curTime - this.txStarted;
        console.log(this.delta);
        this.setState({
          txResult,
          timerStatus: true,
        });
        // refresh balances with update
        refreshBalance(wallet);
      }
    }
  }

  isValidRecipient = () => {
    const { address } = this.state;

    return Binance.isValidAddress(address);
  };

  // TODO: Using curried functions for handlers in React
  //       will lead to performance problems down the track
  handleChange = key => e => {
    this.setState({
      [key]: e.target.value,
      invalidAddress: false,
      invalidPassword: false,
    });
  };

  handleChangePercent = percent => {
    const { info } = this.props;

    const { assetData } = this.props;
    const { source } = getPair(info);

    const sourceAsset = assetData.find(data => {
      const { asset } = data;
      const tokenName = getTickerFormat(asset);
      if (tokenName === source) {
        return true;
      }
      return false;
    });

    const totalAmount = !sourceAsset ? 0 : sourceAsset.assetValue || 0;
    const newValue = (totalAmount * percent) / 100;

    if (totalAmount < newValue) {
      this.setState({
        xValue: totalAmount,
      });
    } else {
      this.setState({
        xValue: newValue,
      });
    }

    this.setState({
      percent,
    });
  };

  handleChangeValue = value => {
    const { info } = this.props;
    const newValue = value;

    const { assetData } = this.props;
    const { source } = getPair(info);

    const sourceAsset = assetData.find(data => {
      const { asset } = data;
      const tokenName = getTickerFormat(asset);
      if (tokenName === source) {
        return true;
      }
      return false;
    });

    const totalAmount = !sourceAsset ? 0 : sourceAsset.assetValue || 0;

    if (totalAmount < newValue) {
      this.setState({
        xValue: totalAmount,
      });
    } else {
      this.setState({
        xValue: newValue,
      });
    }
  };

  handleChangeSource = asset => {
    const { view, info } = this.props;
    const { target } = getPair(info);
    const source = getTickerFormat(asset);

    if (source === target) {
      return;
    }

    const URL = `/swap/${view}/${source}-${target}`;

    this.props.history.push(URL);
  };

  handleConfirmPassword = async e => {
    e.preventDefault();

    const {
      user: { keystore, wallet },
    } = this.props;
    const { password } = this.state;

    try {
      const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
      Binance.setPrivateKey(privateKey);
      const address = crypto.getAddressFromPrivateKey(
        privateKey,
        Binance.getPrefix(),
      );
      if (wallet === address) {
        this.handleConfirmSwap();
      }

      this.setState({
        openPrivateModal: false,
      });
    } catch (error) {
      this.setState({
        password: '',
        invalidPassword: true,
      });
      console.log(error); // eslint-disable-line no-console
    }
  };

  handleOpenPrivateModal = () => {
    this.setState({
      openPrivateModal: true,
    });
  };

  handleClosePrivateModal = () => {
    this.setState({
      openPrivateModal: false,
      dragReset: true,
    });
  };

  handleDrag = () => {
    this.setState({
      dragReset: false,
    });
  };

  handleConnectWallet = () => {
    this.setState({
      openWalletAlert: false,
    });

    this.props.history.push('/connect');
  };

  hideWalletAlert = () => {
    this.setState({
      openWalletAlert: false,
      dragReset: true,
    });
  };

  handleEndDrag = () => {
    const {
      view,
      user: { keystore, wallet },
    } = this.props;
    const { xValue } = this.state;

    // validation

    if (!wallet) {
      this.setState({
        openWalletAlert: true,
      });
      return;
    }

    if (Number(xValue) <= 0) {
      /* eslint-disable dot-notation */
      notification['error']({
        message: 'Swap Invalid',
        description: 'You need to enter an amount to swap.',
      });
      this.setState({
        dragReset: true,
      });
      return;
    }

    if (view === 'send' && !this.isValidRecipient()) {
      this.setState({
        invalidAddress: true,
        dragReset: true,
      });
      return;
    }

    if (!this.validateSlip(this.data.slip)) {
      return;
    }

    if (keystore) {
      this.handleOpenPrivateModal();
    } else if (wallet) {
      this.handleConfirmSwap();
    } else {
      this.setState({
        invalidAddress: true,
        dragReset: true,
      });
    }
  };

  handleStartTimer = () => {
    const { setTxTimerModal, setTxTimerType, setTxTimerStatus } = this.props;

    setTxTimerType('swap');
    setTxTimerModal(true);
    setTxTimerStatus(true);
  };

  handleCloseModal = () => {
    const {
      txStatus: { status }, // eslint-disable-line no-unused-vars
      setTxTimerModal,
      resetTxStatus, // eslint-disable-line no-unused-vars
    } = this.props;

    // if (!status) resetTxStatus();
    // else setTxTimerModal(false);
    setTxTimerModal(false);
  };

  handleChangeSwapType = state => {
    if (state) {
      this.handleGotoSend();
    } else {
      this.handleGotoDetail();
    }
  };

  handleGotoDetail = () => {
    const { info } = this.props;
    const URL = `/swap/detail/${info}`;

    this.props.history.push(URL);
  };

  handleGotoSend = () => {
    const { info } = this.props;
    const URL = `/swap/send/${info}`;

    this.props.history.push(URL);
  };

  handleSwitchSlipProtection = () => {
    this.setState(prevState => ({
      slipProtection: !prevState.slipProtection,
    }));
  };

  handleChangeSource = asset => {
    const { view, info } = this.props;
    const { source, target } = getPair(info);
    const selectedToken = getTickerFormat(asset);

    let URL;
    if (selectedToken === target) {
      URL = `/swap/${view}/${selectedToken}-${source}`;
    } else {
      URL = `/swap/${view}/${selectedToken}-${target}`;
    }
    this.props.history.push(URL);
  };

  handleSelectTraget = asset => {
    const { view, info } = this.props;
    const { source, target } = getPair(info);
    const selectedToken = getTickerFormat(asset);

    let URL;
    if (source === selectedToken) {
      URL = `/swap/${view}/${target}-${selectedToken}`;
    } else {
      URL = `/swap/${view}/${source}-${selectedToken}`;
    }
    this.props.history.push(URL);
  };

  handleReversePair = () => {
    const { view, info, assetData } = this.props;
    const { source, target } = getPair(info);

    if (!assetData.find(data => getTickerFormat(data.asset) === target)) {
      notification.warning({
        message: 'Cannot Reverse Swap Direction',
        description: 'Token does not exist in your wallet.',
      });
      return;
    }

    const URL = `/swap/${view}/${target}-${source}`;

    this.props.history.push(URL);
  };

  validatePair = (sourceInfo, targetInfo) => {
    if (!targetInfo.length) {
      this.props.history.push('/swap');
    }

    const { info } = this.props;

    const { source, target } = getPair(info);

    const targetData = targetInfo.filter(data => {
      const compare = getTickerFormat(data.asset) !== target;
      return compare;
    });

    const sourceData = sourceInfo.filter(data => {
      const compare = getTickerFormat(data.asset) !== source;
      return compare;
    });

    return {
      sourceData,
      targetData,
    };
  };

  handleChangeTxValue = value => {
    const { setTxTimerValue } = this.props;

    if (value === 3) {
      this.setState({
        timerStatus: false,
      });
      this.txStarted = new Date();
    }
    setTxTimerValue(value);
  };

  handleEndTxTimer = () => {
    const { setTxTimerStatus } = this.props;

    setTxTimerStatus(false);
    this.setState({
      dragReset: true,
    });
  };

  handleConfirmSwap = async () => {
    const {
      user: { wallet },
      info,
    } = this.props;
    const { xValue, address, slipProtection } = this.state;
    const { source, target } = getPair(info);

    try {
      const { result } = await confirmSwap(
        Binance,
        wallet,
        source,
        target,
        this.data,
        xValue,
        slipProtection,
        address,
      );
      this.hash = result[0].hash;
      this.txData = {
        fromAddr: wallet,
        toAddr: this.data.poolAddressTo,
        fromToken: this.data.symbolFrom,
        toToken: this.data.symbolTo,
      };

      this.setState({
        txResult: null,
      });
      this.handleStartTimer();
    } catch (error) {
      notification['error']({
        message: 'Swap Invalid',
        description: 'Swap information is not valid.',
      });
      this.setState({
        dragReset: true,
      });
      console.log(error); // eslint-disable-line no-console
    }
  };

  handleSelectAmount = source => amount => {
    const { assetData } = this.props;

    const sourceAsset = assetData.find(data => {
      const { asset } = data;
      const tokenName = getTickerFormat(asset);
      if (tokenName === source) {
        return true;
      }
      return false;
    });

    if (!sourceAsset) {
      return;
    }

    const totalAmount = sourceAsset.assetValue || 0;
    const xValue = (totalAmount * amount) / 100;
    this.setState({
      xValue,
    });
  };

  renderSwapModalContent = (swapData, info) => {
    const {
      txStatus: { status, value },
    } = this.props;
    const { xValue, txResult, timerStatus } = this.state;
    const { source, target } = swapData;
    const { Px, slip, outputAmount, outputPrice } = info;
    const priceFrom = Number(Px * xValue);
    const priceTo = Number(outputAmount * outputPrice);
    const slipAmount = slip.toFixed(2);

    // const transactionLabels = [
    //   'sending transaction',
    //   'processing transaction',
    //   'signing transaction',
    //   'finishing transaction',
    //   'complete',
    // ];

    const completed = value !== null && !status && txResult !== null;

    const targetToken = !completed ? target : getTickerFormat(txResult.token);
    const tokenAmount = !completed
      ? Number(outputAmount)
      : Number(txResult.amount);
    const priceValue = !completed
      ? priceTo
      : Number(Number(txResult.amount) * outputPrice);

    const txURL = TESTNET_TX_BASE_URL + this.hash;

    return (
      <SwapModalContent>
        <Row className="swapmodal-content">
          <div className="timer-container">
            <TxTimer
              reset={status}
              status={timerStatus}
              value={value}
              txDuration={this.delta}
              onChange={this.handleChangeTxValue}
              onEnd={this.handleEndTxTimer}
            />
          </div>
          <div className="coin-data-wrapper">
            <StepBar size={50} />
            <div className="coin-data-container">
              <CoinData
                data-test="swapmodal-coin-data-receive"
                asset={targetToken}
                assetValue={tokenAmount}
                price={priceValue}
              />
              <CoinData
                data-test="swapmodal-coin-data-send"
                asset={source}
                assetValue={xValue}
                price={priceFrom}
              />
            </div>
          </div>
        </Row>
        <Row className="swap-info-wrapper">
          <Trend value={slipAmount} />
          {this.hash && (
            <div className="hash-address">
              <div className="copy-btn-wrapper">
                <a href={txURL} target="_blank" rel="noopener noreferrer">
                  <Button className="view-btn" color="success">
                    VIEW ON BINANCE CHAIN
                  </Button>
                </a>
              </div>
            </div>
          )}
        </Row>
      </SwapModalContent>
    );
  };

  validateSlip = slip => {
    const { maxSlip } = this.state;

    if (slip >= maxSlip) {
      notification.error({
        message: 'Swap Invalid',
        description: `Slip ${slip}% is too high, try less.`,
      });
      this.setState({
        dragReset: true,
      });
      return false;
    }
    return true;
  };

  render() {
    const {
      view,
      info,
      txStatus,
      chainData: { tokenInfo },
      pools,
      assetData,
      runePrice,
      wsTransfers,
    } = this.props;
    const {
      dragReset,
      address,
      invalidAddress,
      invalidPassword,
      xValue,
      percent,
      openPrivateModal,
      openWalletAlert,
      password,
      slipProtection,
      txResult,
    } = this.state;

    console.log('binance websocket transfer data: ', wsTransfers);
    const swapData = getPair(info);

    if (!swapData || !Object.keys(tokenInfo).length) {
      return '';
    }

    const { source, target } = swapData;

    const tokensData = Object.keys(tokenInfo).map(tokenName => {
      const { symbol, price } = tokenInfo[tokenName];

      return {
        asset: symbol,
        price,
      };
    });

    // add rune data in the target token list
    tokensData.push({
      asset: 'RUNE-A1F',
      price: runePrice,
    });

    const { sourceData, targetData } = this.validatePair(assetData, tokensData);

    const dragTitle = 'Drag to swap';

    const openSwapModal = txStatus.type === 'swap' ? txStatus.modal : false;
    const coinCloseIconType = txStatus.status ? 'fullscreen-exit' : 'close';

    // calculation
    this.data = getCalcResult(source, target, pools, xValue, runePrice);
    const { Px, slip, outputAmount, outputPrice, ratio } = this.data;
    console.log(this.data); // eslint-disable-line no-console

    const ratioLabel = `1 ${source.toUpperCase()} = ${getFixedNumber(
      ratio,
    )} ${target.toUpperCase()}`;

    // swap modal

    const completed =
      txStatus.value !== null && !txStatus.status && txResult !== null;
    const swapTitle = !completed ? 'YOU ARE SWAPPING' : 'YOU SWAPPED';

    return (
      <ContentWrapper className="swap-detail-wrapper">
        <Row>
          <Col
            className="swap-status-panel"
            xs={{ span: 24, offset: 0 }}
            xl={{ span: 6 }}
          >
            <SwapStatusPanel>
              <Status title="exchange rate" value={ratioLabel} />
              <Icon type="swap" onClick={this.handleReversePair} />
              <StepBar />
            </SwapStatusPanel>
          </Col>
          <Col
            className="swap-detail-panel"
            xs={{ span: 24, offset: 0 }}
            xl={{ span: 10 }}
          >
            <SwapAssetCard>
              <ContentTitle>you are swapping</ContentTitle>
              <TokenCard
                title="You are swapping"
                inputTitle="swap amount"
                asset={source}
                assetData={sourceData}
                amount={xValue}
                price={Px}
                onChange={this.handleChangeValue}
                onChangeAsset={this.handleChangeSource}
                onSelect={this.handleSelectAmount(source)}
                withSelection
                withSearch
              />
              <Slider
                value={percent}
                onChange={this.handleChangePercent}
                withLabel
              />
              <TokenCard
                title="You will receive"
                inputTitle="swap amount"
                inputProps={{
                  disabled: true,
                }}
                asset={target}
                assetData={targetData}
                amount={outputAmount}
                price={outputPrice}
                slip={slip}
                onChangeAsset={this.handleSelectTraget}
                withSearch
              />
              <CardFormHolder>
                <CardForm>
                  <CardFormItem className={invalidAddress ? 'has-error' : ''}>
                    <AddressInput
                      value={address}
                      onChange={this.handleChange('address')}
                      status={view === 'send'}
                      onStatusChange={this.handleChangeSwapType}
                    />
                  </CardFormItem>
                </CardForm>
                {invalidAddress && (
                  <CardFormItemError>
                    Recipient address is invalid!
                  </CardFormItemError>
                )}
              </CardFormHolder>
              <CardFormHolder className="slip-protection">
                <CardForm>
                  <Button
                    onClick={this.handleSwitchSlipProtection}
                    sizevalue="small"
                    typevalue="outline"
                    focused={slipProtection}
                    style={{ borderColor: '#33CCFF' }}
                  >
                    <Icon type={slipProtection ? 'lock' : 'unlock'} />
                  </Button>
                  <Label>Protect my price (within 30%)</Label>
                </CardForm>
              </CardFormHolder>
            </SwapAssetCard>
            <div className="drag-confirm-wrapper">
              <Drag
                title={dragTitle}
                source={source}
                target={target}
                reset={dragReset}
                onConfirm={this.handleEndDrag}
                onDrag={this.handleDrag}
              />
            </div>
          </Col>
        </Row>
        <SwapModal
          title={swapTitle}
          closeIcon={
            <Icon type={coinCloseIconType} style={{ color: '#33CCFF' }} />
          }
          visible={openSwapModal}
          footer={null}
          onCancel={this.handleCloseModal}
        >
          {this.renderSwapModalContent(swapData, this.data)}
        </SwapModal>
        <PrivateModal
          title="PASSWORD CONFIRMATION"
          visible={openPrivateModal}
          onOk={this.handleConfirmPassword}
          onCancel={this.handleClosePrivateModal}
          okText="CONFIRM"
          cancelText="CANCEL"
        >
          <Form onSubmit={this.handleConfirmPassword}>
            <Form.Item className={invalidPassword ? 'has-error' : ''}>
              <Input
                data-test="password-confirmation-input"
                type="password"
                typevalue="ghost"
                sizevalue="big"
                value={password}
                onChange={this.handleChange('password')}
                prefix={<Icon type="lock" />}
              />
              {invalidPassword && (
                <div className="ant-form-explain">Password is wrong!</div>
              )}
            </Form.Item>
          </Form>
        </PrivateModal>
        <Modal
          title="PLEASE ADD WALLET"
          visible={openWalletAlert}
          onOk={this.handleConnectWallet}
          onCancel={this.hideWalletAlert}
          okText="ADD WALLET"
        >
          Please add a wallet to swap tokens.
        </Modal>
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      user: state.Wallet.user,
      runePrice: state.Wallet.runePrice,
      txStatus: state.App.txStatus,
      chainData: state.ChainService,
      pools: state.Statechain.pools,
      assetData: state.Wallet.assetData,
    }),
    {
      getTokens,
      getPools,
      setTxTimerType,
      setTxTimerModal,
      setTxTimerStatus,
      setTxTimerValue,
      resetTxStatus,
      getRunePrice,
      refreshBalance,
    },
  ),
  withRouter,
  withBinanceTransferWS,
)(SwapSend);
