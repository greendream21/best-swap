import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Form, notification, Popover } from 'antd';
import { crypto } from '@binance-chain/javascript-sdk';
import { get as _get } from 'lodash';

import Binance from '../../../clients/binance';

import Button from '../../../components/uielements/button';
import Drag from '../../../components/uielements/drag';
import TokenCard from '../../../components/uielements/tokens/tokenCard';
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
  emptyString,
} from '../../../helpers/stringHelper';
import { TESTNET_TX_BASE_URL } from '../../../helpers/apiHelper';
import { getCalcResult, confirmSwap, getTxResult } from '../utils';
import { withBinanceTransferWS } from '../../../HOC/websocket/WSBinance';

import {
  setTxTimerModal,
  setTxTimerStatus,
  countTxTimerValue,
  setTxTimerValue,
  resetTxStatus,
  setTxHash,
} from '../../../redux/app/actions';
import midgardActions from '../../../redux/midgard/actions';
import * as walletActions from '../../../redux/wallet/actions';
import AddressInput from '../../../components/uielements/addressInput';
import ContentTitle from '../../../components/uielements/contentTitle';
import Slider from '../../../components/uielements/slider';
import StepBar from '../../../components/uielements/stepBar';
import Trend from '../../../components/uielements/trend';
import { MAX_VALUE } from '../../../redux/app/const';
import { delay } from '../../../helpers/asyncHelper';

const { getPools, getPoolAddress } = midgardActions;

class SwapSend extends Component {
  addressRef = React.createRef();

  /**
   * Hash of swap `tx`
   */
  hash = null;

  /**
   * Calculated result
   */
  calcResult = null;

  constructor(props) {
    super(props);
    this.state = {
      address: emptyString,
      password: emptyString,
      invalidPassword: false,
      invalidAddress: false,
      validatingPassword: false,
      dragReset: true,
      xValue: 0,
      percent: 0,
      openPrivateModal: false,
      openWalletAlert: false,
      slipProtection: true,
      maxSlip: 30,
      txResult: null,
    };
  }

  componentDidMount() {
    const { getPools, getPoolAddress } = this.props;

    getPoolAddress();
    getPools();
  }

  componentDidUpdate(prevProps) {
    const {
      wsTransfers,
      txStatus: { hash },
    } = this.props;

    const { txResult } = this.state;
    const length = wsTransfers.length;
    const lastTx = wsTransfers[length - 1];

    if (
      length !== prevProps.wsTransfers.length &&
      length > 0 &&
      hash !== undefined &&
      txResult === null
    ) {
      const txResult = getTxResult({
        tx: lastTx,
        hash,
      });

      if (txResult) {
        this.setState({
          txResult,
        });
      }
    }
  }

  componentWillUnmount() {
    const { resetTxStatus } = this.props;
    resetTxStatus();
  }

  isValidRecipient = () => {
    const { address } = this.state;

    return Binance.isValidAddress(address);
  };

  handleChangePassword = e => {
    this.setState({
      password: e.target.value,
      invalidPassword: false,
    });
  };

  handleChangeAddress = e => {
    this.setState({
      address: e.target.value,
      invalidAddress: false,
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
    if (Number.isNaN(Number(value))) {
      return;
    }

    const { info, user } = this.props;
    const newValue = value;
    const wallet = user ? user.wallet : null;

    // if wallet is disconnected, just set the value
    if (!wallet) {
      this.setState({
        xValue: newValue,
      });
      return;
    }

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

    const { user } = this.props;
    const { password } = this.state;

    if (user) {
      const { keystore, wallet } = user;

      this.setState({ validatingPassword: true });
      // Short delay to render latest state changes of `validatingPassword`
      await delay(200);

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
          validatingPassword: false,
          openPrivateModal: false,
        });
      } catch (error) {
        this.setState({
          validatingPassword: false,
          invalidPassword: true,
        });
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  handleOpenPrivateModal = () => {
    this.setState({
      openPrivateModal: true,
      password: emptyString,
      invalidPassword: false,
    });
  };

  handleCancelPrivateModal = () => {
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
    const { view, user } = this.props;
    const { xValue } = this.state;
    const wallet = user ? user.wallet : null;
    const keystore = user ? user.keystore : null;

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

    if (!this.validateSlip(this.calcResult.slip)) {
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
    const { resetTxStatus } = this.props;

    resetTxStatus({
      type: 'swap', // TxTypes.SWAP,
      modal: true,
      status: true,
      startTime: Date.now(),
    });
  };

  handleCloseModal = () => {
    const { setTxTimerModal } = this.props;
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

  handleChangeTxTimer = () => {
    const { countTxTimerValue, setTxTimerValue, txStatus } = this.props;
    const { txResult } = this.state;
    const { value } = txStatus;
    // Count handling depends on `txResult`
    // If tx has been confirmed, then we jump to last `valueIndex` ...
    if (txResult !== null && value < MAX_VALUE) {
      setTxTimerValue(MAX_VALUE);
    }
    // In other cases (no `txResult`) we don't jump to last `indexValue`...
    if (txResult === null) {
      // ..., but we are still counting
      if (value < 75) {
        // Add a quarter
        countTxTimerValue(25);
      } else if (value >= 75 && value < 95) {
        // With last quarter we just count a little bit to signalize still a progress
        countTxTimerValue(1);
      }
    }
  };

  handleEndTxTimer = () => {
    const { setTxTimerStatus } = this.props;
    setTxTimerStatus(false);
    this.setState({
      dragReset: true,
    });
  };

  handleConfirmSwap = async () => {
    const { user, info, setTxHash, resetTxStatus } = this.props;
    const { xValue, address, slipProtection } = this.state;
    const { source, target } = getPair(info);

    if (user) {
      this.setState({
        txResult: null,
      });

      this.handleStartTimer();
      try {
        const { result } = await confirmSwap(
          Binance,
          user.wallet,
          source,
          target,
          this.calcResult,
          xValue,
          slipProtection,
          address,
        );

        setTxHash(result[0]?.hash);
      } catch (error) {
        notification['error']({
          message: 'Swap Invalid',
          description: 'Swap information is not valid.',
        });
        this.setState({
          dragReset: true,
        });
        resetTxStatus();
        console.error(error); // eslint-disable-line no-console
      }
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

  handleClickFinish = () => {
    const { resetTxStatus } = this.props;
    resetTxStatus();
    this.props.history.push('/swap');
  };

  renderSwapModalContent = (swapData, info) => {
    const {
      txStatus: { status, value, startTime, hash },
      basePriceAsset,
      priceIndex,
    } = this.props;
    const { xValue, txResult } = this.state;

    const { source, target } = swapData;
    const { slip, outputAmount } = info;

    const Px = priceIndex.RUNE;
    const tokenPrice = _get(priceIndex, target.toUpperCase(), 0);

    const priceFrom = Number(Px * xValue);
    const priceTo = Number(outputAmount * tokenPrice);
    const slipAmount = slip;

    // const transactionLabels = [
    //   'sending transaction',
    //   'processing transaction',
    //   'signing transaction',
    //   'finishing transaction',
    //   'complete',
    // ];

    const completed = !status && txResult !== null;
    const refunded = txResult?.type === 'refund' ?? false;
    const targetToken = !completed ? target : getTickerFormat(txResult.token);
    const tokenAmount = !completed
      ? Number(outputAmount)
      : Number(txResult.amount);
    let priceValue = 0;

    if (refunded) {
      priceValue = priceFrom;
    } else {
      priceValue = !completed
        ? priceTo
        : Number(Number(txResult.amount) * tokenPrice);
    }

    const txURL = TESTNET_TX_BASE_URL + hash;

    return (
      <SwapModalContent>
        <Row className="swapmodal-content">
          <div className="timer-container">
            <TxTimer
              status={status}
              value={value}
              maxValue={MAX_VALUE}
              startTime={startTime}
              onChange={this.handleChangeTxTimer}
              onEnd={this.handleEndTxTimer}
              refunded={refunded}
            />
          </div>
          <div className="coin-data-wrapper">
            <StepBar size={50} />
            <div className="coin-data-container">
              <CoinData
                data-test="swapmodal-coin-data-send"
                asset={source}
                assetValue={xValue}
                price={priceFrom}
                priceUnit={basePriceAsset}
              />
              <CoinData
                data-test="swapmodal-coin-data-receive"
                asset={targetToken}
                assetValue={tokenAmount}
                price={priceValue}
                priceUnit={basePriceAsset}
              />
            </div>
          </div>
        </Row>
        <Row className="swap-info-wrapper">
          <Trend value={slipAmount} />
          {hash && (
            <div className="hash-address">
              <div className="copy-btn-wrapper">
                {completed && (
                  <Button
                    className="view-btn"
                    color="success"
                    onClick={this.handleClickFinish}
                  >
                    FINISH
                  </Button>
                )}
                <a href={txURL} target="_blank" rel="noopener noreferrer">
                  VIEW TRANSACTION
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

  renderProtectPopoverContent = () => {
    return (
      <div
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: '11px',
          color: '#50E3C2',
        }}
      >
        Protect my price (within 3%)
      </div>
    );
  };

  render() {
    const {
      view,
      info,
      txStatus,
      assets: tokenInfo,
      poolData,
      poolAddress,
      assetData,
      priceIndex,
      basePriceAsset,
    } = this.props;
    const {
      dragReset,
      address,
      invalidAddress,
      invalidPassword,
      validatingPassword,
      xValue,
      percent,
      openPrivateModal,
      openWalletAlert,
      password,
      slipProtection,
      txResult,
    } = this.state;

    const swapData = getPair(info);

    if (!swapData || !Object.keys(tokenInfo).length) {
      return '';
    }

    const { source, target } = swapData;

    const tokensData = Object.keys(tokenInfo).map(tokenName => {
      const tokenData = tokenInfo[tokenName];
      const symbol = _get(tokenData, 'asset.symbol', null);
      const price = _get(tokenData, 'priceRune', 0);

      return {
        asset: symbol,
        price,
      };
    });

    const runePrice = priceIndex.RUNE;

    // add rune data in the target token list
    tokensData.push({
      asset: 'RUNE-A1F',
      price: runePrice,
    });

    const { sourceData, targetData } = this.validatePair(assetData, tokensData);

    const dragTitle = 'Drag to swap';

    const openSwapModal = txStatus.type === 'swap' ? txStatus.modal : false;

    // calculation
    this.calcResult = getCalcResult(
      source,
      target,
      poolData,
      poolAddress,
      xValue,
      runePrice,
    );
    const { slip, outputAmount, outputPrice } = this.calcResult;
    const sourcePrice = _get(priceIndex, source.toUpperCase(), outputPrice);
    const targetPrice = _get(priceIndex, target.toUpperCase(), outputPrice);

    const ratio = targetPrice !== 0 ? sourcePrice / targetPrice : 0;

    const ratioLabel = `1 ${source.toUpperCase()} = ${getFixedNumber(
      ratio,
      2,
    )} ${target.toUpperCase()}`;

    // swap modal

    const completed = !txStatus.status && txResult !== null;
    const refunded = txResult && txResult.type === 'refund';

    // eslint-disable-next-line no-nested-ternary
    const swapTitle = !completed
      ? 'YOU ARE SWAPPING'
      : refunded
      ? 'TOKEN REFUNDED'
      : 'YOU SWAPPED';

    return (
      <ContentWrapper className="swap-detail-wrapper">
        <Row>
          <Col
            className="swap-status-panel desktop-view"
            xs={{ span: 0, offset: 0 }}
            md={{ span: 4 }}
            lg={{ span: 6 }}
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
            md={{ span: 16, offset: 4 }}
            lg={{ span: 12, offset: 0 }}
          >
            <SwapAssetCard>
              <ContentTitle>you are swapping</ContentTitle>
              <TokenCard
                title="You are swapping"
                inputTitle="swap amount"
                asset={source}
                assetData={sourceData}
                amount={xValue}
                price={sourcePrice}
                priceIndex={priceIndex}
                unit={basePriceAsset}
                onChange={this.handleChangeValue}
                onChangeAsset={this.handleChangeSource}
                onSelect={this.handleSelectAmount(source)}
                inputProps={{ 'data-test': 'coincard-source-input' }}
                withSelection
                withSearch
                data-test="coincard-source"
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
                  'data-test': 'coincard-target-input',
                }}
                asset={target}
                assetData={targetData}
                amount={outputAmount}
                price={targetPrice}
                priceIndex={priceIndex}
                unit={basePriceAsset}
                slip={slip}
                onChangeAsset={this.handleSelectTraget}
                withSearch
                data-test="coincard-target"
              />
              <div className="swaptool-container">
                <CardFormHolder>
                  <CardForm>
                    <CardFormItem className={invalidAddress ? 'has-error' : ''}>
                      <AddressInput
                        value={address}
                        onChange={this.handleChangeAddress}
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
                    <Popover
                      content={this.renderProtectPopoverContent()}
                      placement="left"
                      trigger={[]}
                      visible
                      overlayClassName="protectPrice-popover"
                      overlayStyle={{
                        padding: '6px',
                        animationDuration: '0s !important',
                        animation: 'none !important',
                      }}
                    >
                      <Button
                        onClick={this.handleSwitchSlipProtection}
                        sizevalue="small"
                        typevalue="outline"
                        focused={slipProtection}
                        style={{ borderColor: '#33CCFF' }}
                      >
                        <Icon type={slipProtection ? 'lock' : 'unlock'} />
                      </Button>
                    </Popover>
                  </CardForm>
                </CardFormHolder>
              </div>
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
          visible={openSwapModal}
          footer={null}
          onCancel={this.handleCloseModal}
          onClose={this.handleCloseModal}
        >
          {this.renderSwapModalContent(swapData, this.calcResult)}
        </SwapModal>
        <PrivateModal
          title="PASSWORD CONFIRMATION"
          visible={openPrivateModal}
          onOk={!validatingPassword ? this.handleConfirmPassword : undefined}
          onCancel={this.handleCancelPrivateModal}
          okText="CONFIRM"
          cancelText="CANCEL"
          maskClosable={false}
          closable={false}
          closa
        >
          <Form onSubmit={this.handleConfirmPassword} autoComplete="off">
            <Form.Item
              className={invalidPassword ? 'has-error' : emptyString}
              extra={validatingPassword ? 'Validating password ...' : ''}
            >
              <Input
                data-test="password-confirmation-input"
                type="password"
                typevalue="ghost"
                sizevalue="big"
                value={password}
                onChange={this.handleChangePassword}
                prefix={<Icon type="lock" />}
                autoComplete="off"
              />
              {invalidPassword && (
                <div className="ant-form-explain">Password is wrong!</div>
              )}
            </Form.Item>
          </Form>
        </PrivateModal>
        )
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

SwapSend.propTypes = {
  info: PropTypes.string,
  view: PropTypes.string.isRequired,
  history: PropTypes.object,
  txStatus: PropTypes.object.isRequired,
  assetData: PropTypes.array.isRequired,
  pools: PropTypes.array.isRequired,
  poolAddress: PropTypes.string.isRequired,
  assets: PropTypes.object.isRequired,
  poolData: PropTypes.object.isRequired,
  basePriceAsset: PropTypes.string.isRequired,
  priceIndex: PropTypes.object.isRequired,
  user: PropTypes.object, // Maybe<User>
  wsTransfers: PropTypes.array.isRequired,
  setTxTimerModal: PropTypes.func.isRequired,
  setTxTimerStatus: PropTypes.func.isRequired,
  setTxTimerValue: PropTypes.func.isRequired,
  setTxHash: PropTypes.func.isRequired,
  countTxTimerValue: PropTypes.func.isRequired,
  resetTxStatus: PropTypes.func.isRequired,
  getPools: PropTypes.func.isRequired,
  getPoolAddress: PropTypes.func.isRequired,
  refreshBalance: PropTypes.func.isRequired,
};

SwapSend.defaultProps = {
  info: '',
};

export default compose(
  connect(
    state => ({
      txStatus: state.App.txStatus,
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      pools: state.Midgard.pools,
      poolAddress: state.Midgard.poolAddress,
      assets: state.Midgard.assets,
      poolData: state.Midgard.poolData,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
    }),
    {
      getPools,
      getPoolAddress,
      setTxTimerModal,
      setTxTimerStatus,
      setTxTimerValue,
      countTxTimerValue,
      setTxHash,
      resetTxStatus,
      refreshBalance: walletActions.refreshBalance,
    },
  ),
  withRouter,
  withBinanceTransferWS,
)(SwapSend);
