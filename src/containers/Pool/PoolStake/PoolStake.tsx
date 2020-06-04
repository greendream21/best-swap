import React from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, notification, Popover } from 'antd';
import {
  InboxOutlined,
  InfoOutlined,
  FullscreenExitOutlined,
  CloseOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { SliderValue } from 'antd/lib/slider';
import { crypto } from '@binance-chain/javascript-sdk';
import { get as _get } from 'lodash';

import BigNumber from 'bignumber.js';
import * as RD from '@devexperts/remote-data-ts';
import {
  client as binanceClient,
  getPrefix,
} from '@thorchain/asgardex-binance';
import {
  bn,
  validBNOrZero,
  delay,
  bnOrZero,
  formatBN,
} from '@thorchain/asgardex-util';
import {
  TokenAmount,
  BaseAmount,
  tokenAmount,
  formatBaseAsTokenAmount,
  baseAmount,
  baseToToken,
  tokenToBase,
} from '@thorchain/asgardex-token';
import Text from 'antd/lib/typography/Text';
import { getAppContainer } from '../../../helpers/elementHelper';

import Label from '../../../components/uielements/label';
import Status from '../../../components/uielements/status';
import CoinCard from '../../../components/uielements/coins/coinCard';
import CoinData from '../../../components/uielements/coins/coinData';
import Slider from '../../../components/uielements/slider';
import TxTimer from '../../../components/uielements/txTimer';
import Drag from '../../../components/uielements/drag';
import Modal from '../../../components/uielements/modal';
import Button from '../../../components/uielements/button';
import AddWallet from '../../../components/uielements/addWallet';
import PrivateModal from '../../../components/modals/privateModal';

import * as appActions from '../../../redux/app/actions';
import * as midgardActions from '../../../redux/midgard/actions';
import * as walletActions from '../../../redux/wallet/actions';
import * as binanceActions from '../../../redux/binance/actions';

import {
  ContentWrapper,
  Tabs,
  ConfirmModal,
  ConfirmModalContent,
  PopoverContent,
  PopoverContainer,
  FeeParagraph,
} from './PoolStake.style';
import {
  WithdrawResultParams,
  confirmStake,
  confirmWithdraw,
  getCalcResult,
  CalcResult,
  getPoolData,
  withdrawResult,
} from '../utils';
import { PoolData } from '../types';
import { getTickerFormat, emptyString } from '../../../helpers/stringHelper';
import { TESTNET_TX_BASE_URL } from '../../../helpers/apiHelper';
import TokenInfo from '../../../components/uielements/tokens/tokenInfo';
import StepBar from '../../../components/uielements/stepBar';
import { MAX_VALUE } from '../../../redux/app/const';
import { RootState } from '../../../redux/store';
import { User, AssetData } from '../../../redux/wallet/types';
import { FixmeType, Maybe, Nothing, AssetPair } from '../../../types/bepswap';
import { TxStatus, TxTypes } from '../../../redux/app/types';
import {
  AssetDetailMap,
  StakerPoolData,
  PoolDataMap,
  PriceDataIndex,
} from '../../../redux/midgard/types';
import { StakersAssetData } from '../../../types/generated/midgard';
import { getAssetFromString } from '../../../redux/midgard/utils';
import { BINANCE_NET, getNet } from '../../../env';
import {
  TransferEventRD,
  TransferFeesRD,
  TransferFees,
} from '../../../redux/binance/types';
import {
  getAssetFromAssetData,
  bnbBaseAmount,
} from '../../../helpers/walletHelper';

const { TabPane } = Tabs;

enum ShareDetailTabKeys {
  ADD = 'add',
  WITHDRAW = 'withdraw',
}

type ComponentProps = {
  symbol: string;
  info: FixmeType; // PropTypes.object,
  history: H.History;
  wsTransfers: FixmeType[]; // PropTypes.array.isRequired,
};

type ConnectedProps = {
  history: H.History;
  txStatus: TxStatus;
  user: Maybe<User>;
  wsTransferEvent: TransferEventRD;
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
  getPools: typeof midgardActions.getPools;
  getPoolAddress: typeof midgardActions.getPoolAddress;
  getStakerPoolData: typeof midgardActions.getStakerPoolData;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxTimerStatus: typeof appActions.setTxTimerStatus;
  countTxTimerValue: typeof appActions.countTxTimerValue;
  setTxTimerValue: typeof appActions.setTxTimerValue;
  setTxHash: typeof appActions.setTxHash;
  resetTxStatus: typeof appActions.resetTxStatus;
  refreshStakes: typeof walletActions.refreshStakes;
  getBinanceFees: typeof binanceActions.getBinanceFees;
  transferFees: TransferFeesRD;
  subscribeBinanceTransfers: typeof binanceActions.subscribeBinanceTransfers;
  unSubscribeBinanceTransfers: typeof binanceActions.unSubscribeBinanceTransfers;
};

type Props = ComponentProps & ConnectedProps;

type State = {
  dragReset: boolean;
  openWalletAlert: boolean;
  openPrivateModal: boolean;
  password: string;
  invalidPassword: boolean;
  validatingPassword: boolean;
  runeAmount: TokenAmount;
  tokenAmount: TokenAmount;
  fR: number;
  fT: number;
  runeTotal: BigNumber;
  tokenTotal: BigNumber;
  runePercent: number;
  tokenPercent: number;
  txResult: boolean;
  widthdrawPercentage: number;
  selectRatio: boolean;
  selectedShareDetailTab: ShareDetailTabKeys;
};

type StakeData = {
  fromAddr: string;
  toAddr: string;
  toToken: string;
  runeAmount: BigNumber;
  tokenAmount: BigNumber;
};

type WithdrawData = {
  runeValue: BaseAmount;
  tokenValue: BaseAmount;
  tokenPrice: BigNumber;
  percentage: number;
};

class PoolStake extends React.Component<Props, State> {
  hash: Maybe<string> = Nothing;

  type: Maybe<TxTypes> = Nothing;

  stakeData: Maybe<StakeData> = Nothing;

  withdrawData: Maybe<WithdrawData> = Nothing;

  constructor(props: Props) {
    super(props);
    this.state = {
      dragReset: true,
      openWalletAlert: false,
      openPrivateModal: false,
      password: emptyString,
      invalidPassword: false,
      validatingPassword: false,
      runeAmount: tokenAmount(0),
      tokenAmount: tokenAmount(0),
      fR: 1,
      fT: 1,
      runeTotal: bn(0),
      tokenTotal: bn(0),
      runePercent: 0,
      tokenPercent: 0,
      txResult: false,
      widthdrawPercentage: 0,
      selectRatio: false,
      selectedShareDetailTab: ShareDetailTabKeys.ADD,
    };
  }

  componentDidMount() {
    const {
      getPoolAddress,
      getPools,
      getBinanceFees,
      transferFees,
      user,
      subscribeBinanceTransfers,
    } = this.props;

    getPoolAddress();
    getPools();
    const net = getNet();
    if (RD.isInitial(transferFees)) {
      getBinanceFees(net);
    }
    this.getStakerInfo();
    const wallet = user?.wallet;
    if (wallet) {
      subscribeBinanceTransfers({ address: wallet, net });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      wsTransferEvent,
      user,
      txStatus: { type, hash },
      refreshStakes,
      symbol,
      subscribeBinanceTransfers,
      unSubscribeBinanceTransfers,
    } = this.props;

    const { txResult } = this.state;

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

    if (prevProps.symbol !== symbol) {
      // stakerPoolData needs to be updated
      this.getStakerInfo();
    }

    const currentWsTransferEvent = RD.toNullable(wsTransferEvent);
    const prevWsTransferEvent = RD.toNullable(prevProps?.wsTransferEvent);

    if (
      currentWsTransferEvent &&
      currentWsTransferEvent !== prevWsTransferEvent &&
      hash !== undefined &&
      !txResult
    ) {
      if (wallet) {
        // TODO(Veado) `getHashFromTransfer` needs to be fixed
        // see https://gitlab.com/thorchain/bepswap/asgardex-common/-/issues/6
        // const transferHash = getHashFromTransfer(currentWsTransferEvent);
        // At the meantime we can get hash as following
        const transferHash = currentWsTransferEvent?.data?.H;

        // Currently we do a different handling for `stake` + `withdraw`
        // See https://thorchain.slack.com/archives/CL5B4M4BC/p1579816500171200
        if (type === TxTypes.STAKE) {
          if (transferHash === hash) {
            // Just refresh stakes after update
            refreshStakes(wallet);
          }
        }

        if (type === TxTypes.WITHDRAW) {
          const txResult = withdrawResult({
            tx: currentWsTransferEvent,
            symbol,
            address: wallet,
          } as WithdrawResultParams);

          if (txResult) {
            this.setState({
              txResult: true,
            });
            // refresh stakes after update
            refreshStakes(wallet);
          }
        }
      }
    }
  }

  componentWillUnmount() {
    const { resetTxStatus, unSubscribeBinanceTransfers } = this.props;
    resetTxStatus();
    unSubscribeBinanceTransfers();
  }

  getStakerInfo = () => {
    const { getStakerPoolData, symbol, user } = this.props;
    if (user) {
      getStakerPoolData({ asset: symbol, address: user.wallet });
    }
  };

  isLoading = () => {
    const { poolLoading, stakerPoolDataLoading } = this.props;

    return poolLoading && stakerPoolDataLoading;
  };

  handleChangePassword = (password: string) => {
    this.setState({
      password,
      invalidPassword: false,
    });
  };

  /**
   * Handler for setting token amounts in input fields
   */
  handleChangeTokenAmount = (tokenName: string) => (value: BigNumber) => {
    const { assetData, symbol } = this.props;
    const { fR, fT, selectRatio } = this.state;

    const sourceAsset = getAssetFromAssetData(
      assetData,
      tokenName.toLowerCase(),
    );
    const targetToken = assetData.find(data => {
      const { asset } = data;
      if (asset.toLowerCase() === symbol.toLowerCase()) {
        return true;
      }
      return false;
    });

    if (!sourceAsset || !targetToken) {
      return;
    }

    const balance = tokenName === 'rune' ? fR : fT;

    // formula: sourceAsset.assetValue * balance
    const totalAmount = sourceAsset.assetValue.amount().multipliedBy(balance);
    // formula: targetToken.assetValue * balance
    const totalTokenAmount = targetToken.assetValue
      .amount()
      .multipliedBy(balance);
    const valueAsToken = tokenAmount(value);

    if (!selectRatio) {
      if (tokenName === 'rune') {
        this.setState({
          runeAmount: valueAsToken,
        });
      } else if (tokenName !== 'rune') {
        this.setState({
          tokenAmount: valueAsToken,
        });
      }
      return;
    }
    if (tokenName === 'rune') {
      const data = this.getData();
      const ratio = data?.ratio ?? 1;
      // formula: newValue * ratio
      const tokenValue = valueAsToken.amount().multipliedBy(ratio);
      const tokenAmountBN = tokenValue.isLessThanOrEqualTo(totalTokenAmount)
        ? tokenValue
        : totalTokenAmount;

      if (totalAmount.isLessThan(valueAsToken.amount())) {
        this.setState({
          runeAmount: tokenAmount(totalAmount),
          tokenAmount: tokenAmount(tokenAmountBN),
          runePercent: 100,
        });
      } else {
        this.setState({
          runeAmount: valueAsToken,
          tokenAmount: tokenAmount(tokenAmountBN),
        });
      }
    } else if (tokenName !== 'rune') {
      const data = this.getData();
      const ratio = data?.ratio ?? 1;
      // formula: newValue / ratio
      const tokenValue = valueAsToken.amount().dividedBy(ratio);

      console.log('here');
      if (totalAmount.isLessThan(valueAsToken.amount())) {
        this.setState({
          runeAmount: tokenAmount(tokenValue),
          tokenAmount: tokenAmount(totalAmount),
        });
      } else {
        this.setState({
          runeAmount: tokenAmount(tokenValue),
          tokenAmount: valueAsToken,
        });
      }
    } else {
      this.setState({
        tokenAmount: valueAsToken,
      });
    }
  };

  /**
   * Handler for moving percent slider
   *
   * Note: Don't consider any fees in this function, since it sets values for tokenAmount,
   * which triggers `handleChangeTokenAmount` where all calculations for fees are happen
   */
  handleChangePercent = (tokenName: string) => (amount: number) => {
    const { assetData, symbol } = this.props;
    const { fR, fT } = this.state;

    const selectedToken = getAssetFromAssetData(assetData, tokenName);
    const targetToken = getAssetFromAssetData(assetData, symbol);
    if (!selectedToken || !targetToken) {
      return;
    }

    const balance = tokenName === 'rune' ? fR : fT;
    const totalAmount = selectedToken.assetValue.amount();
    const totalTokenAmount = targetToken.assetValue.amount();
    // formula: (totalAmount * amount) / 100) * balance
    const value = totalAmount
      .multipliedBy(amount)
      .div(100)
      .multipliedBy(balance);

    if (tokenName === 'rune') {
      const data = this.getData();
      const ratio = data?.ratio ?? 1;
      // formula: value * ratio);
      const tokenValue = value.multipliedBy(ratio);
      const tokenAmountBN = tokenValue.isLessThanOrEqualTo(totalTokenAmount)
        ? tokenValue
        : totalTokenAmount;

      this.setState({
        runeAmount: tokenAmount(value),
        tokenAmount: tokenAmount(tokenAmountBN),
        runePercent: amount,
        runeTotal: totalAmount,
      });
    } else {
      this.setState({
        tokenAmount: tokenAmount(value),
        tokenPercent: amount,
        tokenTotal: totalAmount,
      });
    }
  };

  /**
   * `handleChangeBalance` is not used currently
   */
  handleChangeBalance = (balance: number) => {
    const { runePercent, tokenPercent, runeTotal, tokenTotal } = this.state;
    const fR = balance <= 100 ? 1 : (200 - balance) / 100;
    const fT = balance >= 100 ? 1 : balance / 100;

    if (runePercent > 0) {
      // formula: ((runeTotal * runePercent) / 100) * fR;
      const runeAmountBN = runeTotal
        .multipliedBy(runePercent)
        .div(100)
        .multipliedBy(fR);
      const runeAmount = tokenAmount(runeAmountBN);
      this.setState({
        runeAmount,
      });
    }
    if (tokenPercent > 0) {
      // formula:  ((tokenTotal * tokenPercent) / 100) * fT
      const tokenAmountBN = tokenTotal
        .multipliedBy(tokenPercent)
        .div(100)
        .multipliedBy(fT);

      this.setState({
        tokenAmount: tokenAmount(tokenAmountBN),
      });
    }
    this.setState({
      fR,
      fT,
    });
  };

  handleDrag = () => {
    this.setState({
      dragReset: false,
    });
  };

  getData = (): CalcResult => {
    const { symbol, poolData, priceIndex, poolAddress } = this.props;
    const { runeAmount, tokenAmount } = this.state;
    const runePrice = validBNOrZero(priceIndex?.RUNE);

    const calcResult = getCalcResult(
      symbol,
      poolData,
      poolAddress,
      runeAmount,
      runePrice,
      tokenAmount,
    );

    return calcResult;
  };

  handleConfirmStake = async () => {
    const { user, setTxHash } = this.props;
    const { runeAmount, tokenAmount: tokenAmountToStake } = this.state;

    if (user) {
      const { wallet } = user;
      let newTokenAmountToStake = tokenAmountToStake;
      // fee transformation: BaseAmount -> TokenAmount -> BigNumber
      const fee = this.bnbFeeAmount() || baseAmount(0);
      const feeAsTokenAmount = baseToToken(fee).amount();
      // Special case: Substract fee from BNB amount to cover fees
      if (this.subtractBnbFee()) {
        const amountToStake = tokenAmountToStake
          .amount()
          .minus(feeAsTokenAmount);
        newTokenAmountToStake = tokenAmount(amountToStake);
      }

      this.handleStartTimer(TxTypes.STAKE);

      this.setState({
        txResult: false,
      });

      const data = this.getData();
      const bncClient = await binanceClient(BINANCE_NET);

      try {
        const { result } = await confirmStake({
          bncClient,
          wallet,
          runeAmount,
          tokenAmount: newTokenAmountToStake,
          poolAddress: data.poolAddress,
          symbolTo: data.symbolTo,
        });
        const hash = result ? result[0]?.hash ?? null : null;
        if (hash) {
          setTxHash(hash);
        }
      } catch (error) {
        notification.error({
          message: 'Stake Invalid',
          description: `${error?.toString() ??
            'Stake information is not valid.'}`,
          getContainer: getAppContainer,
        });
        this.handleCloseModal();
        this.setState({
          dragReset: true,
        });
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  /**
   * Handler to run first validation of data before staking
   */
  handleStake = () => {
    const { user } = this.props;
    const { runeAmount, tokenAmount } = this.state;
    const wallet = user ? user.wallet : null;
    const keystore = user ? user.keystore : null;

    // Validata existing wallet
    if (!wallet) {
      this.setState({
        openWalletAlert: true,
      });
      return;
    }

    // Validate amounts to stake
    if (
      runeAmount.amount().isLessThanOrEqualTo(0) &&
      tokenAmount.amount().isLessThanOrEqualTo(0)
    ) {
      notification.error({
        message: 'Stake Invalid',
        description: 'You need to enter an amount to stake.',
        getContainer: getAppContainer,
      });
      this.handleCloseModal();
      this.setState({
        dragReset: true,
      });
      return;
    }

    // Validate BNB amount to swap to consider fees
    // to substract fee from amount before sending it
    if (this.considerBnbFee()) {
      const fee = this.bnbFeeAmount() || baseAmount(0);
      // fee transformation: BaseAmount -> TokenAmount -> BigNumber
      const feeAsTokenAmount = baseToToken(fee).amount();
      if (tokenAmount.amount().isLessThanOrEqualTo(feeAsTokenAmount)) {
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

    // Validate keystore
    if (keystore) {
      this.type = TxTypes.STAKE;
      this.handleOpenPrivateModal();
      return;
    }

    this.handleConfirmStake();
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

  handleStartTimer = (type: TxTypes) => {
    const { resetTxStatus } = this.props;
    resetTxStatus({
      type,
      modal: true,
      status: true,
      startTime: Date.now(),
    });
  };

  handleConfirmPassword = async () => {
    const { user } = this.props;
    const { password } = this.state;

    if (user) {
      const { keystore, wallet } = user;

      this.setState({ validatingPassword: true });
      // Short delay to render latest state changes of `validatingPassword`
      await delay(2000);

      try {
        const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
        const bncClient = await binanceClient(BINANCE_NET);
        await bncClient.setPrivateKey(privateKey);
        const address = crypto.getAddressFromPrivateKey(
          privateKey,
          getPrefix(BINANCE_NET),
        );
        if (wallet && wallet === address) {
          if (this.type === TxTypes.STAKE) {
            this.handleConfirmStake();
          } else if (this.type === TxTypes.WITHDRAW) {
            this.handleConfirmWithdraw();
          }
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

  handleCloseModal = () => {
    const { setTxTimerModal } = this.props;

    setTxTimerModal(false);

    this.handleEndTxTimer();
  };

  handleSelectTraget = (asset: string) => {
    const URL = `/pool/${asset}`;

    this.props.history.push(URL);
  };

  handleWithdraw = () => {
    const { user } = this.props;
    const wallet = user ? user.wallet : null;
    const keystore = user ? user.keystore : null;

    if (!wallet) {
      this.setState({
        openWalletAlert: true,
      });
      return;
    }

    if (keystore) {
      this.type = TxTypes.WITHDRAW;
      this.handleOpenPrivateModal();
    } else if (wallet) {
      this.handleConfirmWithdraw();
    }
  };

  handleConfirmWithdraw = async () => {
    const { symbol, poolAddress, user, setTxHash } = this.props;
    const { widthdrawPercentage } = this.state;
    const withdrawRate = (widthdrawPercentage || 50) / 100;

    if (user) {
      const { wallet } = user;

      this.handleStartTimer(TxTypes.WITHDRAW);

      this.setState({
        txResult: false,
      });

      const bncClient = await binanceClient(BINANCE_NET);

      try {
        const percent = withdrawRate * 100;
        const { result } = await confirmWithdraw({
          bncClient,
          wallet,
          poolAddress,
          symbol,
          percent,
        });

        const hash = result ? result[0]?.hash ?? null : null;
        if (hash) {
          setTxHash(hash);
        }
      } catch (error) {
        notification.error({
          message: 'Withdraw Invalid',
          description: 'Withdraw information is not valid.',
          getContainer: getAppContainer,
        });
        this.setState({
          dragReset: true,
        });
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  handleChangeTxValue = () => {
    const {
      countTxTimerValue,
      setTxTimerValue,
      txStatus: { value, type, hash },
    } = this.props;
    const { txResult } = this.state;

    // Count handling depends on `type`
    if (type === TxTypes.WITHDRAW) {
      // If tx has been confirmed finally,
      // then we jump to last `valueIndex` ...
      if (txResult && value < MAX_VALUE) {
        setTxTimerValue(MAX_VALUE);
      }
      // In other cases (no `txResult`) we don't jump to last `indexValue`...
      if (!txResult) {
        // ..., but we are still counting
        if (value < 75) {
          // Add a quarter
          countTxTimerValue(25);
        } else if (value >= 75 && value < 95) {
          // With last quarter we just count a little bit to signalize still a progress
          countTxTimerValue(1);
        }
      }
    }

    if (type === TxTypes.STAKE) {
      // If tx has been sent successfully,
      // we jump to last `valueIndex` ...
      if (hash && value < MAX_VALUE) {
        setTxTimerValue(MAX_VALUE);
      }
      // In other cases (no `hash`) we don't jump to last `indexValue`...
      if (!hash) {
        // ..., but we are still counting
        if (value < 75) {
          // Add a quarter
          countTxTimerValue(25);
        } else if (value >= 75 && value < 95) {
          // With last quarter we just count a little bit to signalize still a progress
          countTxTimerValue(1);
        }
      }
    }
  };

  handleEndTxTimer = () => {
    const { setTxTimerStatus } = this.props;
    setTxTimerStatus(false);
    this.setState({
      dragReset: true,
    });
    // get staker info again after finished
    this.getStakerInfo();
  };

  getPopupContainer = () => {
    return document.getElementsByClassName(
      'stake-ratio-select',
    )[0] as HTMLElement;
  };

  handleSwitchSelectRatio = () => {
    this.setState(prevState => ({
      selectRatio: !prevState.selectRatio,
    }));
  };

  renderStakeModalContent = (completed: boolean) => {
    const {
      txStatus: { status, value, startTime, hash },
      symbol,
      priceIndex,
      basePriceAsset,
    } = this.props;
    const { runeAmount, tokenAmount } = this.state;

    const source = 'rune';
    const target = getTickerFormat(symbol);

    const Pr = validBNOrZero(priceIndex?.RUNE);
    const tokenPrice = _get(priceIndex, target.toUpperCase(), 0);
    const txURL = TESTNET_TX_BASE_URL + hash;

    const sourcePrice = runeAmount.amount().multipliedBy(Pr);
    const targetPrice = tokenAmount.amount().multipliedBy(tokenPrice);

    return (
      <ConfirmModalContent>
        <Row className="modal-content">
          <div className="timer-container">
            <TxTimer
              status={status}
              value={value}
              maxValue={MAX_VALUE}
              startTime={startTime}
              onChange={this.handleChangeTxValue}
              onEnd={this.handleEndTxTimer}
            />
          </div>
          <div className="coin-data-wrapper">
            <StepBar size={50} />
            <div className="coin-data-container">
              <CoinData
                data-test="stakeconfirm-coin-data-source"
                asset={source}
                assetValue={runeAmount}
                price={sourcePrice}
                priceUnit={basePriceAsset}
              />
              <CoinData
                data-test="stakeconfirm-coin-data-target"
                asset={target}
                assetValue={tokenAmount}
                price={targetPrice}
                priceUnit={basePriceAsset}
              />
            </div>
          </div>
        </Row>
        <Row className="modal-info-wrapper">
          {completed && (
            <div className="hash-address">
              <div className="copy-btn-wrapper">
                <Link to="/pools">
                  <Button className="view-btn" color="success">
                    FINISH
                  </Button>
                </Link>
                <a href={txURL} target="_blank" rel="noopener noreferrer">
                  VIEW TRANSACTION
                </a>
              </div>
            </div>
          )}
        </Row>
      </ConfirmModalContent>
    );
  };

  renderWithdrawModalContent = (txSent: boolean, completed: boolean) => {
    const {
      txStatus: { status, value, startTime, hash },
      symbol,
      priceIndex,
      basePriceAsset,
    } = this.props;

    const source = 'rune';
    const target = getTickerFormat(symbol);

    const runePrice = validBNOrZero(priceIndex?.RUNE);
    const tokenPrice = validBNOrZero(priceIndex[target.toUpperCase()]);
    const txURL = TESTNET_TX_BASE_URL + hash;

    if (!this.withdrawData) {
      // Avoid to render anything if we don't have needed data for calculation
      return <></>;
    } else {
      const { runeValue, tokenValue } = this.withdrawData;

      const sourceTokenAmount = baseToToken(runeValue);
      const sourcePrice = sourceTokenAmount.amount().multipliedBy(runePrice);
      const targetTokenAmount = baseToToken(tokenValue);
      const targetPrice = targetTokenAmount.amount().multipliedBy(tokenPrice);
      return (
        <ConfirmModalContent>
          <Row className="modal-content">
            <div className="timer-container">
              <TxTimer
                status={status}
                value={value}
                maxValue={MAX_VALUE}
                startTime={startTime}
                onChange={this.handleChangeTxValue}
                onEnd={this.handleEndTxTimer}
              />
            </div>
            <div className="coin-data-wrapper">
              <StepBar size={50} />
              <div className="coin-data-container">
                <CoinData
                  asset={source}
                  assetValue={sourceTokenAmount}
                  price={sourcePrice}
                  priceUnit={basePriceAsset}
                />
                <CoinData
                  asset={target}
                  assetValue={targetTokenAmount}
                  price={targetPrice}
                  priceUnit={basePriceAsset}
                />
              </div>
            </div>
          </Row>
          <Row className="modal-info-wrapper">
            {txSent && (
              <div className="hash-address">
                <div className="copy-btn-wrapper">
                  {completed && (
                    <Link to="/pools">
                      <Button className="view-btn" color="success">
                        FINISH
                      </Button>
                    </Link>
                  )}
                  <a href={txURL} target="_blank" rel="noopener noreferrer">
                    VIEW TRANSACTION
                  </a>
                </div>
              </div>
            )}
          </Row>
        </ConfirmModalContent>
      );
    }
  };

  renderStakeInfo = (poolStats: PoolData) => {
    const { symbol, basePriceAsset } = this.props;
    const source = 'rune';
    const target = getTickerFormat(symbol);
    const loading = this.isLoading();

    const {
      depth,
      volume24,
      volumeAT,
      totalSwaps,
      totalStakers,
      roiAT,
    } = poolStats;

    const attrs = [
      {
        key: 'depth',
        title: 'Depth',
        value: `${basePriceAsset} ${formatBaseAsTokenAmount(depth)}`,
      },
      {
        key: 'vol24',
        title: '24hr Volume',
        value: `${basePriceAsset} ${formatBaseAsTokenAmount(volume24)}`,
      },
      {
        key: 'volAT',
        title: 'All Time Volume',
        value: `${basePriceAsset} ${formatBaseAsTokenAmount(volumeAT)}`,
      },
      { key: 'swap', title: 'Total Swaps', value: totalSwaps.toString() },
      {
        key: 'stakers',
        title: 'Total Stakers',
        value: totalStakers.toString(),
      },
      {
        key: 'roi',
        title: 'All Time RoI',
        value: `${roiAT}% pa`,
      },
    ];

    return attrs.map(info => {
      const { title, value, key } = info;

      return (
        <Col className="token-info-card" key={key} xs={12} sm={8} md={6} lg={4}>
          <TokenInfo
            asset={source}
            target={target}
            value={value}
            label={title}
            loading={loading}
          />
        </Col>
      );
    });
  };

  /**
   * Check to consider special cases for BNB
   */
  considerBnb = (): boolean => {
    const { symbol } = this.props;
    return symbol.toUpperCase() === 'BNB';
  };

  /**
   * Check to consider BNB fee
   */
  considerBnbFee = (): boolean => {
    const { tokenAmount, selectedShareDetailTab } = this.state;

    // For withdrawing, we always consider a bnb fee
    if (selectedShareDetailTab === ShareDetailTabKeys.WITHDRAW) {
      return this.considerBnb();
    }

    // For staking, an amount of BNB needs to be entered as well
    return this.considerBnb() && tokenAmount.amount().isGreaterThan(0);
  };

  /**
   * Check whether to substract BNB fee from entered BNB amount
   */
  subtractBnbFee = (): boolean => {
    const { tokenAmount, selectedShareDetailTab } = this.state;
    // Ignore withdrawing, since we deal with percent values only and can't substract fees from these values
    if (
      this.considerBnb() &&
      selectedShareDetailTab !== ShareDetailTabKeys.WITHDRAW
    ) {
      const { assetData } = this.props;
      // (1) BNB amount in wallet
      const bnbInWallet = bnbBaseAmount(assetData) || baseAmount(0);
      // (2) BNB amount entered in token input
      const bnbEntered = tokenToBase(tokenAmount);
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
   * BNB fee in BaseAmount
   * Returns Nothing if fee is not available
   */
  bnbFeeAmount = (): Maybe<BaseAmount> => {
    const { transferFees } = this.props;
    const { runeAmount, tokenAmount, selectedShareDetailTab } = this.state;
    const fees = RD.toNullable(transferFees);
    // To withdraw we will always have a `single` transaction fee
    if (selectedShareDetailTab === ShareDetailTabKeys.WITHDRAW) {
      return fees?.single ?? Nothing;
    }

    // For staking, check whether it's a `single` or `multi` fee depending on entered values
    return runeAmount.amount().isGreaterThan(0) &&
      tokenAmount.amount().isGreaterThan(0)
      ? fees?.multi ?? Nothing
      : fees?.single ?? Nothing;
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
      return `${token.amount().toString()} BNB`;
    };

    const txtLoading = <Text>Fee: ...</Text>;
    return (
      <FeeParagraph style={{ paddingTop: '10px' }}>
        {RD.fold(
          () => txtLoading,
          () => txtLoading,
          (_: Error) => <Text>Error: Fee could not be loaded</Text>,
          (_: TransferFees) => {
            const fee = this.bnbFeeAmount();
            return (
              <>
                {fee && <Text>Fee: {formatBnbAmount(fee)}</Text>}
                {this.subtractBnbFee() && (
                  <Text> (It will be substructed from BNB amount)</Text>
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
            );
          },
        )(transferFees)}
      </FeeParagraph>
    );
  };

  shareDetailTabsChangedHandler = (activeKey: ShareDetailTabKeys) =>
    this.setState({ selectedShareDetailTab: activeKey });

  renderShareDetail = (
    _: PoolData,
    stakersAssetData: StakersAssetData,
    calcResult: CalcResult,
  ) => {
    const { symbol, priceIndex, basePriceAsset, assets } = this.props;
    const {
      runeAmount,
      tokenAmount,
      runePercent,
      widthdrawPercentage,
      dragReset,
      selectRatio,
    } = this.state;

    const source = 'rune';
    const target = getTickerFormat(symbol);

    const runePrice = validBNOrZero(priceIndex?.RUNE);
    const tokenPrice = validBNOrZero(priceIndex[target.toUpperCase()]);

    const tokensData: AssetPair[] = Object.keys(assets).map(tokenName => {
      const tokenData = assets[tokenName];
      const assetStr = tokenData?.asset;
      const asset = assetStr ? getAssetFromString(assetStr) : null;

      return {
        asset: asset?.symbol ?? '',
      };
    });

    // withdraw values
    const withdrawRate: number = (widthdrawPercentage || 50) / 100;
    const { stakeUnits }: StakersAssetData = stakersAssetData;

    const { R, T, poolUnits } = calcResult;

    const stakeUnitsBN = bnOrZero(stakeUnits);

    const runeShare = poolUnits
      ? R.multipliedBy(stakeUnitsBN).div(poolUnits)
      : bn(0);
    const assetShare = poolUnits
      ? T.multipliedBy(stakeUnitsBN).div(poolUnits)
      : bn(0);

    const assetValue = bn(withdrawRate).multipliedBy(runeShare);
    const runeBaseAmount = baseAmount(assetValue);

    const tokenValue = bn(withdrawRate).multipliedBy(assetShare);
    const tokenBaseAmount = baseAmount(tokenValue);

    this.withdrawData = {
      runeValue: runeBaseAmount,
      tokenValue: tokenBaseAmount,
      tokenPrice,
      percentage: widthdrawPercentage,
    };

    const disableWithdraw = stakeUnitsBN.isEqualTo(0);
    const sourceTokenAmount = baseToToken(runeBaseAmount);
    const sourcePrice = baseToToken(runeBaseAmount)
      .amount()
      .multipliedBy(runePrice);
    const targetTokenAmount = baseToToken(tokenBaseAmount);
    const targetPrice = baseToToken(tokenBaseAmount)
      .amount()
      .multipliedBy(tokenPrice);

    const disableDrag = this.bnbFeeIsNotCovered();

    return (
      <div className="share-detail-wrapper">
        <Tabs withBorder onChange={this.shareDetailTabsChangedHandler}>
          <TabPane tab="Add" key={ShareDetailTabKeys.ADD}>
            <Row>
              <Col span={24} lg={12}>
                <Label className="label-description" size="normal">
                  Select the maximum deposit to stake.
                </Label>
                <Label className="label-no-padding" size="normal">
                  Note: Pools always have RUNE as the base asset.
                </Label>
              </Col>
            </Row>
            <div className="stake-card-wrapper">
              <div className="coin-card-wrapper">
                <CoinCard
                  inputProps={{ 'data-test': 'stake-coin-input-rune' }}
                  data-test="coin-card-stake-coin-rune"
                  asset={source}
                  amount={runeAmount}
                  price={runePrice}
                  priceIndex={priceIndex}
                  unit={basePriceAsset}
                  onChange={this.handleChangeTokenAmount('rune')}
                />
                <Slider
                  value={runePercent}
                  onChange={this.handleChangePercent('rune')}
                  withLabel
                />
                <PopoverContainer className="stake-ratio-select">
                  <Popover
                    content={
                      <PopoverContent>Select the ratio for me</PopoverContent>
                    }
                    getPopupContainer={this.getPopupContainer}
                    placement="right"
                    visible
                    overlayClassName="stake-ratio-select-popover"
                    overlayStyle={{
                      padding: '6px',
                      animationDuration: '0s !important',
                      animation: 'none !important',
                    }}
                  >
                    <div>
                      <Button
                        onClick={this.handleSwitchSelectRatio}
                        sizevalue="small"
                        typevalue="outline"
                        focused={selectRatio}
                      >
                        {selectRatio ? <LockOutlined /> : <UnlockOutlined />}
                      </Button>
                    </div>
                  </Popover>
                </PopoverContainer>
              </div>
              <div className="coin-card-wrapper">
                <CoinCard
                  inputProps={{
                    'data-test': 'stake-coin-input-target',
                  }}
                  data-test="coin-card-stake-coin-target"
                  asset={target}
                  assetData={tokensData}
                  amount={tokenAmount}
                  price={tokenPrice}
                  priceIndex={priceIndex}
                  unit={basePriceAsset}
                  onChangeAsset={this.handleSelectTraget}
                  onChange={this.handleChangeTokenAmount(target)}
                  withSearch
                />
              </div>
            </div>
            {this.renderFee()}
            <div className="stake-share-info-wrapper">
              <div className="share-status-wrapper">
                <Drag
                  title="Drag to stake"
                  source="blue"
                  target="confirm"
                  reset={dragReset}
                  disabled={disableDrag}
                  onConfirm={this.handleStake}
                  onDrag={this.handleDrag}
                />
              </div>
            </div>
          </TabPane>
          <TabPane
            tab="Withdraw"
            key={ShareDetailTabKeys.WITHDRAW}
            disabled={disableWithdraw}
          >
            <Label className="label-title" size="normal" weight="bold">
              ADJUST WITHDRAWAL
            </Label>
            <Label size="normal">
              Choose from 0 to 100% of how much to withdraw.
            </Label>
            <div className="withdraw-percent-view">
              <Label size="large" color="gray" weight="bold">
                0%
              </Label>
              <Label size="large" color="gray" weight="bold">
                50%
              </Label>
              <Label size="large" color="gray" weight="bold">
                100%
              </Label>
            </div>
            <Slider
              onChange={(value: SliderValue) => {
                this.setState({ widthdrawPercentage: value as number });
              }}
              defaultValue={50}
              max={100}
              min={1}
            />
            <div className="stake-withdraw-info-wrapper">
              <Label className="label-title" size="normal" weight="bold">
                YOU SHOULD RECEIVE
              </Label>
              <div className="withdraw-status-wrapper">
                <div className="withdraw-asset-wrapper">
                  <CoinData
                    asset={source}
                    assetValue={sourceTokenAmount}
                    price={sourcePrice}
                    priceUnit={basePriceAsset}
                  />
                  <CoinData
                    asset={target}
                    assetValue={targetTokenAmount}
                    price={targetPrice}
                    priceUnit={basePriceAsset}
                  />
                </div>
              </div>
              {this.renderFee()}
              <div className="drag-container">
                <Drag
                  title="Drag to withdraw"
                  source="blue"
                  target="confirm"
                  reset={dragReset}
                  disabled={disableDrag}
                  onConfirm={this.handleWithdraw}
                  onDrag={this.handleDrag}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  };

  renderYourShare = (
    calcResult: CalcResult,
    stakersAssetData: StakersAssetData,
  ) => {
    const { symbol, user, priceIndex, basePriceAsset } = this.props;

    const wallet = user ? user.wallet : null;
    const hasWallet = wallet !== null;

    const { R, T, poolUnits } = calcResult;
    const source = 'rune';
    const target = getTickerFormat(symbol);

    const runePrice = validBNOrZero(priceIndex?.RUNE);
    const assetPrice = _get(priceIndex, target.toUpperCase(), 0);

    const {
      stakeUnits,
      runeEarned,
      assetEarned,
    }: StakersAssetData = stakersAssetData;
    const stakeUnitsBN = bnOrZero(stakeUnits);
    const runeEarnedBN = bnOrZero(runeEarned);
    const assetEarnedBN = bnOrZero(assetEarned);
    const loading = this.isLoading() || poolUnits === undefined;

    const poolShare = poolUnits
      ? stakeUnitsBN.div(poolUnits).multipliedBy(100)
      : 0;

    const runeShare = poolUnits
      ? R.multipliedBy(stakeUnitsBN).div(poolUnits)
      : bn(0);
    const assetShare = poolUnits
      ? T.multipliedBy(stakeUnitsBN).div(poolUnits)
      : bn(0);
    const runeStakedShare = formatBaseAsTokenAmount(baseAmount(runeShare));
    const assetStakedShare = formatBaseAsTokenAmount(baseAmount(assetShare));
    const runeEarnedAmount = formatBaseAsTokenAmount(baseAmount(runeEarned));
    const assetEarnedAmount = formatBaseAsTokenAmount(baseAmount(assetEarned));

    const runeStakedPrice = formatBaseAsTokenAmount(
      baseAmount(runeShare.multipliedBy(runePrice)),
    );
    const assetStakedPrice = formatBaseAsTokenAmount(
      baseAmount(assetShare.multipliedBy(assetPrice)),
    );

    const runeEarnedPrice = formatBaseAsTokenAmount(
      baseAmount(runeEarnedBN.multipliedBy(runePrice)),
    );
    const assetEarnedPrice = formatBaseAsTokenAmount(
      baseAmount(assetEarnedBN.multipliedBy(assetPrice)),
    );

    const hasStake = hasWallet && stakeUnitsBN.isGreaterThan(0);

    return (
      <>
        <div className="your-share-wrapper">
          {!hasWallet && <AddWallet />}
          {hasWallet && stakeUnitsBN.isEqualTo(0) && (
            <div className="share-placeholder-wrapper">
              <div className="placeholder-icon">
                <InboxOutlined />
              </div>
              <Label className="placeholder-label">
                You don&apos;t have any shares in this pool.
              </Label>
            </div>
          )}
          {hasStake && (
            <>
              <Label className="share-info-title" size="normal">
                Your total share of the pool
              </Label>
              <div className="your-share-info-wrapper">
                <div className="share-info-row">
                  <div className="your-share-info">
                    <Status
                      title={source.toUpperCase()}
                      value={runeStakedShare}
                      loading={loading}
                    />
                    <Label
                      className="your-share-price-label"
                      size="normal"
                      color="gray"
                      loading={loading}
                    >
                      {`${basePriceAsset} ${runeStakedPrice}`}
                    </Label>
                  </div>
                  <div className="your-share-info">
                    <Status
                      title={target.toUpperCase()}
                      value={assetStakedShare}
                      loading={loading}
                    />

                    <Label
                      className="your-share-price-label"
                      size="normal"
                      color="gray"
                      loading={loading}
                    >
                      {`${basePriceAsset} ${assetStakedPrice}`}
                    </Label>
                  </div>
                </div>
                <div className="share-info-row">
                  <div className="your-share-info pool-share-info">
                    <Status
                      title="Pool Share"
                      value={poolShare ? `${formatBN(poolShare)}%` : '...'}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              {!hasWallet && (
                <Label
                  className="label-title earning-label"
                  size="normal"
                  weight="bold"
                >
                  EARNINGS
                </Label>
              )}
            </>
          )}
        </div>
        {hasStake && (
          <div className="your-share-wrapper">
            <Label className="share-info-title" size="normal">
              Your total earnings from the pool
            </Label>
            <div className="your-share-info-wrapper">
              <div className="share-info-row">
                <div className="your-share-info">
                  <Status
                    title={source.toUpperCase()}
                    value={runeEarnedAmount}
                    loading={loading}
                  />
                  <Label
                    className="your-share-price-label"
                    size="normal"
                    color="gray"
                    loading={loading}
                  >
                    {basePriceAsset} {runeEarnedPrice}
                  </Label>
                </div>
                <div className="your-share-info">
                  <Status
                    title={target.toUpperCase()}
                    value={assetEarnedAmount}
                    loading={loading}
                  />
                  <Label
                    className="your-share-price-label"
                    size="normal"
                    color="gray"
                    loading={loading}
                  >
                    {basePriceAsset} {assetEarnedPrice}
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  renderStakeDataPoolError = () => {
    const { stakerPoolDataError: error } = this.props;
    const msg: Maybe<string> = error?.message ?? Nothing;
    return (
      <div className="your-share-wrapper">
        <div className="share-placeholder-wrapper">
          <div className="placeholder-icon">
            <InfoOutlined />
          </div>
          <h2>Loading of staked data for this pool failed.</h2>
          {msg && <p className="placeholder-label">{msg}</p>}
          <p className="placeholder-label">
            {' '}
            You might have to create a pool first.
          </p>
        </div>
      </div>
    );
  };

  render() {
    const {
      priceIndex,
      basePriceAsset,
      poolData,
      stakerPoolData,
      stakerPoolDataError,
      txStatus,
      user,
    } = this.props;
    const {
      openPrivateModal,
      openWalletAlert,
      password,
      invalidPassword,
      txResult,
      validatingPassword,
    } = this.state;

    const wallet = user ? user.wallet : null;
    const hasWallet = wallet !== null;

    let { symbol } = this.props;
    symbol = symbol.toUpperCase();
    const poolInfo = poolData[symbol] || {};

    const poolStats = getPoolData('rune', poolInfo, priceIndex, basePriceAsset);

    const calcResult = this.getData();

    const openStakeModal =
      txStatus.type === TxTypes.STAKE ? txStatus.modal : false;
    const openWithdrawModal =
      txStatus.type === TxTypes.WITHDRAW ? txStatus.modal : false;
    const coinCloseIconType = txStatus.status ? (
      <FullscreenExitOutlined style={{ color: '#fff' }} />
    ) : (
      <CloseOutlined style={{ color: '#fff' }} />
    );

    const yourShareSpan = hasWallet ? 8 : 24;

    // stake confirmation modal

    const txSent = txStatus.hash !== undefined;

    // TODO(veado): Completed depends on `txStatus.type`, too (no txResult for `stake` atm)
    const completed =
      txStatus.type === TxTypes.STAKE
        ? txSent && !txStatus.status
        : txResult && !txStatus.status;
    const stakeTitle = !completed ? 'YOU ARE STAKING' : 'YOU STAKED';

    // withdraw confirmation modal

    const withdrawText = !completed ? 'YOU ARE WITHDRAWING' : 'YOU WITHDRAWN';

    const emptyStakerPoolData: StakersAssetData = {
      asset: symbol,
      stakeUnits: '0',
      runeStaked: '0',
      assetStaked: '0',
      poolStaked: '0',
      runeEarned: '0',
      assetEarned: '0',
      poolEarned: '0',
      runeROI: '0',
      assetROI: '0',
      poolROI: '0',
      dateFirstStaked: 0,
    };

    const stakersAssetData: Maybe<StakersAssetData> = stakerPoolData
      ? stakerPoolData[symbol]
      : emptyStakerPoolData;

    return (
      <ContentWrapper className="pool-stake-wrapper" transparent>
        <Row className="stake-info-view">{this.renderStakeInfo(poolStats)}</Row>
        <Row className="share-view">
          {!stakersAssetData && stakerPoolDataError && (
            <Col className="your-share-view" md={24}>
              {this.renderStakeDataPoolError()}
            </Col>
          )}
          {stakersAssetData && (
            <Col className="your-share-view" span={24} lg={yourShareSpan}>
              {this.renderYourShare(calcResult, stakersAssetData)}
            </Col>
          )}
          {stakersAssetData && hasWallet && (
            <Col className="share-detail-view" span={24} lg={16}>
              {this.renderShareDetail(poolStats, stakersAssetData, calcResult)}
            </Col>
          )}
        </Row>
        {hasWallet && (
          <>
            <ConfirmModal
              title={withdrawText}
              closeIcon={coinCloseIconType}
              visible={openWithdrawModal}
              footer={null}
              onCancel={this.handleCloseModal}
            >
              {this.renderWithdrawModalContent(txSent, completed)}
            </ConfirmModal>
            <ConfirmModal
              title={stakeTitle}
              closeIcon={coinCloseIconType}
              visible={openStakeModal}
              footer={null}
              onCancel={this.handleCloseModal}
            >
              {this.renderStakeModalContent(completed)}
            </ConfirmModal>
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
          </>
        )}
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
      poolAddress: state.Midgard.poolAddress,
      poolData: state.Midgard.poolData,
      assets: state.Midgard.assets,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      poolLoading: state.Midgard.poolLoading,
      stakerPoolData: state.Midgard.stakerPoolData,
      stakerPoolDataLoading: state.Midgard.stakerPoolDataLoading,
      stakerPoolDataError: state.Midgard.stakerPoolDataError,
      transferFees: state.Binance.transferFees,
      wsTransferEvent: state.Binance.wsTransferEvent,
    }),
    {
      getPools: midgardActions.getPools,
      getPoolAddress: midgardActions.getPoolAddress,
      getStakerPoolData: midgardActions.getStakerPoolData,
      setTxTimerModal: appActions.setTxTimerModal,
      setTxTimerStatus: appActions.setTxTimerStatus,
      countTxTimerValue: appActions.countTxTimerValue,
      setTxTimerValue: appActions.setTxTimerValue,
      setTxHash: appActions.setTxHash,
      resetTxStatus: appActions.resetTxStatus,
      refreshStakes: walletActions.refreshStakes,
      getBinanceFees: binanceActions.getBinanceFees,
      subscribeBinanceTransfers: binanceActions.subscribeBinanceTransfers,
      unSubscribeBinanceTransfers: binanceActions.unSubscribeBinanceTransfers,
    },
  ),
  withRouter,
)(PoolStake) as React.ComponentClass<ComponentProps, State>;
