/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useCallback } from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
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
  PopoverContainer,
  FeeParagraph,
  PopoverContent,
  PopoverIcon,
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
  ThorchainData,
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
import { ShareDetailTabKeys, WithdrawData } from './types';

const { TabPane } = Tabs;

export type ComponentProps = {
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
  thorchainData: ThorchainData;
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

const PoolStake: React.FC<Props> = (props: Props) => {
  const {
    transferFees,
    user,
    symbol,
    assets,
    assetData,
    poolData,
    poolAddress,
    poolLoading,
    stakerPoolData,
    stakerPoolDataLoading,
    stakerPoolDataError,
    priceIndex,
    basePriceAsset,
    thorchainData,
    txStatus,
    wsTransferEvent,
    refreshStakes,
    getPoolAddress,
    getPools,
    getBinanceFees,
    getStakerPoolData,
    countTxTimerValue,
    resetTxStatus,
    setTxHash,
    setTxTimerModal,
    setTxTimerStatus,
    setTxTimerValue,
    unSubscribeBinanceTransfers,
    subscribeBinanceTransfers,
  } = props;

  const history = useHistory();

  const [selectedShareDetailTab, setSelectedShareDetailTab] = useState<
    ShareDetailTabKeys
  >(ShareDetailTabKeys.ADD);

  const [password, setPassword] = useState<string>('');
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const [validatingPassword, setValidatingPassword] = useState(false);

  const [widthdrawPercentage, setWithdrawPercentage] = useState(50);
  const [selectRatio, setSelectRatio] = useState<boolean>(true);
  const [runeAmount, setRuneAmount] = useState<TokenAmount>(tokenAmount(0));
  const [targetAmount, setTargetAmount] = useState<TokenAmount>(tokenAmount(0));
  const [runePercent, setRunePercent] = useState<number>(0);

  const [dragReset, setDragReset] = useState<boolean>(true);
  const [txResult, setTxResult] = useState<boolean>(false);

  const [openWalletAlert, setOpenWalletAlert] = useState(false);
  const [openPrivateModal, setOpenPrivateModal] = useState(false);

  const [txType, setTxType] = useState<TxTypes>();

  let withdrawData: Maybe<WithdrawData> = Nothing;

  const getStakerInfo = useCallback(() => {
    if (user) {
      getStakerPoolData({ asset: symbol, address: user.wallet });
    }
  }, [getStakerPoolData, symbol, user]);

  useEffect(() => {
    getPoolAddress();
    getPools();
    getStakerInfo();

    const net = getNet();
    if (RD.isInitial(transferFees)) {
      getBinanceFees(net);
    }

    const wallet = user?.wallet;
    if (wallet) {
      subscribeBinanceTransfers({ address: wallet, net });
    }

    return () => {
      resetTxStatus();
      unSubscribeBinanceTransfers();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // stakerPoolData needs to be updated
  useEffect(() => {
    getStakerInfo();
  }, [symbol, getStakerInfo]);

  // user wallet change
  useEffect(() => {
    const wallet = user?.wallet;
    // subscribe again if another wallet has been added
    if (wallet) {
      unSubscribeBinanceTransfers();
      subscribeBinanceTransfers({ address: wallet, net: getNet() });
    }
  }, [user?.wallet, subscribeBinanceTransfers, unSubscribeBinanceTransfers]);

  // wsTransferEvent is updated
  useEffect(() => {
    const { type, hash } = txStatus;

    const currentWsTransferEvent = RD.toNullable(wsTransferEvent);
    if (currentWsTransferEvent && hash !== undefined && !txResult) {
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
            setTxResult(true);
            // refresh stakes after update
            refreshStakes(wallet);
          }
        }
      }
    }
  }, [RD.toNullable(wsTransferEvent)]);

  const isLoading = useCallback(() => {
    return poolLoading && stakerPoolDataLoading;
  }, [poolLoading, stakerPoolDataLoading]);

  const handleChangePassword = useCallback(
    (password: string) => {
      setPassword(password);
      setInvalidPassword(false);
    },
    [setPassword, setInvalidPassword],
  );

  const getData = (): CalcResult => {
    const runePrice = validBNOrZero(priceIndex?.RUNE);
    const calcResult = getCalcResult(
      symbol,
      poolData,
      poolAddress,
      runeAmount,
      runePrice,
      targetAmount,
    );

    return calcResult;
  };

  /**
   * Handler for setting token amounts in input fields
   */
  const handleChangeTokenAmount = (tokenName: string) => (value: BigNumber) => {
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

    const totalSourceAmount = sourceAsset.assetValue.amount();
    const totalTokenAmount = targetToken.assetValue.amount();
    const valueAsToken = tokenAmount(value);

    if (!selectRatio) {
      if (tokenName === 'rune') {
        setRuneAmount(valueAsToken);
      } else if (tokenName !== 'rune') {
        setTargetAmount(valueAsToken);
      }
      return;
    }
    if (tokenName === 'rune') {
      const data = getData();
      const ratio = data?.ratio ?? 1;
      // formula: newValue * ratio
      const tokenValue = valueAsToken.amount().multipliedBy(ratio);
      const tokenAmountBN = tokenValue.isLessThanOrEqualTo(totalTokenAmount)
        ? tokenValue
        : totalTokenAmount;

      if (totalSourceAmount.isLessThan(valueAsToken.amount())) {
        setRuneAmount(tokenAmount(totalSourceAmount));
        setTargetAmount(tokenAmount(tokenAmountBN));
        setRunePercent(100);
      } else {
        setRuneAmount(valueAsToken);
        setTargetAmount(tokenAmount(tokenAmountBN));
      }
    } else if (tokenName !== 'rune') {
      const data = getData();
      const ratio = data?.ratio ?? 1;
      // formula: newValue / ratio
      const tokenValue = valueAsToken.amount().dividedBy(ratio);

      if (totalSourceAmount.isLessThan(valueAsToken.amount())) {
        setRuneAmount(tokenAmount(tokenValue));
        setTargetAmount(tokenAmount(totalSourceAmount));
      } else {
        setRuneAmount(tokenAmount(tokenValue));
        setTargetAmount(valueAsToken);
      }
    } else {
      setTargetAmount(valueAsToken);
    }
  };

  /**
   * Handler for moving percent slider
   *
   * Note: Don't consider any fees in this function, since it sets values for tokenAmount,
   * which triggers `handleChangeTokenAmount` where all calculations for fees are happen
   */
  const handleChangePercent = (tokenName: string) => (amount: number) => {
    const selectedToken = getAssetFromAssetData(assetData, tokenName);
    const targetToken = getAssetFromAssetData(assetData, symbol);
    if (!selectedToken || !targetToken) {
      return;
    }

    const totalAmount = selectedToken.assetValue.amount();
    const totalTokenAmount = targetToken.assetValue.amount();
    const value = totalAmount.multipliedBy(amount).div(100);

    if (tokenName === 'rune') {
      const data = getData();
      const ratio = data?.ratio ?? 1;
      // formula: value * ratio);
      const tokenValue = value.multipliedBy(ratio);
      const tokenAmountBN = tokenValue.isLessThanOrEqualTo(totalTokenAmount)
        ? tokenValue
        : totalTokenAmount;

      setRuneAmount(tokenAmount(value));
      setTargetAmount(tokenAmount(tokenAmountBN));
      setRunePercent(amount);
    } else {
      setTargetAmount(tokenAmount(value));
    }
  };

  const handleEndTxTimer = useCallback(() => {
    setTxTimerStatus(false);
    setDragReset(true);

    // get staker info again after finished
    getStakerInfo();
  }, [setTxTimerModal, setDragReset, getStakerInfo, setTxTimerStatus]);

  const handleOpenPrivateModal = useCallback(() => {
    setOpenPrivateModal(true);
    setPassword(emptyString);
    setInvalidPassword(false);
  }, [setOpenPrivateModal, setPassword, setInvalidPassword]);

  const handleCancelPrivateModal = useCallback(() => {
    setOpenPrivateModal(false);
    setDragReset(true);
  }, [setOpenPrivateModal, setDragReset]);

  const handleCloseModal = useCallback(() => {
    setTxTimerModal(false);
    handleEndTxTimer();
  }, [setTxTimerModal, handleEndTxTimer]);

  const handleDrag = useCallback(() => {
    setDragReset(false);
  }, [setDragReset]);

  const handleStartTimer = useCallback(
    (type: TxTypes) => {
      resetTxStatus({
        type,
        modal: true,
        status: true,
        startTime: Date.now(),
      });
    },
    [resetTxStatus],
  );

  const handleSelectTraget = useCallback(
    (asset: string) => {
      const URL = `/pool/${asset}`;
      setRuneAmount(tokenAmount(0));
      setTargetAmount(tokenAmount(0));
      setRunePercent(0);
      history.push(URL);
    },
    [history],
  );

  /**
   * BNB fee in BaseAmount
   * Returns Nothing if fee is not available
   */
  const bnbFeeAmount = (): Maybe<BaseAmount> => {
    const fees = RD.toNullable(transferFees);
    // To withdraw we will always have a `single` transaction fee
    if (selectedShareDetailTab === ShareDetailTabKeys.WITHDRAW) {
      return fees?.single ?? Nothing;
    }

    // For staking, check whether it's a `single` or `multi` fee depending on entered values
    return runeAmount.amount().isGreaterThan(0) &&
      targetAmount.amount().isGreaterThan(0)
      ? fees?.multi ?? Nothing
      : fees?.single ?? Nothing;
  };

  /**
   * Check whether to substract BNB fee from entered BNB amount
   */
  const subtractBnbFee = (): boolean => {
    // Ignore withdrawing, since we deal with percent values only and can't substract fees from these values
    if (
      symbol.toUpperCase() === 'BNB' &&
      selectedShareDetailTab !== ShareDetailTabKeys.WITHDRAW
    ) {
      // (1) BNB amount in wallet
      const bnbInWallet = bnbBaseAmount(assetData) || baseAmount(0);
      // (2) BNB amount entered in token input
      const bnbEntered = tokenToBase(targetAmount);
      // difference (1) - (2) as BigNumber
      const bnbDiff = bnbInWallet.amount().minus(bnbEntered.amount());
      const fee = bnbFeeAmount();
      return (
        !!fee && bnbDiff.isGreaterThan(0) && bnbDiff.isLessThan(fee.amount())
      );
    }
    return false;
  };

  /**
   * Check to consider BNB fee
   */
  const considerBnbFee = (): boolean => {
    // For withdrawing, we always consider a bnb fee
    if (selectedShareDetailTab === ShareDetailTabKeys.WITHDRAW) {
      return symbol.toUpperCase() === 'BNB';
    }

    // For staking, an amount of BNB needs to be entered as well
    return (
      symbol.toUpperCase() === 'BNB' && targetAmount.amount().isGreaterThan(0)
    );
  };

  /**
   * Checks whether fee is covered by amounts of BNB in users wallet
   */
  const bnbFeeIsNotCovered = (): boolean => {
    const bnbAmount = bnbBaseAmount(assetData);
    const fee = bnbFeeAmount();
    return !!bnbAmount && !!fee && bnbAmount.amount().isLessThan(fee.amount());
  };

  /**
   * Renders fee
   */
  const renderFee = () => {
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
            const fee = bnbFeeAmount();
            return (
              <>
                {fee && <Text>Fee: {formatBnbAmount(fee)}</Text>}
                {subtractBnbFee() && (
                  <Text> (It will be substructed from BNB amount)</Text>
                )}
                {bnbAmount && bnbFeeIsNotCovered() && (
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

  const handleConfirmStake = async () => {
    if (user) {
      const { wallet } = user;
      let newTokenAmountToStake = targetAmount;
      // fee transformation: BaseAmount -> TokenAmount -> BigNumber
      const fee = bnbFeeAmount() || baseAmount(0);
      const feeAsTokenAmount = baseToToken(fee).amount();
      // Special case: Substract fee from BNB amount to cover fees
      if (subtractBnbFee()) {
        const amountToStake = targetAmount.amount().minus(feeAsTokenAmount);
        newTokenAmountToStake = tokenAmount(amountToStake);
      }

      handleStartTimer(TxTypes.STAKE);
      setTxResult(false);

      const data = getData();
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
        handleCloseModal();
        setDragReset(true);
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  /**
   * Handler to run first validation of data before staking
   */
  const handleStake = () => {
    const wallet = user ? user.wallet : null;
    const keystore = user ? user.keystore : null;

    // Validata existing wallet
    if (!wallet) {
      setOpenWalletAlert(true);
      return;
    }

    // Validate amounts to stake
    if (
      runeAmount.amount().isLessThanOrEqualTo(0) &&
      targetAmount.amount().isLessThanOrEqualTo(0)
    ) {
      notification.error({
        message: 'Stake Invalid',
        description: 'You need to enter an amount to stake.',
        getContainer: getAppContainer,
      });
      handleCloseModal();
      setDragReset(true);
      return;
    }

    // Validate BNB amount to swap to consider fees
    // to substract fee from amount before sending it
    if (considerBnbFee()) {
      const fee = bnbFeeAmount() || baseAmount(0);
      // fee transformation: BaseAmount -> TokenAmount -> BigNumber
      const feeAsTokenAmount = baseToToken(fee).amount();
      if (targetAmount.amount().isLessThanOrEqualTo(feeAsTokenAmount)) {
        notification.error({
          message: 'Invalid BNB value',
          description: 'Not enough BNB to cover the fee for this transaction.',
          getContainer: getAppContainer,
        });
        setDragReset(true);
        return;
      }
    }

    // Validate keystore
    if (keystore) {
      setTxType(TxTypes.STAKE);
      handleOpenPrivateModal();
      return;
    }

    handleConfirmStake();
  };

  const handleConfirmWithdraw = async () => {
    const withdrawRate = (widthdrawPercentage || 50) / 100;

    if (user) {
      const { wallet } = user;

      handleStartTimer(TxTypes.WITHDRAW);
      setTxResult(false);

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
        setDragReset(true);
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  const handleWithdraw = () => {
    const wallet = user ? user.wallet : null;
    const keystore = user ? user.keystore : null;

    if (!wallet) {
      setOpenWalletAlert(true);
      return;
    }

    if (keystore) {
      setTxType(TxTypes.WITHDRAW);
      handleOpenPrivateModal();
    } else if (wallet) {
      handleConfirmWithdraw();
    }
  };

  const handleConfirmPassword = async () => {
    if (user) {
      const { keystore, wallet } = user;

      setValidatingPassword(true);
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
        console.log('confirm', txType);
        if (wallet && wallet === address) {
          if (txType === TxTypes.STAKE) {
            handleConfirmStake();
          } else if (txType === TxTypes.WITHDRAW) {
            handleConfirmWithdraw();
          }
        }

        setValidatingPassword(false);
        setOpenPrivateModal(false);
      } catch (error) {
        setValidatingPassword(false);
        setInvalidPassword(true);
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  const handleConnectWallet = useCallback(() => {
    setOpenWalletAlert(false);

    history.push('/connect');
  }, [setOpenWalletAlert, history]);

  const hideWalletAlert = useCallback(() => {
    setOpenWalletAlert(false);
    setDragReset(true);
  }, [setOpenWalletAlert, setDragReset]);

  const handleChangeTxValue = () => {
    const { value, type, hash } = txStatus;

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

  const getPopupContainer = () => {
    return document.getElementsByClassName(
      'stake-ratio-select',
    )[0] as HTMLElement;
  };

  const getCooldownPopupContainer = () => {
    return document.getElementsByClassName(
      'share-detail-wrapper',
    )[0] as HTMLElement;
  };

  const renderPopoverContent = () => (
    <PopoverContent>
      To prevent attacks on the network, you must wait approx 24hrs (17280
      blocks) after each staking event to withdraw assets.
    </PopoverContent>
  );

  const handleSwitchSelectRatio = () => {
    setSelectRatio(!selectRatio);
  };

  const renderStakeModalContent = (completed: boolean) => {
    const { status, value, startTime, hash } = txStatus;

    const source = 'rune';
    const target = getTickerFormat(symbol);

    const Pr = validBNOrZero(priceIndex?.RUNE);
    // const tokenPrice = _get(priceIndex, target.toUpperCase(), 0);
    const txURL = TESTNET_TX_BASE_URL + hash;

    const sourcePrice = runeAmount.amount().multipliedBy(Pr);
    // const targetPrice = tokenAmount.amount().multipliedBy(tokenPrice);
    // target price is equal to source price
    const targetPrice = sourcePrice;

    return (
      <ConfirmModalContent>
        <Row className="modal-content">
          <div className="timer-container">
            <TxTimer
              status={status}
              value={value}
              maxValue={MAX_VALUE}
              startTime={startTime}
              onChange={handleChangeTxValue}
              onEnd={handleEndTxTimer}
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
                assetValue={targetAmount}
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
                <Button
                  className="view-btn"
                  color="success"
                  onClick={handleCloseModal}
                >
                  FINISH
                </Button>
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

  const renderWithdrawModalContent = (txSent: boolean, completed: boolean) => {
    const { status, value, startTime, hash } = txStatus;

    const source = 'rune';
    const target = getTickerFormat(symbol);

    const runePrice = validBNOrZero(priceIndex?.RUNE);
    const tokenPrice = validBNOrZero(priceIndex[target.toUpperCase()]);
    const txURL = TESTNET_TX_BASE_URL + hash;

    if (!withdrawData) {
      // Avoid to render anything if we don't have needed data for calculation
      return <></>;
    } else {
      const { runeValue, tokenValue } = withdrawData;

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
                onChange={handleChangeTxValue}
                onEnd={handleEndTxTimer}
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
                    <Button
                      className="view-btn"
                      color="success"
                      onClick={handleCloseModal}
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
        </ConfirmModalContent>
      );
    }
  };

  const renderStakeInfo = (poolStats: PoolData) => {
    const source = 'rune';
    const target = getTickerFormat(symbol);
    const loading = isLoading();

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
        title: 'All Time ROI',
        value: `${roiAT}% APR`,
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

  const renderShareDetail = (
    _: PoolData,
    stakersAssetData: StakersAssetData,
    calcResult: CalcResult,
  ) => {
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
    const withdrawRate: number = widthdrawPercentage / 100;
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

    withdrawData = {
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

    const disableDrag = bnbFeeIsNotCovered();

    // unstake cooldown
    const heightLastStaked = bnOrZero(stakersAssetData?.heightLastStaked);
    const currentBlockHeight = bnOrZero(thorchainData.lastBlock?.thorchain);
    const stakeLockUpBlocks = bnOrZero(
      thorchainData.constants?.int_64_values?.StakeLockUpBlocks,
    );
    const totalBlocksToUnlock: BigNumber = heightLastStaked.plus(
      stakeLockUpBlocks,
    );
    const remainingBlocks: BigNumber = totalBlocksToUnlock.minus(
      currentBlockHeight,
    );

    const withdrawDisabled = remainingBlocks.toNumber() > 0;

    let remainingTimeString = '';
    if (withdrawDisabled) {
      const remainingSeconds = remainingBlocks.multipliedBy(5).toNumber();
      const remainingHours =
        (remainingSeconds - (remainingSeconds % 3600)) / 3600;
      const remainingMinutes =
        ((remainingSeconds % 3600) - (remainingSeconds % 60)) / 60;
      remainingTimeString = `${remainingHours} Hours ${remainingMinutes} Minutes`;
    }

    const dragText = withdrawDisabled ? '24hr cooldown' : 'drag to withdraw';

    return (
      <div className="share-detail-wrapper">
        <Tabs withBorder onChange={setSelectedShareDetailTab}>
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
                  inputProps={{
                    'data-test': 'stake-coin-input-rune',
                    tabIndex: '0',
                  }}
                  data-test="coin-card-stake-coin-rune"
                  asset={source}
                  amount={runeAmount}
                  price={runePrice}
                  priceIndex={priceIndex}
                  unit={basePriceAsset}
                  onChange={handleChangeTokenAmount('rune')}
                />
                <Slider
                  value={runePercent}
                  onChange={handleChangePercent('rune')}
                  withLabel
                  tabIndex="-1"
                />
                <PopoverContainer className="stake-ratio-select">
                  <Popover
                    content={
                      <PopoverContent>Select the ratio for me</PopoverContent>
                    }
                    getPopupContainer={getPopupContainer}
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
                        onClick={handleSwitchSelectRatio}
                        sizevalue="small"
                        typevalue="outline"
                        focused={selectRatio}
                        tabIndex={-1}
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
                    tabIndex: '0',
                  }}
                  data-test="coin-card-stake-coin-target"
                  asset={target}
                  assetData={tokensData}
                  amount={targetAmount}
                  price={tokenPrice}
                  priceIndex={priceIndex}
                  unit={basePriceAsset}
                  onChangeAsset={handleSelectTraget}
                  onChange={handleChangeTokenAmount(target)}
                  withSearch
                />
              </div>
            </div>
            <div className="stake-share-info-wrapper">
              <div className="share-status-wrapper">
                <Drag
                  title="Drag to stake"
                  source="blue"
                  target="confirm"
                  reset={dragReset}
                  disabled={disableDrag}
                  onConfirm={handleStake}
                  onDrag={handleDrag}
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
                setWithdrawPercentage(value as number);
              }}
              defaultValue={50}
              max={100}
              min={0}
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
              {renderFee()}
              <div className="drag-container">
                <Drag
                  title={dragText}
                  source="blue"
                  target="confirm"
                  reset={dragReset}
                  disabled={disableDrag || withdrawDisabled}
                  onConfirm={handleWithdraw}
                  onDrag={handleDrag}
                />
                {!!withdrawDisabled && (
                  <div className="cooldown-info">
                    <Label>
                      You must wait {remainingTimeString} until you can withdraw
                      again.
                    </Label>
                    <Popover
                      content={renderPopoverContent}
                      getPopupContainer={getCooldownPopupContainer}
                      placement="bottomLeft"
                      overlayClassName="pool-filter-info"
                      overlayStyle={{
                        padding: '6px',
                        animationDuration: '0s !important',
                        animation: 'none !important',
                      }}
                    >
                      <PopoverIcon />
                    </Popover>
                  </div>
                )}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  };

  const renderYourShare = (
    calcResult: CalcResult,
    stakersAssetData: StakersAssetData,
  ) => {
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
    const loading = isLoading() || poolUnits === undefined;

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

  const renderStakeDataPoolError = () => {
    const msg: Maybe<string> = stakerPoolDataError?.message ?? Nothing;
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

  const wallet = user ? user.wallet : null;
  const hasWallet = wallet !== null;

  const tokenSymbol = symbol.toUpperCase();
  const poolInfo = poolData[tokenSymbol] || {};

  const poolStats = getPoolData('rune', poolInfo, priceIndex);

  const calcResult = getData();

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
    asset: tokenSymbol,
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
    ? stakerPoolData[tokenSymbol]
    : emptyStakerPoolData;

  return (
    <ContentWrapper className="pool-stake-wrapper" transparent>
      <Row className="stake-info-view">{renderStakeInfo(poolStats)}</Row>
      <Row className="share-view">
        {!stakersAssetData && stakerPoolDataError && (
          <Col className="your-share-view" md={24}>
            {renderStakeDataPoolError()}
          </Col>
        )}
        {stakersAssetData && (
          <Col className="your-share-view" span={24} lg={yourShareSpan}>
            {renderYourShare(calcResult, stakersAssetData)}
          </Col>
        )}
        {stakersAssetData && hasWallet && (
          <Col className="share-detail-view" span={24} lg={16}>
            {renderShareDetail(poolStats, stakersAssetData, calcResult)}
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
            onCancel={handleCloseModal}
          >
            {renderWithdrawModalContent(txSent, completed)}
          </ConfirmModal>
          <ConfirmModal
            title={stakeTitle}
            closeIcon={coinCloseIconType}
            visible={openStakeModal}
            footer={null}
            onCancel={handleCloseModal}
          >
            {renderStakeModalContent(completed)}
          </ConfirmModal>
          <PrivateModal
            visible={openPrivateModal}
            validatingPassword={validatingPassword}
            invalidPassword={invalidPassword}
            password={password}
            onChangePassword={handleChangePassword}
            onOk={handleConfirmPassword}
            onCancel={handleCancelPrivateModal}
          />
          <Modal
            title="PLEASE ADD WALLET"
            visible={openWalletAlert}
            onOk={handleConnectWallet}
            onCancel={hideWalletAlert}
            okText="ADD WALLET"
          >
            <Label>Please add a wallet to swap tokens.</Label>
          </Modal>
        </>
      )}
    </ContentWrapper>
  );
};

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
      thorchainData: state.Midgard.thorchain,
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
)(PoolStake);
