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
import CoinCard from '../../../components/uielements/coins/coinCard';

import Label from '../../../components/uielements/label';
import Input from '../../../components/uielements/input/input';
import CoinData from '../../../components/uielements/coins/coinData';
import Status from '../../../components/uielements/status';
import TxTimer from '../../../components/uielements/txTimer';
import Modal from '../../../components/uielements/modal';

import {
  ContentWrapper,
  SwapModalContent,
  SwapModal,
  SwapAssetCard,
  ArrowContainer,
  PrivateModal,
  CardForm,
  CardFormHolder,
  CardFormArrowIcon,
  CardFormItem,
  CardFormItemError,
  CardFormItemCloseButton,
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
    openPrivateModal: false,
    password: '',
    invalidPassword: false,
    openWalletAlert: false,
    slipProtection: true,
    maxSlip: 30,
    txResult: null,
  };

  addressRef = React.createRef();

  componentDidMount() {
    const { getTokens, getPools, getRunePrice } = this.props;

    getTokens();
    getPools();
    getRunePrice();
  }

  componentDidUpdate(prevProps) {
    const { wsTransfers, refreshBalance } = this.props;
    const length = wsTransfers.length;
    console.log(prevProps.wsTransfers.length);
    console.log(length);
    if (length !== prevProps.wsTransfers.length && length > 0) {
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
        this.setState({
          txResult,
        });

        // refresh balances with update
        refreshBalance();
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

  handleChangeValue = value => {
    const { info } = this.props;
    const newValue = value;

    const { assetData, getRunePrice } = this.props;
    const { source } = getPair(info);
    getRunePrice();

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
      runePrice,
    } = this.props;
    const { xValue, txResult } = this.state;
    const { source, target } = swapData;
    const { Px, slip, outputAmount, outputPrice } = info;
    const priceFrom = Number(Px * xValue);
    const priceTo = Number(outputAmount * outputPrice);
    const slipAmount = slip.toFixed(2);

    const transactionLabels = [
      'sending transaction',
      'processing transaction',
      'signing transaction',
      'finishing transaction',
      'complete',
    ];

    const completed = value !== null && !status && txResult !== null;
    const swapText = !completed ? 'YOU ARE SWAPPING' : 'YOU SWAPPED';

    // eslint-disable-next-line no-nested-ternary
    const receiveText = !completed
      ? 'YOU SHOULD RECEIVE'
      : txResult.type === 'success'
      ? 'YOU RECEIVED'
      : 'YOU REFUNDED';

    const targetToken = !completed ? target : getTickerFormat(txResult.token);
    const tokenAmount = !completed
      ? Number(outputAmount)
      : Number(txResult.amount);
    const priceValue = !completed
      ? priceTo
      : Number(Number(txResult.amount) * outputPrice);

    const expectation = !completed
      ? 'EXPECTED FEES & SLIP'
      : 'FINAL FEES & SLIP';

    const txURL = TESTNET_TX_BASE_URL + this.hash;
    const { fee } = this.data;
    const actualFee = fee < 1 ? 1 : fee;
    const feeValue = `${actualFee} RUNE`;
    const feePrice = getFixedNumber(actualFee * runePrice);

    return (
      <SwapModalContent>
        <Row className="swapmodal-content">
          <div className="left-container">
            <Label weight="bold">{swapText}</Label>
            <CoinData
              data-test="swapmodal-coin-data-send"
              asset={source}
              assetValue={xValue}
              price={priceFrom}
            />
          </div>
          <div className="center-container">
            <TxTimer
              reset={status}
              value={value}
              onChange={this.handleChangeTxValue}
              onEnd={this.handleEndTxTimer}
            />
          </div>
          <div className="right-container">
            <Label weight="bold">{receiveText}</Label>
            <CoinData
              data-test="swapmodal-coin-data-receive"
              asset={targetToken}
              assetValue={tokenAmount}
              price={priceValue}
            />
            <Label weight="bold">{expectation}</Label>
            <div className="expected-status">
              <div className="status-item">
                <Status
                  data-test="swapmodal-fees"
                  title="FEES"
                  value={feeValue}
                />
                <Label className="price-label" size="normal" color="gray">
                  $USD {getFixedNumber(feePrice)}
                </Label>
              </div>
              <div className="status-item">
                <Status
                  data-test="swapmodal-slip"
                  title="SLIP"
                  value={`${slipAmount}%`}
                />
              </div>
            </div>
          </div>
        </Row>
        <Row className="swap-info-wrapper">
          {this.hash && (
            <div className="hash-address">
              <div className="copy-btn-wrapper">
                <a href={txURL} target="_blank" rel="noopener noreferrer">
                  <Icon type="global" />
                </a>
              </div>
              <Label>VIEW ON BINANCE CHAIN</Label>
            </div>
          )}
          {value !== 0 && (
            <Label className="tx-label" weight="bold">
              {transactionLabels[value - 1]}
            </Label>
          )}
          {completed && (
            <Label className="tx-label" weight="bold">
              complete
            </Label>
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
      openPrivateModal,
      openWalletAlert,
      password,
      slipProtection,
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

    const dragTitle =
      view === 'detail' ? 'Drag to swap' : 'Drag to swap and send';

    const openSwapModal = txStatus.type === 'swap' ? txStatus.modal : false;
    const coinCloseIconType = txStatus.status ? 'fullscreen-exit' : 'close';

    // calculation
    this.data = getCalcResult(source, target, pools, xValue, runePrice);
    const { Px, slip, outputAmount, outputPrice } = this.data;
    console.log(this.data); // eslint-disable-line no-console

    return (
      <ContentWrapper className="swap-detail-wrapper">
        <Row>
          <Col
            className="swap-detail-panel"
            xs={{ span: 24, offset: 0 }}
            xl={{ span: 16, offset: 4 }}
          >
            <SwapAssetCard>
              <CoinCard
                data-test="coincard-source"
                inputProps={{ 'data-test': 'coincard-source-input' }}
                title="You are swapping"
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

              <ArrowContainer>
                <Button
                  className="swap-arrow-btn"
                  typevalue="outline"
                  onClick={this.handleReversePair}
                >
                  <Icon type="swap" />
                </Button>
              </ArrowContainer>

              <CoinCard
                title="You will receive"
                inputProps={{
                  'data-test': 'coincard-target-input',
                  disabled: true,
                }}
                data-test="coincard-target"
                asset={target}
                assetData={targetData}
                amount={outputAmount}
                price={outputPrice}
                slip={slip}
                onChangeAsset={this.handleSelectTraget}
                withSearch
              >
                <CardFormHolder>
                  <CardForm>
                    {view === 'detail' && (
                      <>
                        <CardFormArrowIcon />
                        <Button
                          data-test="forward-to-alternate-address-button"
                          onClick={this.handleGotoSend}
                          sizevalue="small"
                          typevalue="ghost"
                          focused={view === 'send'}
                          style={{ borderColor: '#33CCFF' }}
                        >
                          Forward to alternate address
                        </Button>
                      </>
                    )}
                    {view === 'send' && (
                      <>
                        <CardFormArrowIcon />
                        <CardFormItem
                          className={invalidAddress ? 'has-error' : ''}
                        >
                          <Input
                            data-test="recipient-address-field"
                            placeholder="Recipient Address: Eg. bnbeh456..."
                            sizevalue="normal"
                            value={address}
                            onChange={this.handleChange('address')}
                            ref={this.addressRef}
                          />
                        </CardFormItem>
                        <CardFormItemCloseButton
                          onClick={this.handleGotoDetail}
                        />
                      </>
                    )}
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
                    <Label>Protect my price (within 3%)</Label>
                  </CardForm>
                </CardFormHolder>
              </CoinCard>
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
          title="SWAP CONFIRMATION"
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
          okText="Confirm"
        >
          <Form onSubmit={this.handleConfirmPassword}>
            <Form.Item className={invalidPassword ? 'has-error' : ''}>
              <Input
                data-test="password-confirmation-input"
                type="password"
                value={password}
                onChange={this.handleChange('password')}
                placeholder="Input password"
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
          okText="Add Wallet"
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
