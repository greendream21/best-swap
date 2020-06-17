import React from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { SwapOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Row, notification } from 'antd';
import {
  client as binanceClient,
  getPrefix,
} from '@thorchain/asgardex-binance';
import {
  validBNOrZero,
  bnOrZero,
  isValidBN,
  bn,
  delay,
} from '@thorchain/asgardex-util';

import { crypto } from '@binance-chain/javascript-sdk';
import BigNumber from 'bignumber.js';
import * as RD from '@devexperts/remote-data-ts';

import {
  TokenAmount,
  tokenAmount,
  baseToToken,
  BaseAmount,
  baseAmount,
  tokenToBase,
} from '@thorchain/asgardex-token';
import Text from 'antd/lib/typography/Text';
import Button from '../../../components/uielements/button';
import Label from '../../../components/uielements/label';
import Drag from '../../../components/uielements/drag';
import TokenCard from '../../../components/uielements/tokens/tokenCard';
import CoinData from '../../../components/uielements/coins/coinData';
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
  PopoverContent,
  PopoverContainer,
  FeeParagraph,
  SliderSwapWrapper,
} from './SwapSend.style';
import {
  getTickerFormat,
  getPair,
  emptyString,
} from '../../../helpers/stringHelper';
import { TESTNET_TX_BASE_URL } from '../../../helpers/apiHelper';
import {
  getCalcResult,
  confirmSwap,
  getTxResult,
  validatePair,
  isValidSwap,
} from '../utils';
import { getAppContainer } from '../../../helpers/elementHelper';

import * as appActions from '../../../redux/app/actions';
import * as midgardActions from '../../../redux/midgard/actions';
import * as walletActions from '../../../redux/wallet/actions';
import * as binanceActions from '../../../redux/binance/actions';
import AddressInput from '../../../components/uielements/addressInput';
import ContentTitle from '../../../components/uielements/contentTitle';
import Slider from '../../../components/uielements/slider';
import StepBar from '../../../components/uielements/stepBar';
import Trend from '../../../components/uielements/trend';
import { MAX_VALUE } from '../../../redux/app/const';
import {
  Maybe,
  Nothing,
  TokenData,
  Pair,
  AssetPair,
} from '../../../types/bepswap';
import { SwapSendView, CalcResult } from './types';
import { User, AssetData } from '../../../redux/wallet/types';
import { TxStatus, TxTypes } from '../../../redux/app/types';

import { PriceDataIndex, PoolDataMap } from '../../../redux/midgard/types';
import { RootState } from '../../../redux/store';
import { getAssetFromString } from '../../../redux/midgard/utils';
import { BINANCE_NET, getNet } from '../../../env';
import { PoolDetailStatusEnum } from '../../../types/generated/midgard';
import {
  TransferEventRD,
  TransferFeesRD,
  TransferFees,
} from '../../../redux/binance/types';
import {
  getAssetFromAssetData,
  bnbBaseAmount,
} from '../../../helpers/walletHelper';

type ComponentProps = {
  info: string;
};

type ConnectedProps = {
  history: H.History;
  txStatus: TxStatus;
  assetData: AssetData[];
  poolAddress: string;
  poolData: PoolDataMap;
  pools: string[];
  basePriceAsset: string;
  priceIndex: PriceDataIndex;
  user: Maybe<User>;
  wsTransferEvent: TransferEventRD;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxTimerStatus: typeof appActions.setTxTimerStatus;
  setTxTimerValue: typeof appActions.setTxTimerValue;
  setTxHash: typeof appActions.setTxHash;
  countTxTimerValue: typeof appActions.countTxTimerValue;
  resetTxStatus: typeof appActions.resetTxStatus;
  getPools: typeof midgardActions.getPools;
  getPoolAddress: typeof midgardActions.getPoolAddress;
  refreshBalance: typeof walletActions.refreshBalance;
  getBinanceFees: typeof binanceActions.getBinanceFees;
  transferFees: TransferFeesRD;
  subscribeBinanceTransfers: typeof binanceActions.subscribeBinanceTransfers;
  unSubscribeBinanceTransfers: typeof binanceActions.unSubscribeBinanceTransfers;
};

type Props = ComponentProps & ConnectedProps;

type State = {
  address: string;
  password: string;
  invalidPassword: boolean;
  invalidAddress: boolean;
  validatingPassword: boolean;
  dragReset: boolean;
  xValue: TokenAmount;
  percent: number;
  openPrivateModal: boolean;
  openWalletAlert: boolean;
  slipProtection: boolean;
  maxSlip: number;
  txResult: Maybe<TxResult>;
  timerFinished: boolean;
  view: SwapSendView;
};

type TxResult = {
  type: string;
  amount: string;
  token: string;
};

class SwapSend extends React.Component<Props, State> {
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
      xValue: tokenAmount(0),
      percent: 0,
      openPrivateModal: false,
      openWalletAlert: false,
      slipProtection: true,
      maxSlip: 30,
      txResult: null,
      timerFinished: false,
      view: SwapSendView.DETAIL,
    };
  }

  componentDidMount() {
    const {
      getPools,
      getPoolAddress,
      subscribeBinanceTransfers,
      transferFees,
      getBinanceFees,
      user,
    } = this.props;
    const net = getNet();
    getPoolAddress();
    getPools();
    if (RD.isInitial(transferFees)) {
      getBinanceFees(net);
    }
    const wallet = user?.wallet;
    if (wallet) {
      subscribeBinanceTransfers({ address: wallet, net });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      wsTransferEvent,
      txStatus: { hash },
      user,
      info,
      subscribeBinanceTransfers,
      unSubscribeBinanceTransfers,
    } = this.props;

    const { txResult } = this.state;
    const pair: Pair = getPair(info);

    const prevWallet = prevProps?.user?.wallet;
    const wallet = user?.wallet;
    // subscribe if wallet has been added for first time
    if (!prevWallet && wallet) {
      subscribeBinanceTransfers({ address: wallet, net: getNet() });
    }
    // subscribe again if another wallet has been added
    if (prevWallet && wallet && prevWallet !== wallet) {
      unSubscribeBinanceTransfers();
      subscribeBinanceTransfers({ address: wallet, net: getNet() });
    }

    const currentWsTransferEvent = RD.toNullable(wsTransferEvent);
    const prevWsTransferEvent = RD.toNullable(prevProps?.wsTransferEvent);

    // check incoming wsTransferEvent
    if (
      currentWsTransferEvent &&
      currentWsTransferEvent !== prevWsTransferEvent &&
      hash !== undefined &&
      txResult === null &&
      !this.isCompleted()
    ) {
      const txResult = getTxResult({
        pair,
        tx: currentWsTransferEvent,
        address: wallet,
      });

      if (txResult) {
        this.setState({
          txResult,
        });
      }
    }
  }

  componentWillUnmount() {
    const { resetTxStatus, unSubscribeBinanceTransfers } = this.props;
    resetTxStatus();
    unSubscribeBinanceTransfers();
  }

  isValidRecipient = async () => {
    const { address } = this.state;
    const bncClient = await binanceClient(BINANCE_NET);
    return bncClient.isValidAddress(address);
  };

  isCompleted = (): boolean => {
    const { txResult, timerFinished } = this.state;
    const { txStatus } = this.props;
    return !txStatus.status && (txResult !== Nothing || timerFinished);
  };

  calcResult = (): Maybe<CalcResult> => {
    const { poolData, poolAddress, info, priceIndex } = this.props;

    const { xValue } = this.state;

    const swapPair: Pair = getPair(info);

    if (!swapPair.source || !swapPair.target) {
      return Nothing;
    }

    const { source, target } = swapPair;
    const runePrice = validBNOrZero(priceIndex?.RUNE);

    return getCalcResult(
      source,
      target,
      poolData,
      poolAddress,
      xValue,
      runePrice,
    );
  };

  handleChangePassword = (password: string) => {
    this.setState({
      password,
      invalidPassword: false,
    });
  };

  handleChangeAddress = (address: string) => {
    this.setState({
      address,
      invalidAddress: false,
    });
  };

  handleChangePercent = (percent: number) => {
    const { info } = this.props;

    const { assetData } = this.props;
    const { source = '' }: Pair = getPair(info);

    const sourceAsset = getAssetFromAssetData(assetData, source);

    let totalAmount = sourceAsset?.assetValue.amount() ?? bn(0);
    // fee transformation: BaseAmount -> TokenAmount -> BigNumber
    const fee = this.bnbFeeAmount() || baseAmount(0);
    const feeAsToken = baseToToken(fee);
    const feeAsTokenBN = feeAsToken.amount();
    // substract fee  - for BNB source only
    if (this.subtractBnbFee()) {
      totalAmount = totalAmount.isGreaterThan(feeAsTokenBN)
        ? totalAmount.minus(feeAsTokenBN)
        : bn(0);
    }
    // formula (totalAmount * percent) / 100
    const newValue = totalAmount.multipliedBy(percent).div(100);

    if (totalAmount.isLessThan(newValue)) {
      this.setState({
        xValue: tokenAmount(totalAmount),
        percent,
      });
    } else {
      this.setState({
        xValue: tokenAmount(newValue),
        percent,
      });
    }
  };

  handleChangeValue = (value: BigNumber) => {
    const { info, user } = this.props;
    const newValue = tokenAmount(value);
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

    const sourceAsset = getAssetFromAssetData(assetData, source);

    const totalAmount = sourceAsset?.assetValue.amount() ?? bn(0);

    if (totalAmount.isLessThanOrEqualTo(newValue.amount())) {
      this.setState({
        xValue: tokenAmount(totalAmount),
        percent: 100,
      });
    } else {
      this.setState({
        xValue: newValue,
        // formula (100 * newValue) / totalAmount
        percent: newValue
          .amount()
          .multipliedBy(100)
          .div(totalAmount)
          .toNumber(),
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
        const bncClient = await binanceClient(BINANCE_NET);
        await bncClient.setPrivateKey(privateKey);
        const address = crypto.getAddressFromPrivateKey(
          privateKey,
          getPrefix(BINANCE_NET),
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

  /**
   * Handler for moving drag slider to the end
   *
   * That's the point we do first validation
   *
   */
  handleEndDrag = async () => {
    const { user } = this.props;
    const { xValue, view } = this.state;
    const wallet = user ? user.wallet : null;
    const keystore = user ? user.keystore : null;

    // Validate existing wallet
    if (!wallet) {
      this.setState({
        openWalletAlert: true,
      });
      return;
    }

    // Validate amount to swap
    if (xValue.amount().isLessThanOrEqualTo(0)) {
      notification.error({
        message: 'Swap Invalid',
        description: 'You need to enter an amount to swap.',
        getContainer: getAppContainer,
      });
      this.setState({
        dragReset: true,
      });
      return;
    }

    // Validate RUNE value of swap to cover network transactionFee
    if (this.runeFeeIsNotCovered(xValue.amount())) {
      notification.error({
        message: 'Invalid amount',
        description: 'Swap value must exceed 1 RUNE to cover network fees.',
        getContainer: getAppContainer,
      });
      this.setState({
        dragReset: true,
      });
      return;
    }

    // Validate BNB amount to consider fees
    if (this.considerBnb()) {
      const fee = this.bnbFeeAmount() || baseAmount(0);
      // fee transformation: BaseAmount -> TokenAmount -> BigNumber
      const feeAsTokenAmount = baseToToken(fee).amount();
      if (xValue.amount().isLessThanOrEqualTo(feeAsTokenAmount)) {
        notification.error({
          message: 'Invalid BNB value',
          description: 'Not enough BNB to cover the fee for this transaction.',
          getContainer: getAppContainer,
        });
        this.setState({
          dragReset: true,
        });
        return;
      }
    }

    // Validate address to send to
    const isValidRecipient = await this.isValidRecipient();
    if (view === SwapSendView.SEND && !isValidRecipient) {
      this.setState({
        invalidAddress: true,
        dragReset: true,
      });
      return;
    }

    // Validate calculation + slip
    const calcResult = this.calcResult();
    if (calcResult && this.validateSlip(calcResult.slip)) {
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

    this.setState({ timerFinished: false });
    resetTxStatus({
      type: TxTypes.SWAP,
      modal: true,
      status: true,
      startTime: Date.now(),
    });
  };

  handleCloseModal = () => {
    const { setTxTimerModal } = this.props;
    if (this.isCompleted()) {
      this.handleCompleted();
    } else {
      setTxTimerModal(false);

      // Finish the tx timer as we no longer minimize modal to txView in the header
      this.handleEndTxTimer();
    }
  };

  handleChangeSwapType = (toSend: boolean) => {
    const view = toSend ? SwapSendView.SEND : SwapSendView.DETAIL;
    this.setState({ view });
  };

  handleSwitchSlipProtection = () => {
    this.setState(prevState => ({
      slipProtection: !prevState.slipProtection,
    }));
  };

  handleChangeSource = (asset: string) => {
    const { info } = this.props;
    const { source, target }: Pair = getPair(info);
    const selectedToken = getTickerFormat(asset);

    if (source && target) {
      const URL =
        selectedToken === target
          ? `/swap/${selectedToken}-${source}`
          : `/swap/${selectedToken}-${target}`;
      this.props.history.push(URL);
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `Could not parse target / source pair: ${target} / ${source}`,
      );
    }
  };

  handleSelectTarget = (asset: string) => {
    const { info } = this.props;
    const { source, target }: Pair = getPair(info);
    const selectedToken = getTickerFormat(asset);

    if (source && target) {
      const URL =
        source === selectedToken
          ? `/swap/${target}-${selectedToken}`
          : `/swap/${source}-${selectedToken}`;
      this.props.history.push(URL);
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `Could not parse target / source pair: ${target} / ${source}`,
      );
    }
  };

  handleReversePair = () => {
    const { info, assetData } = this.props;
    const { source, target }: Pair = getPair(info);

    if (!assetData.find(data => getTickerFormat(data.asset) === target)) {
      notification.warning({
        message: 'Cannot Reverse Swap Direction',
        description: 'Token does not exist in your wallet.',
        getContainer: getAppContainer,
      });
      return;
    }
    if (source && target) {
      this.setState({
        xValue: tokenAmount(0),
      });
      const URL = `/swap/${target}-${source}`;
      this.props.history.push(URL);
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `Could not parse target / source pair: ${target} / ${source}`,
      );
    }
  };

  validatePair = (
    sourceInfo: AssetData[],
    targetInfo: AssetPair[],
    pair: Pair,
  ) => {
    if (!targetInfo.length) {
      this.props.history.push('/pools');
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
        countTxTimerValue(0.75);
      }
    }
  };

  handleEndTxTimer = () => {
    const { setTxTimerStatus } = this.props;
    setTxTimerStatus(false);
    this.setState({
      dragReset: true,
      timerFinished: true,
    });
  };

  handleConfirmSwap = async () => {
    const { user, info, setTxHash, resetTxStatus } = this.props;
    const { xValue, address, slipProtection } = this.state;
    const { source = '', target = '' }: Pair = getPair(info);
    const calcResult = this.calcResult();
    if (user && source && target && calcResult) {
      let tokenAmountToSwap = xValue;
      const fee = this.bnbFeeAmount() || baseAmount(0);
      // fee transformation: BaseAmount -> TokenAmount -> BigNumber
      const feeAsTokenAmount = baseToToken(fee).amount();
      // Special case: Substract fee from BNB amount before sending it
      // Note: All validation for that already happened in `handleEndDrag`
      if (this.considerBnb()) {
        const amountToSwap = tokenAmountToSwap.amount().minus(feeAsTokenAmount);
        tokenAmountToSwap = tokenAmount(amountToSwap);
      }

      this.setState({
        txResult: null,
      });

      this.handleStartTimer();
      const bncClient = await binanceClient(BINANCE_NET);
      try {
        const data = await confirmSwap(
          bncClient,
          user.wallet,
          source,
          target,
          calcResult,
          tokenAmountToSwap,
          slipProtection,
          address,
        );

        const result = data?.result ?? [];
        const hash = result[0]?.hash;
        if (hash) {
          setTxHash(hash);
        }
      } catch (error) {
        notification.error({
          message: 'Swap Invalid',
          description: `Swap information is not valid: ${error.toString()}`,
        });
        this.setState({
          dragReset: true,
        });
        resetTxStatus();
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  handleSelectSourceAmount = (source: string, amount: number) => {
    const { assetData } = this.props;

    const sourceAsset = getAssetFromAssetData(assetData, source);

    if (!sourceAsset) {
      return;
    }

    const totalAmount = sourceAsset.assetValue.amount() ?? bn(0);
    // formula (totalAmount * amount) / 100
    const xValueBN = totalAmount.multipliedBy(amount).div(100);
    this.setState({
      xValue: tokenAmount(xValueBN),
    });
  };

  handleCompleted = () => {
    const {
      resetTxStatus,
      refreshBalance,
      user,
    } = this.props;
    this.setState({
      xValue: tokenAmount(0),
      timerFinished: false,
    });
    resetTxStatus();

    const wallet = user?.wallet;
    if (wallet) {
      console.log('refresh balance');
      refreshBalance(wallet);
    }
  };

  handleClickFinish = () => {
    this.handleCompleted();
  };

  renderSwapModalContent = (
    swapSource: string,
    swapTarget: string,
    calcResult: CalcResult,
  ) => {
    const {
      txStatus: { status, value, startTime, hash },
      basePriceAsset,
      priceIndex,
    } = this.props;
    const { xValue, txResult } = this.state;

    const { slip, outputAmount } = calcResult;

    const Px = validBNOrZero(priceIndex[swapSource.toUpperCase()]);
    const tokenPrice = validBNOrZero(priceIndex[swapTarget.toUpperCase()]);

    const priceFrom: BigNumber = Px.multipliedBy(xValue.amount());
    const slipAmount = slip;

    const refunded = txResult?.type === 'refund' ?? false;
    const amountBN = bnOrZero(txResult?.amount);
    const assetAmount = txResult ? tokenAmount(amountBN) : outputAmount;

    let priceTo;
    if (refunded) {
      priceTo = priceFrom;
    } else {
      priceTo = txResult
        ? amountBN.multipliedBy(tokenPrice)
        : outputAmount.amount().multipliedBy(tokenPrice);
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
              maxSec={45}
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
                asset={swapTarget}
                assetValue={assetAmount}
                price={priceTo}
                priceUnit={basePriceAsset}
              />
            </div>
          </div>
        </Row>
        <Row className="swap-info-wrapper">
          <Trend amount={slipAmount} />
          {hash && (
            <div className="hash-address">
              <div className="copy-btn-wrapper">
                {this.isCompleted() && (
                  <Button
                    className="view-btn"
                    color="success"
                    onClick={this.handleClickFinish}
                  >
                    FINISH
                  </Button>
                )}
                <a
                  className="view-tx"
                  href={txURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VIEW TRANSACTION
                </a>
              </div>
            </div>
          )}
        </Row>
      </SwapModalContent>
    );
  };

  validateSlip = (slip: BigNumber) => {
    const { maxSlip } = this.state;

    if (slip.isGreaterThanOrEqualTo(maxSlip)) {
      notification.error({
        message: 'Swap Invalid',
        description: `Slip ${slip.toFormat(
          2,
          BigNumber.ROUND_DOWN,
        )}% is too high, try less than ${maxSlip}%.`,
        getContainer: getAppContainer,
      });
      this.setState({
        dragReset: true,
      });
      return false;
    }
    return true;
  };

  getPopupContainer = () => {
    return document.getElementsByClassName('slip-protection')[0] as HTMLElement;
  };

  renderProtectPopoverContent = () => {
    return <PopoverContent>Protect my price (within 3%)</PopoverContent>;
  };

  /**
   * Check to consider special cases for BNB
   */
  considerBnb = (): boolean => {
    const { info } = this.props;
    const { source }: Pair = getPair(info);
    return source?.toUpperCase() === 'BNB';
  };

  /**
   * Check whether to substract BNB fee from entered BNB amount
   */
  subtractBnbFee = (): boolean => {
    if (this.considerBnb()) {
      const { xValue } = this.state;
      const { assetData } = this.props;
      // (1) BNB amount in wallet
      const bnbInWallet = bnbBaseAmount(assetData) || baseAmount(0);
      // (2) BNB amount entered in input
      const bnbEntered = tokenToBase(xValue);
      // difference (1) - (2) as BigNumber
      const bnbDiff = bnbInWallet.amount().minus(bnbEntered.amount());
      const fee = this.bnbFeeAmount();
      return (
        !!fee && bnbDiff.isGreaterThan(0) && bnbDiff.isLessThan(fee.amount())
      );
    }

    return false;
  };

  /**
   * Check to ensure THORChain transactionFee (currently 1 RUNE)
   * https://gitlab.com/thorchain/thornode/-/blob/master/constants/constants.go#L42
   * @todo get current transactionFee from thornode constants endpoint eg :1317/thorchain/constants
   */
  runeFeeIsNotCovered = (amount: BigNumber): boolean => {
    const { info, priceIndex } = this.props;
    const { source }: Pair = getPair(info);
    if (!source) return true;

    const runePrice = priceIndex.RUNE;
    return bn(priceIndex[source.toUpperCase()])
      .dividedBy(runePrice)
      .multipliedBy(amount)
      .isLessThanOrEqualTo(1);
  };

  /**
   * BNB fee in BaseAmount
   * Returns Nothing if fee is not available
   */
  bnbFeeAmount = (): Maybe<BaseAmount> => {
    const { transferFees } = this.props;
    const fees = RD.toNullable(transferFees);
    return fees?.single;
  };

  /**
   * Checks whether fee is covered by amounts of BNB in users wallet
   */
  bnbFeeIsNotCovered = (): boolean => {
    const { assetData } = this.props;
    const bnbAmount = bnbBaseAmount(assetData);
    const fee = this.bnbFeeAmount();
    return !!bnbAmount && !!fee && bnbAmount.amount().isLessThan(fee.amount());
  };

  /**
   * Renders fee
   */
  renderFee = () => {
    const { transferFees, assetData } = this.props;
    const bnbAmount = bnbBaseAmount(assetData);

    // Helper to format BNB amounts properly (we can't use `formatTokenAmountCurrency`)
    // TODO (@Veado) Update `formatTokenAmountCurrency` of `asgardex-token` (now in `asgardex-util`) to accept decimals
    const formatBnbAmount = (value: BaseAmount) => {
      const token = baseToToken(value);
      return `${token.amount().toString()} BNB + 1 RUNE`;
    };

    const txtLoading = <Text>Fee: ...</Text>;
    return (
      <FeeParagraph>
        {RD.fold(
          () => txtLoading,
          () => txtLoading,
          (_: Error) => <Text>Error: Fee could not be loaded</Text>,
          (fees: TransferFees) => (
            <>
              <Text>Fee: {formatBnbAmount(fees.single)}</Text>
              {this.subtractBnbFee() && (
                <Text>
                  {' '}
                  (It will be substructed from your entered BNB value)
                </Text>
              )}
              {bnbAmount && this.bnbFeeIsNotCovered() && (
                <>
                  <br />
                  <Text type="danger" style={{ paddingTop: '10px' }}>
                    You have {formatBnbAmount(bnbAmount)} in your wallet,
                    that&lsquo;s not enought to cover the fee for this
                    transaction.
                  </Text>
                </>
              )}
            </>
          ),
        )(transferFees)}
      </FeeParagraph>
    );
  };

  render() {
    const {
      info,
      txStatus,
      poolData,
      pools,
      assetData,
      priceIndex,
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
      view,
    } = this.state;

    const swapPair: Pair = getPair(info);

    if (
      !swapPair.source ||
      !swapPair.target ||
      !Object.keys(poolData).length ||
      !isValidSwap(swapPair, pools)
    ) {
      this.props.history.push('/pools'); // redirect to pool view if swap is invalid
      return '';
    }

    const { source: swapSource, target: swapTarget } = swapPair;

    const tokensData: TokenData[] = Object.keys(poolData).reduce(
      (result: TokenData[], tokenName: string) => {
        const tokenData = poolData[tokenName];
        const assetStr = tokenData?.asset;
        const asset = assetStr ? getAssetFromString(assetStr) : null;
        const price = bnOrZero(tokenData?.price);

        if (
          tokenData.status &&
          tokenData.status === PoolDetailStatusEnum.Enabled
        ) {
          result.push({
            asset: asset?.symbol ?? '',
            price,
          });
        }
        return result;
      },
      [],
    );

    const runePrice = validBNOrZero(priceIndex?.RUNE);

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

    const calcResult = this.calcResult();
    if (!calcResult) {
      // ^ It should never be happen in theory, but who knows...
      // Todo(veado): Should we display an error message in this case?
      return <></>;
    } else {
      const { slip, outputAmount, outputPrice } = calcResult;
      const sourcePriceBN = bn(priceIndex[swapSource.toUpperCase()]);
      const sourcePrice = isValidBN(sourcePriceBN)
        ? sourcePriceBN
        : outputPrice;
      const targetPriceBN = bn(priceIndex[swapTarget.toUpperCase()]);
      const targetPrice = isValidBN(targetPriceBN)
        ? targetPriceBN
        : outputPrice;

      const ratio = !targetPrice.isEqualTo(bn(0))
        ? sourcePrice.div(targetPrice)
        : bn(0);
      const ratioLabel = `1 ${swapSource.toUpperCase()} = ${ratio.toFixed(
        3,
      )} ${swapTarget.toUpperCase()}`;

      // swap modal
      const refunded = txResult && txResult.type === 'refund';

      // eslint-disable-next-line no-nested-ternary
      const swapTitle = !this.isCompleted()
        ? 'YOU ARE SWAPPING'
        : refunded
        ? 'TOKEN REFUNDED'
        : 'YOU SWAPPED';

      const disableDrag = this.bnbFeeIsNotCovered();

      const slipValue = slip
        ? `SLIP ${slip.toFormat(2, BigNumber.ROUND_DOWN)}%`
        : Nothing;

      return (
        <ContentWrapper className="swap-detail-wrapper">
          <SwapAssetCard>
            <ContentTitle>
              swapping {swapSource} &gt;&gt; {swapTarget}
            </ContentTitle>
            <div className="swap-content">
              <div className="swap-detail-panel">
                <TokenCard
                  inputTitle="input"
                  asset={swapSource}
                  assetData={sourceData}
                  amount={xValue}
                  price={sourcePrice}
                  priceIndex={priceIndex}
                  onChange={this.handleChangeValue}
                  onChangeAsset={this.handleChangeSource}
                  onSelect={(amount: number) =>
                    this.handleSelectSourceAmount(swapSource, amount)}
                  inputProps={{ 'data-test': 'coincard-source-input' }}
                  withSearch
                  data-test="coincard-source"
                />
                <SliderSwapWrapper>
                  <div className="slider">
                    <Slider
                      value={percent}
                      onChange={this.handleChangePercent}
                      withLabel
                    />
                  </div>
                  <div className="swap-wrapper">
                    <SwapOutlined
                      className="swap-outlined"
                      onClick={this.handleReversePair}
                    />
                  </div>
                </SliderSwapWrapper>
                <TokenCard
                  inputTitle="output"
                  inputProps={{
                    disabled: true,
                    'data-test': 'coincard-target-input',
                  }}
                  asset={swapTarget}
                  assetData={targetData}
                  amount={outputAmount}
                  price={targetPrice}
                  priceIndex={priceIndex}
                  onChangeAsset={this.handleSelectTarget}
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
                      <PopoverContainer
                        content={this.renderProtectPopoverContent()}
                        getPopupContainer={this.getPopupContainer}
                        placement="left"
                        visible
                        overlayClassName="protectPrice-popover"
                        overlayStyle={{
                          padding: '6px',
                          animationDuration: '0s !important',
                          animation: 'none !important',
                        }}
                      >
                        <div>
                          <Button
                            onClick={this.handleSwitchSlipProtection}
                            sizevalue="small"
                            typevalue="outline"
                            focused={slipProtection}
                          >
                            {slipProtection ? (
                              <LockOutlined />
                            ) : (
                              <UnlockOutlined />
                            )}
                          </Button>
                        </div>
                      </PopoverContainer>
                    </CardForm>
                  </CardFormHolder>
                </div>
              </div>
              <div className="desktop-view">
                <SwapStatusPanel>
                  <StepBar size={170} />
                  <div className="slip-ratio-labels">
                    <Label>{ratioLabel}</Label>
                    <Label>{slipValue}</Label>
                  </div>
                </SwapStatusPanel>
              </div>
            </div>
            <div className="drag-confirm-wrapper">
              <Drag
                title={dragTitle}
                source={swapSource}
                target={swapTarget}
                reset={dragReset}
                disabled={disableDrag}
                onConfirm={this.handleEndDrag}
                onDrag={this.handleDrag}
              />
            </div>
            {this.renderFee()}
          </SwapAssetCard>

          <SwapModal
            title={swapTitle}
            visible={openSwapModal}
            footer={null}
            onCancel={this.handleCloseModal}
          >
            {this.renderSwapModalContent(swapSource, swapTarget, calcResult)}
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
            <Label>Please add a wallet to swap tokens.</Label>
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
      poolData: state.Midgard.poolData,
      pools: state.Midgard.pools,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      transferFees: state.Binance.transferFees,
      wsTransferEvent: state.Binance.wsTransferEvent,
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
      getBinanceFees: binanceActions.getBinanceFees,
      subscribeBinanceTransfers: binanceActions.subscribeBinanceTransfers,
      unSubscribeBinanceTransfers: binanceActions.unSubscribeBinanceTransfers,
    },
  ),
  withRouter,
)(SwapSend) as React.ComponentClass<ComponentProps, State>;
