import React from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, Icon, notification, Popover } from 'antd';

import { crypto } from '@binance-chain/javascript-sdk';
import Binance from '../../../clients/binance';

import Button from '../../../components/uielements/button';
import Drag from '../../../components/uielements/drag';
import TokenCard from '../../../components/uielements/tokens/tokenCard';
import CoinData from '../../../components/uielements/coins/coinData';
import Status from '../../../components/uielements/status';
import TxTimer from '../../../components/uielements/txTimer';
import Modal from '../../../components/uielements/modal';
import PrivateModal from '../../../components/modals/privateModal';

import {
  ContentWrapper,
  SwapModalContent,
  SwapModal,
  SwapAssetCard,
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
  Pair,
} from '../../../helpers/stringHelper';
import { TESTNET_TX_BASE_URL } from '../../../helpers/apiHelper';
import {
  getCalcResult,
  confirmSwap,
  getTxResult,
  validatePair,
} from '../utils';
import { withBinanceTransferWS } from '../../../HOC/websocket/WSBinance';

import * as appActions from '../../../redux/app/actions';
import * as midgardActions from '../../../redux/midgard/actions';
import * as walletActions from '../../../redux/wallet/actions';
import AddressInput from '../../../components/uielements/addressInput';
import ContentTitle from '../../../components/uielements/contentTitle';
import Slider from '../../../components/uielements/slider';
import StepBar from '../../../components/uielements/stepBar';
import Trend from '../../../components/uielements/trend';
import { MAX_VALUE } from '../../../redux/app/const';
import { delay } from '../../../helpers/asyncHelper';
import { FixmeType, Maybe, Nothing, TokenData } from '../../../types/bepswap';
import { SwapSendView, CalcResult } from './types';
import { User, AssetData } from '../../../redux/wallet/types';
import { TxStatus, TxTypes } from '../../../redux/app/types';

import {
  AssetDetailMap,
  PriceDataIndex,
  PoolDataMap,
} from '../../../redux/midgard/types';
import { RootState } from '../../../redux/store';
import { getAssetFromString } from '../../../redux/midgard/utils';

type ComponentProps = {
  info: string;
  view: SwapSendView;
  // TÓDO(veado): Add type for WSTransfer based on Binance WS Api
  wsTransfers: FixmeType[];
};

type ConnectedProps = {
  history: H.History;
  txStatus: TxStatus;
  assetData: AssetData[];
  poolAddress: string;
  assets: AssetDetailMap;
  poolData: PoolDataMap;
  basePriceAsset: string;
  priceIndex: PriceDataIndex;
  user: Maybe<User>;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxTimerStatus: typeof appActions.setTxTimerStatus;
  setTxTimerValue: typeof appActions.setTxTimerValue;
  setTxHash: typeof appActions.setTxHash;
  countTxTimerValue: typeof appActions.countTxTimerValue;
  resetTxStatus: typeof appActions.resetTxStatus;
  getPools: typeof midgardActions.getPools;
  getPoolAddress: typeof midgardActions.getPoolAddress;
  refreshBalance: typeof walletActions.refreshBalance;
};

type Props = ComponentProps & ConnectedProps;

interface State {
  address: string;
  password: string;
  invalidPassword: boolean;
  invalidAddress: boolean;
  validatingPassword: boolean;
  dragReset: boolean;
  xValue: number;
  percent: number;
  openPrivateModal: boolean;
  openWalletAlert: boolean;
  slipProtection: boolean;
  maxSlip: number;
  txResult: Maybe<TxResult>;
}

type TxResult = {
  type: string;
  amount: string;
  token: string;
};

class SwapSend extends React.Component<Props, State> {
  addressRef = React.createRef();

  /**
   * Calculated result
   */
  calcResult: Maybe<CalcResult> = Nothing;

  static readonly defaultProps: Partial<Props> = {
    info: '',
  };

  constructor(props: Props) {
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

  componentDidUpdate(prevProps: Props) {
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

  handleChangePassword = (password: string) => {
    this.setState({
      password,
      invalidPassword: false,
    });
  };

  handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      address: e.target.value,
      invalidAddress: false,
    });
  };

  handleChangePercent = (percent: number) => {
    const { info } = this.props;

    const { assetData } = this.props;
    const { source }: Pair = getPair(info);

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

  handleChangeValue = (value: number | string) => {
    if (Number.isNaN(Number(value))) {
      return;
    }

    const { info, user } = this.props;
    const newValue = value as number;
    const wallet = user ? user.wallet : null;

    // if wallet is disconnected, just set the value
    if (!wallet) {
      this.setState({
        xValue: newValue,
      });
      return;
    }

    const { assetData } = this.props;
    const { source }: Pair = getPair(info);

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
        percent: 100,
      });
    } else {
      this.setState({
        xValue: newValue,
        percent: (100 * newValue) / totalAmount,
      });
    }
  };

  handleConfirmPassword = async () => {
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

    if (view === SwapSendView.SEND && !this.isValidRecipient()) {
      this.setState({
        invalidAddress: true,
        dragReset: true,
      });
      return;
    }

    if (this.calcResult && this.validateSlip(this.calcResult.slip)) {
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
    }
  };

  handleStartTimer = () => {
    const { resetTxStatus } = this.props;

    resetTxStatus({
      type: TxTypes.SWAP,
      modal: true,
      status: true,
      startTime: Date.now(),
    });
  };

  handleCloseModal = () => {
    const { setTxTimerModal } = this.props;
    setTxTimerModal(false);
  };

  handleChangeSwapType = (state: boolean) => {
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

  handleChangeSource = (asset: string) => {
    const { view, info } = this.props;
    const { source, target }: Pair = getPair(info);
    const selectedToken = getTickerFormat(asset);

    const URL =
      selectedToken === target
        ? `/swap/${view}/${selectedToken}-${source}`
        : `/swap/${view}/${selectedToken}-${target}`;
    this.props.history.push(URL);
  };

  handleSelectTraget = (asset: string) => {
    const { view, info } = this.props;
    const { source, target }: Pair = getPair(info);
    const selectedToken = getTickerFormat(asset);

    const URL =
      source === selectedToken
        ? `/swap/${view}/${target}-${selectedToken}`
        : `/swap/${view}/${source}-${selectedToken}`;
    this.props.history.push(URL);
  };

  handleReversePair = () => {
    const { view, info, assetData } = this.props;
    const { source, target }: Pair = getPair(info);

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

  validatePair = (
    sourceInfo: AssetData[],
    targetInfo: { asset: string }[],
    pair: Pair,
  ) => {
    if (!targetInfo.length) {
      this.props.history.push('/swap');
    }

    return validatePair(pair, sourceInfo, targetInfo);
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
    const { source, target }: Pair = getPair(info);

    if (user && this.calcResult) {
      this.setState({
        txResult: null,
      });

      this.handleStartTimer();
      try {
        const data = await confirmSwap(
          Binance,
          user.wallet,
          source,
          target,
          this.calcResult,
          xValue,
          slipProtection,
          address,
        );

        const result = data?.result ?? [];
        const hash = result[0]?.hash;
        if (hash) {
          setTxHash(hash);
        }
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

  handleSelectAmount = (source: string) => (amount: number) => {
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

  renderSwapModalContent = (
    swapSource: string,
    swapTarget: string,
    info: CalcResult,
  ) => {
    const {
      txStatus: { status, value, startTime, hash },
      basePriceAsset,
      priceIndex,
    } = this.props;
    const { xValue, txResult } = this.state;

    const { slip, outputAmount } = info;

    const Px = priceIndex.RUNE;
    const tokenPrice = priceIndex[swapTarget.toUpperCase()] || 0;

    const priceFrom = Number(Px * xValue);
    const priceTo = outputAmount * Number(tokenPrice);
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
    const targetToken = !completed
      ? swapTarget
      : getTickerFormat(txResult?.token);
    const tokenAmount = !completed
      ? Number(outputAmount)
      : Number(txResult?.amount);
    let priceValue = 0;

    if (refunded) {
      priceValue = priceFrom;
    } else {
      priceValue = !completed ? priceTo : Number(txResult?.amount) * tokenPrice;
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
                asset={swapSource}
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

  validateSlip = (slip: number) => {
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

    const swapPair: Pair = getPair(info);

    if (
      !swapPair.source ||
      !swapPair.target ||
      !Object.keys(tokenInfo).length
    ) {
      return '';
    }

    const { source: swapSource, target: swapTarget } = swapPair;

    const tokensData: TokenData[] = Object.keys(tokenInfo).map(tokenName => {
      const tokenData = tokenInfo[tokenName];
      const assetStr = tokenData?.asset;
      const asset = assetStr ? getAssetFromString(assetStr) : null;
      const price = tokenData?.priceRune ?? 0;

      return {
        asset: asset?.symbol ?? '',
        price,
      };
    });

    const runePrice = priceIndex.RUNE;

    // add rune data in the target token list
    tokensData.push({
      asset: 'RUNE-A1F',
      price: runePrice,
    });

    const pair: Pair = getPair(info);
    const { sourceData, targetData } = this.validatePair(
      assetData,
      tokensData,
      pair,
    );

    const dragTitle = 'Drag to swap';

    const openSwapModal = txStatus.type === 'swap' ? txStatus.modal : false;

    // calculation
    this.calcResult = getCalcResult(
      swapSource,
      swapTarget,
      poolData,
      poolAddress,
      xValue,
      runePrice,
    );

    if (!this.calcResult) {
      // ^ It should never be happen in theory, but who knows...
      // Todo(veado): Should we display an error message in this case?
      return <></>;
    } else {
      const { slip, outputAmount, outputPrice } = this.calcResult;
      const sourcePrice = priceIndex[swapSource.toUpperCase()] || outputPrice;
      const targetPrice = priceIndex[swapTarget.toUpperCase()] || outputPrice;

      const ratio = targetPrice !== 0 ? sourcePrice / targetPrice : 0;

      const ratioLabel = `1 ${swapSource.toUpperCase()} = ${getFixedNumber(
        ratio,
        2,
      )} ${swapTarget.toUpperCase()}`;

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
                  asset={swapSource}
                  assetData={sourceData}
                  amount={xValue}
                  price={sourcePrice}
                  priceIndex={priceIndex}
                  unit={basePriceAsset}
                  onChange={this.handleChangeValue}
                  onChangeAsset={this.handleChangeSource}
                  onSelect={this.handleSelectAmount(swapSource)}
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
                  asset={swapTarget}
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
                      <CardFormItem
                        className={invalidAddress ? 'has-error' : ''}
                      >
                        <AddressInput
                          value={address}
                          onChange={this.handleChangeAddress}
                          status={view === SwapSendView.SEND}
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
                  source={swapSource}
                  target={swapTarget}
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
          >
            {this.renderSwapModalContent(
              swapSource,
              swapTarget,
              this.calcResult,
            )}
          </SwapModal>
          <PrivateModal
            visible={openPrivateModal}
            validatingPassword={validatingPassword}
            invalidPassword={invalidPassword}
            password={password}
            onChangePassword={this.handleChangePassword}
            onOk={this.handleConfirmPassword}
            onCancel={this.handleCancelPrivateModal}
          />
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
}

export default compose(
  connect(
    (state: RootState) => ({
      txStatus: state.App.txStatus,
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      poolAddress: state.Midgard.poolAddress,
      assets: state.Midgard.assets,
      poolData: state.Midgard.poolData,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
    }),
    {
      getPools: midgardActions.getPools,
      getPoolAddress: midgardActions.getPoolAddress,
      setTxTimerModal: appActions.setTxTimerModal,
      setTxTimerStatus: appActions.setTxTimerStatus,
      countTxTimerValue: appActions.countTxTimerValue,
      setTxTimerValue: appActions.setTxTimerValue,
      resetTxStatus: appActions.resetTxStatus,
      setTxHash: appActions.setTxHash,
      refreshBalance: walletActions.refreshBalance,
    },
  ),
  withRouter,
  withBinanceTransferWS,
)(SwapSend) as React.ComponentClass<ComponentProps, State>;
