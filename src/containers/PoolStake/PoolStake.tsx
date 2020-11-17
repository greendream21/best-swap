import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Row, Col, Popover } from 'antd';
import { InboxOutlined, InfoOutlined } from '@ant-design/icons';
import { SliderValue } from 'antd/lib/slider';
import { get as _get } from 'lodash';

import BigNumber from 'bignumber.js';
import * as RD from '@devexperts/remote-data-ts';
import { TransferResult } from '@thorchain/asgardex-binance';
import {
  bn,
  validBNOrZero,
  bnOrZero,
  formatBN,
  getSlipOnStake,
  assetAmount,
  baseAmount as getBaseAmount,
  assetToBase,
} from '@thorchain/asgardex-util';
import {
  TokenAmount,
  BaseAmount,
  tokenAmount,
  formatBaseAsTokenAmount,
  baseAmount,
  baseToToken,
} from '@thorchain/asgardex-token';
import Text from 'antd/lib/typography/Text';

import { bncClient } from '../../env';

import Label from '../../components/uielements/label';
import Status from '../../components/uielements/status';
import CoinCard from '../../components/uielements/coins/coinCard';
import CoinData from '../../components/uielements/coins/coinData';
import Slider from '../../components/uielements/slider';
import Drag from '../../components/uielements/drag';
import Modal from '../../components/uielements/modal';
import AddWallet from '../../components/uielements/addWallet';
import PrivateModal from '../../components/modals/privateModal';

import * as appActions from '../../redux/app/actions';
import * as midgardActions from '../../redux/midgard/actions';
import * as walletActions from '../../redux/wallet/actions';

import {
  ContentWrapper,
  Tabs,
  FeeParagraph,
  PopoverContent,
  PopoverIcon,
} from './PoolStake.style';
import {
  stakeRequest,
  withdrawRequest,
  isAsymStakeValid,
} from '../../helpers/utils/poolUtils';
import { getTickerFormat } from '../../helpers/stringHelper';
import { RootState } from '../../redux/store';
import { User, AssetData } from '../../redux/wallet/types';
import { Maybe, Nothing, AssetPair, FixmeType } from '../../types/bepswap';
import { TxStatus, TxTypes, TxResult } from '../../redux/app/types';
import {
  AssetDetailMap,
  StakerPoolData,
  PoolDataMap,
  ThorchainData,
} from '../../redux/midgard/types';
import { StakersAssetData } from '../../types/generated/midgard';
import { getAssetFromString } from '../../redux/midgard/utils';
import { TransferFeesRD, TransferFees } from '../../redux/binance/types';
import { bnbBaseAmount } from '../../helpers/walletHelper';
import { TabKeys, WithdrawData } from './types';
import showNotification from '../../components/uielements/notification';
import {
  stakeRequestUsingWalletConnect,
  withdrawRequestUsingWalletConnect,
} from '../../helpers/utils/trustwalletUtils';
import { CONFIRM_DISMISS_TIME } from '../../settings/constants';
import usePrevious from '../../hooks/usePrevious';
import useFee from '../../hooks/useFee';
import useNetwork from '../../hooks/useNetwork';
import usePrice from '../../hooks/usePrice';

import { RUNE_SYMBOL } from '../../settings/assetData';

const { TabPane } = Tabs;

type Props = {
  history: H.History;
  txStatus: TxStatus;
  txResult?: TxResult;
  user: Maybe<User>;
  assetData: AssetData[];
  poolAddress: Maybe<string>;
  poolData: PoolDataMap;
  assets: AssetDetailMap;
  stakerPoolData: Maybe<StakerPoolData>;
  stakerPoolDataLoading: boolean;
  stakerPoolDataError: Maybe<Error>;
  poolLoading: boolean;
  thorchainData: ThorchainData;
  transferFees: TransferFeesRD;
  getStakerPoolData: typeof midgardActions.getStakerPoolData;
  getPoolDataForAsset: typeof midgardActions.getPoolData;
  getPoolAddress: typeof midgardActions.getPoolAddress;
  setTxResult: typeof appActions.setTxResult;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxHash: typeof appActions.setTxHash;
  resetTxStatus: typeof appActions.resetTxStatus;
  refreshBalance: typeof walletActions.refreshBalance;
  refreshStakes: typeof walletActions.refreshStakes;
};

const PoolStake: React.FC<Props> = (props: Props) => {
  const {
    transferFees,
    user,
    assets,
    assetData,
    poolData,
    poolAddress,
    poolLoading,
    stakerPoolData,
    stakerPoolDataLoading,
    stakerPoolDataError,
    thorchainData,
    txStatus,
    refreshBalance,
    refreshStakes,
    getPoolAddress,
    getPoolDataForAsset,
    getStakerPoolData,
    resetTxStatus,
    setTxResult,
    setTxHash,
    setTxTimerModal,
  } = props;

  const history = useHistory();
  const { symbol = '' } = useParams();

  const { runePrice, priceIndex, pricePrefix } = usePrice();

  const tokenSymbol = symbol.toUpperCase();
  const tokenTicker = getTickerFormat(symbol);
  const tokenPrice = validBNOrZero(priceIndex[tokenSymbol]);

  const { isValidFundCaps } = useNetwork();

  const isAsymStakeValidUser = isAsymStakeValid();

  // pool details
  const poolInfo = poolData[tokenSymbol] || {};

  const R = bnOrZero(poolInfo?.runeDepth);
  const T = bnOrZero(poolInfo?.assetDepth);
  const poolUnits = bnOrZero(poolInfo?.poolUnits);
  // pool ratio -> formula: 1 / (R / T) = T / R
  const ratio = R.isEqualTo(0) ? 1 : T.div(R);

  const wallet = user ? user.wallet : null;
  const hasWallet = wallet !== null;

  const [selectedTab, setSelectedTab] = useState<TabKeys>(TabKeys.ADD_SYM);

  const selectRatio = !isAsymStakeValidUser;
  const [withdrawPercentage, setWithdrawPercentage] = useState(50);
  const [runeAmount, setRuneAmount] = useState<TokenAmount>(tokenAmount(0));
  const [targetAmount, setTargetAmount] = useState<TokenAmount>(tokenAmount(0));

  const isSymStake = selectedTab === TabKeys.ADD_SYM;

  // if stake asymmetrically, set the rune amount as 0
  const runeAmountToSend = isSymStake ? runeAmount : tokenAmount(0);

  const [sliderPercent, setPercentSlider] = useState<number>(0);

  const [dragReset, setDragReset] = useState<boolean>(true);

  const [openWalletAlert, setOpenWalletAlert] = useState(false);
  const [openPrivateModal, setOpenPrivateModal] = useState(false);

  const [txType, setTxType] = useState<TxTypes>();

  const feeType = useMemo(() => {
    if (
      runeAmount.amount().isGreaterThan(0) &&
      targetAmount.amount().isGreaterThan(0) &&
      isSymStake
    ) {
      return 'multi';
    }
    return 'single';
  }, [runeAmount, targetAmount, isSymStake]);

  const {
    bnbFeeAmount,
    hasSufficientBnbFeeInBalance,
    hasSufficientBnbFee,
    getThresholdAmount,
  } = useFee(feeType);

  const totalRuneAmount = getThresholdAmount(RUNE_SYMBOL).amount();
  const totalTokenAmount = getThresholdAmount(tokenSymbol).amount();
  // maximum token amount calculated by rune amount in balance and pool ratio
  const maxTokenAmount = totalRuneAmount.multipliedBy(ratio);
  // available token amount in the balance
  const availableTokenAmountForSymStake = maxTokenAmount.isLessThan(
    totalTokenAmount,
  )
    ? maxTokenAmount
    : totalTokenAmount;
  const availableTokenAmount = isSymStake
    ? availableTokenAmountForSymStake
    : totalTokenAmount;

  const emptyStakerPoolData: StakersAssetData = {
    asset: tokenSymbol,
    units: '0',
    dateFirstStaked: 0,
  };

  const [stakersAssetData, setStakersAssetData] = useState<StakersAssetData>(
    emptyStakerPoolData,
  );

  let withdrawData: Maybe<WithdrawData> = Nothing;

  // get staker pool detail from midgard
  const getStakerPoolDetail = useCallback(() => {
    if (user) {
      getStakerPoolData({ asset: symbol, address: user.wallet });
    }
  }, [getStakerPoolData, symbol, user]);

  const refreshStakerData = () => {
    // get staker info again after finished
    getStakerPoolDetail();

    // refresh pool data
    getPoolDataForAsset({
      assets: [symbol],
      overrideAllPoolData: false,
      type: 'full',
    });

    if (user) {
      const wallet = user.wallet;
      refreshStakes(wallet);
      refreshBalance(wallet);
    }
  };

  useEffect(() => {
    if (stakerPoolData) {
      setStakersAssetData(stakerPoolData[tokenSymbol]);
    } else if (stakerPoolDataError) {
      setStakersAssetData(emptyStakerPoolData);
      setSelectedTab(TabKeys.ADD_SYM);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakerPoolData, stakerPoolDataError]);

  useEffect(() => {
    getStakerPoolDetail();
    // refresh pool data
    getPoolDataForAsset({
      assets: [symbol],
      overrideAllPoolData: false,
      type: 'full',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // stakerPoolData needs to be updated whenever pool changed
  useEffect(() => {
    refreshStakerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  // reset the percentage and amount when switching the tab
  useEffect(() => {
    handleChangePercent(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSymStake]);

  const prevTxStatus = usePrevious(txStatus);
  // if tx is completed, should refresh staker details
  useEffect(() => {
    if (prevTxStatus?.status === true && txStatus.status === false) {
      refreshStakerData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txStatus]);

  const isLoading = useCallback(() => {
    return poolLoading && stakerPoolDataLoading;
  }, [poolLoading, stakerPoolDataLoading]);

  /**
   * Calculate the output amount to stake based on the input amount and locked status
   * @param assetSymbol input asset symbol
   * @param locked used for manual locked ratio calculation, default = false
   */
  const handleChangeTokenAmount = (assetSymbol: string, locked = false) => (
    value: BigNumber,
  ) => {
    const inputAmount = tokenAmount(value);

    // asym stake
    if (!selectRatio && !locked) {
      if (assetSymbol === RUNE_SYMBOL) {
        // if input value is larger than rune amount in balance, set MAX rune amount
        if (totalRuneAmount.isLessThan(inputAmount.amount())) {
          setRuneAmount(tokenAmount(totalRuneAmount));
        } else {
          setRuneAmount(inputAmount);
        }
      } else if (assetSymbol !== RUNE_SYMBOL) {
        // if input value is larger than max available token amount in balance, set MAX available token amount
        if (availableTokenAmount.isLessThan(inputAmount.amount())) {
          setTargetAmount(tokenAmount(availableTokenAmount));
          setPercentSlider(100);
        } else {
          setTargetAmount(inputAmount);
        }
      }
      return;
    }

    // only sym stake
    if (assetSymbol === RUNE_SYMBOL) {
      // validate rune amount
      const runeValue = inputAmount
        .amount()
        .isLessThanOrEqualTo(totalRuneAmount)
        ? inputAmount.amount()
        : totalRuneAmount;
      // formula: newValue * ratio
      const tokenValue = runeValue.multipliedBy(ratio);
      const tokenAmountBN = tokenValue.isLessThanOrEqualTo(availableTokenAmount)
        ? tokenValue
        : availableTokenAmount;
      const percent = tokenAmountBN
        .dividedBy(availableTokenAmount)
        .multipliedBy(100)
        .toFixed(0);

      setRuneAmount(tokenAmount(runeValue));
      setTargetAmount(tokenAmount(tokenAmountBN));
      setPercentSlider(Number(percent));
    } else if (assetSymbol !== RUNE_SYMBOL) {
      // validate token amount
      const tokenValue = inputAmount
        .amount()
        .isLessThanOrEqualTo(availableTokenAmount)
        ? inputAmount.amount()
        : availableTokenAmount;

      // formula: newValue / ratio
      const runeValue = tokenValue.dividedBy(ratio);
      const percent = tokenValue
        .dividedBy(availableTokenAmount)
        .multipliedBy(100)
        .toFixed(0);

      setRuneAmount(tokenAmount(runeValue));
      setTargetAmount(tokenAmount(tokenValue));
      setPercentSlider(Number(percent));
    } else {
      setTargetAmount(inputAmount);
    }
  };

  /**
   * Handler for moving percent slider
   *
   * Note: Don't consider any fees in this function, since it sets values for tokenAmount,
   * which triggers `handleChangeTokenAmount` where all calculations for fees are happen
   */
  const handleChangePercent = (amount: number) => {
    const value = availableTokenAmount.multipliedBy(amount).div(100);

    // formula: token amount / ratio;
    const runeValue = value.dividedBy(ratio);
    const runeAmountBN = runeValue.isLessThanOrEqualTo(totalRuneAmount)
      ? runeValue
      : totalRuneAmount;

    setTargetAmount(tokenAmount(value));
    setRuneAmount(tokenAmount(runeAmountBN));
    setPercentSlider(amount);
  };

  const handleOpenPrivateModal = useCallback(() => {
    setOpenPrivateModal(true);
  }, [setOpenPrivateModal]);

  const handleCancelPrivateModal = useCallback(() => {
    setOpenPrivateModal(false);
    setDragReset(true);
  }, [setOpenPrivateModal, setDragReset]);

  const handleCloseModal = useCallback(() => {
    setTxTimerModal(false);
  }, [setTxTimerModal]);

  const handleDrag = useCallback(() => {
    setDragReset(false);
  }, [setDragReset]);

  const handleStartTimer = (type: TxTypes) => {
    const txData =
      type === TxTypes.STAKE
        ? {
            sourceAsset: RUNE_SYMBOL,
            targetAsset: symbol,
            sourceAmount: runeAmountToSend,
            targetAmount,
          }
        : {
            sourceAsset: RUNE_SYMBOL,
            targetAsset: symbol,
            sourceAmount: baseToToken(withdrawData?.runeValue ?? baseAmount(0)),
            targetAmount: baseToToken(
              withdrawData?.tokenValue ?? baseAmount(0),
            ),
          };

    // set the tx confirmation status
    resetTxStatus({
      type,
      value: 0,
      modal: true,
      status: true,
      startTime: Date.now(),
      info: symbol,
      txData,
    });

    // dismiss modal after 1s
    setTimeout(() => {
      setTxTimerModal(false);
      setDragReset(true);
    }, CONFIRM_DISMISS_TIME);
  };

  const handleSelectTraget = useCallback(
    (asset: string) => {
      const URL = `/liquidity/${asset}`;
      setRuneAmount(tokenAmount(0));
      setTargetAmount(tokenAmount(0));
      setPercentSlider(0);
      history.push(URL);
    },
    [history],
  );

  /**
   * Renders fee
   */
  const renderFee = () => {
    const wallet = user ? user.wallet : null;
    const bnbAmount = bnbBaseAmount(assetData);

    const formatBnbAmount = (value: BaseAmount) => {
      const token = baseToToken(value);
      return `${token.amount().toString()} BNB`;
    };

    const txtLoading = <Text>Fee: ...</Text>;
    const isStakingBNB =
      selectedTab !== TabKeys.WITHDRAW &&
      targetAmount.amount().isGreaterThan(0);

    const toolTipContent = (
      <PopoverContent>
        {isStakingBNB && (
          <>
            <Text> (It will be substructed from BNB amount)</Text>
            <br />
          </>
        )}
        {wallet && (
          <Text style={{ paddingTop: '10px' }}>
            Note: 0.1 BNB will be left in your wallet for the transaction fees.
          </Text>
        )}
      </PopoverContent>
    );

    return (
      <FeeParagraph style={{ paddingTop: '10px' }} className="fee-paragraph">
        {RD.fold(
          () => txtLoading,
          () => txtLoading,
          (_: Error) => <Text>Error: Fee could not be loaded</Text>,
          (_: TransferFees) => {
            return (
              <>
                {bnbFeeAmount && (
                  <Text>Fee: {formatBnbAmount(bnbFeeAmount)}</Text>
                )}
                <Popover
                  content={toolTipContent}
                  getPopupContainer={getFeeTipPopupContainer}
                  placement="topRight"
                  overlayClassName="pool-filter-info"
                  overlayStyle={{
                    padding: '6px',
                    animationDuration: '0s !important',
                    animation: 'none !important',
                  }}
                >
                  <PopoverIcon />
                </Popover>
                {wallet && !hasSufficientBnbFeeInBalance && (
                  <>
                    <br />
                    <Text type="danger" style={{ paddingTop: '10px' }}>
                      You have {formatBnbAmount(bnbAmount)} in your wallet,
                      that&lsquo;s not enough to cover the fee for this
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

      try {
        let response: TransferResult | FixmeType;

        if (user.type === 'walletconnect') {
          response = await stakeRequestUsingWalletConnect({
            walletConnect: user.walletConnector,
            bncClient,
            walletAddress: user.wallet,
            runeAmount: runeAmountToSend,
            assetAmount: targetAmount,
            poolAddress: poolAddress || '',
            symbol,
          });
        } else {
          response = await stakeRequest({
            bncClient,
            wallet,
            runeAmount: runeAmountToSend,
            tokenAmount: targetAmount,
            poolAddress,
            symbolTo: symbol,
          });
        }

        const result = response?.result;
        const hash = result ? result[0]?.hash ?? null : null;
        if (hash) {
          setTxHash(hash);
          setOpenPrivateModal(false);

          // start tx timer modal
          setTxResult({
            status: false,
          });
          handleStartTimer(TxTypes.STAKE);
        }
      } catch (error) {
        setOpenPrivateModal(false);
        showNotification({
          type: 'error',
          message: 'Add Liquidity Invalid',
          description: `${error?.toString() ??
            'Add information is not valid.'}`,
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

    // Validata existing wallet
    if (!wallet) {
      setOpenWalletAlert(true);
      setDragReset(true);
      return;
    }

    // if fund caps is invalid, show error notification
    if (!isValidFundCaps) {
      showNotification({
        type: 'error',
        message: 'Add Liquidity Invalid',
        description:
          '95% Funds Cap has been reached. You cannot add right now, come back later.',
      });
      setDragReset(true);
      return;
    }

    // Validate amounts to stake
    if (
      (runeAmount.amount().isLessThanOrEqualTo(0) &&
        targetAmount.amount().isLessThanOrEqualTo(0) &&
        isSymStake) ||
      (targetAmount.amount().isLessThanOrEqualTo(0) && !isSymStake)
    ) {
      showNotification({
        type: 'error',
        message: 'Add Liquidity Invalid',
        description: 'You need to enter the amount to add.',
      });
      setDragReset(true);
      return;
    }

    if (
      !isAsymStakeValidUser &&
      isSymStake &&
      (runeAmount.amount().isLessThanOrEqualTo(0) ||
        targetAmount.amount().isLessThanOrEqualTo(0))
    ) {
      showNotification({
        type: 'error',
        message: 'Add Liquidity Invalid',
        description: 'You cannot add asymmetrically.',
      });
      setDragReset(true);
      return;
    }

    if (
      targetAmount.amount().isGreaterThan(0) &&
      !hasSufficientBnbFee(targetAmount, symbol)
    ) {
      // Validate BNB amount before stake
      // if bnb amount is greater than 0 but doesn't have sufficient fee, cancel the stake
      showNotification({
        type: 'error',
        message: 'Invalid BNB amount',
        description: 'Not enough BNB to cover the fee for this transaction.',
      });
      setDragReset(true);
      return;
    }

    // if wallet is connected
    if (wallet) {
      // get pool address before confirmation
      getPoolAddress();

      setTxType(TxTypes.STAKE);
      handleOpenPrivateModal();
    }
  };

  const handleConfirmWithdraw = async () => {
    const withdrawRate = withdrawPercentage / 100;

    if (user) {
      const { wallet } = user;

      try {
        const percent = Number(Number(withdrawRate * 100).toFixed(0));

        let response: TransferResult | FixmeType;

        if (user.type === 'walletconnect') {
          response = await withdrawRequestUsingWalletConnect({
            walletConnect: user.walletConnector,
            bncClient,
            walletAddress: user.wallet,
            poolAddress: poolAddress || '',
            symbol,
            percent,
          });
        } else {
          response = await withdrawRequest({
            bncClient,
            wallet,
            poolAddress,
            symbol,
            percent,
          });
        }

        const result = response?.result;
        const hash = result ? result[0]?.hash ?? null : null;
        if (hash) {
          setTxHash(hash);
          setOpenPrivateModal(false);

          // start tx timer
          handleStartTimer(TxTypes.WITHDRAW);
          setTxResult({
            status: false,
          });
        }
      } catch (error) {
        setOpenPrivateModal(false);
        showNotification({
          type: 'error',
          message: 'Withdraw Invalid',
          description: 'Withdraw information is not valid.',
        });
        setDragReset(true);
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  const getWithdrawPoolSharePercent = () => {
    const poolInfo = poolData?.[symbol];
    const poolUnits = poolInfo?.poolUnits;
    const poolUnitsBN = bnOrZero(poolUnits);

    const { units: stakeUnits }: StakersAssetData = stakersAssetData;
    const stakeUnitsBN = bnOrZero(stakeUnits);

    const percent = poolUnits
      ? stakeUnitsBN.div(poolUnitsBN).multipliedBy(withdrawPercentage)
      : bn(0);

    return percent;
  };

  const handleWithdraw = () => {
    const wallet = user ? user.wallet : null;

    if (!wallet) {
      setOpenWalletAlert(true);
      setDragReset(true);
      return;
    }

    const runeValue = withdrawData?.runeValue ?? baseAmount(0);
    const runeWithdrawAmount = baseToToken(runeValue);

    if (runeWithdrawAmount.amount().isLessThanOrEqualTo(1)) {
      showNotification({
        type: 'error',
        message: 'Invalid amount',
        description:
          'Withdraw amount must exceed 1 RUNE to cover network fees.',
      });
      setDragReset(true);
      return;
    }

    const withdrawPoolSharePercent = getWithdrawPoolSharePercent();

    if (withdrawPoolSharePercent.isGreaterThan(10)) {
      showNotification({
        type: 'error',
        message: 'Invalid Withdraw Percent',
        description: 'Withdraw amount must be equal or less than 10 percent.',
      });
      setDragReset(true);
      return;
    }

    if (wallet) {
      setTxType(TxTypes.WITHDRAW);
      handleOpenPrivateModal();
    }
  };

  // called when pool address is loaded successfully
  const handlePoolAddressConfirmed = () => {
    // if private modal is closed, don't process the tx
    if (!openPrivateModal) {
      return;
    }
    // if wallet type is walletconnect, send the tx sign request to trustwallet
    if (user?.type === 'walletconnect') {
      if (txType === TxTypes.STAKE) {
        handleConfirmStake();
      } else if (txType === TxTypes.WITHDRAW) {
        handleConfirmWithdraw();
      }
    }
  };

  const handleConfirmTransaction = async () => {
    if (txType === TxTypes.STAKE) {
      handleConfirmStake();
    } else if (txType === TxTypes.WITHDRAW) {
      handleConfirmWithdraw();
    }
    setOpenPrivateModal(false);
  };

  const handleConnectWallet = useCallback(() => {
    setOpenWalletAlert(false);

    history.push('/connect');
  }, [setOpenWalletAlert, history]);

  const hideWalletAlert = useCallback(() => {
    setOpenWalletAlert(false);
    setDragReset(true);
  }, [setOpenWalletAlert, setDragReset]);

  const getCooldownPopupContainer = () => {
    return document.getElementsByClassName(
      'share-detail-wrapper',
    )[0] as HTMLElement;
  };

  const getFeeTipPopupContainer = () => {
    return document.getElementsByClassName('fee-paragraph')[0] as HTMLElement;
  };

  const renderPopoverContent = () => (
    <PopoverContent>
      To prevent attacks on the network, you must wait approx 24hrs (17280
      blocks) after each staking event to withdraw assets.
    </PopoverContent>
  );

  // get slip for stake
  const stakeSlip = useMemo(() => {
    const runeAssetAmount = assetAmount(runeAmountToSend.amount());
    const targetAssetAmount = assetAmount(targetAmount.amount());
    const runeBaseAmountValue = assetToBase(runeAssetAmount);
    const targetBaseAmountValue = assetToBase(targetAssetAmount);

    const stakeDataParam = {
      asset: targetBaseAmountValue,
      rune: runeBaseAmountValue,
    };

    const runeBalance = getBaseAmount(R);
    const assetBalance = getBaseAmount(T);
    const poolDataParam = {
      runeBalance,
      assetBalance,
    };
    const stakeSlip = getSlipOnStake(stakeDataParam, poolDataParam);

    return `${stakeSlip.multipliedBy(100).toFixed(2)}%`;
  }, [runeAmountToSend, targetAmount, R, T]);

  const renderShareDetail = () => {
    const tokensData: AssetPair[] = Object.keys(assets).map(tokenName => {
      const tokenData = assets[tokenName];
      const assetStr = tokenData?.asset;
      const asset = assetStr ? getAssetFromString(assetStr) : null;

      return {
        asset: asset?.symbol ?? '',
      };
    });

    // withdraw values
    const withdrawRate: number = withdrawPercentage / 100;
    const { units: stakeUnits }: StakersAssetData = stakersAssetData;

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
      percentage: withdrawPercentage,
    };

    const hasNoStakeUnits = stakeUnitsBN.isEqualTo(0);
    // eslint-disable-next-line quotes
    const hasNoUnitsLabel = "You don't have any shares in this pool.";

    const sourceTokenAmount = baseToToken(runeBaseAmount);
    const sourcePrice = baseToToken(runeBaseAmount)
      .amount()
      .multipliedBy(runePrice);
    const targetTokenAmount = baseToToken(tokenBaseAmount);
    const targetPrice = baseToToken(tokenBaseAmount)
      .amount()
      .multipliedBy(tokenPrice);

    const disableDrag = !hasSufficientBnbFeeInBalance;

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

    const tokenToolTip = 'This is the asset you need to add to the pool.';
    const runeToolTip =
      'The amount of RUNE needed is calculated automatically based on the current ratio of assets in the pool.';

    const addLiquidityTab = (
      <>
        {!isValidFundCaps && (
          <Text type="danger" style={{ paddingTop: '10px' }}>
            95% Funds Cap has been reached. You cannot add right now, come back
            later.
          </Text>
        )}
        <div className="stake-card-wrapper">
          <div className="coin-card-wrapper">
            <CoinCard
              inputProps={{
                'data-test': 'stake-coin-input-target',
                tabIndex: '0',
              }}
              data-test="coin-card-stake-coin-target"
              asset={tokenTicker}
              assetData={tokensData}
              tooltip={tokenToolTip}
              amount={targetAmount}
              price={tokenPrice}
              priceIndex={priceIndex}
              unit={pricePrefix}
              onChangeAsset={handleSelectTraget}
              onChange={handleChangeTokenAmount(tokenSymbol)}
              disabled={!isValidFundCaps}
              withSearch
            />
            <Slider
              value={sliderPercent}
              onChange={handleChangePercent}
              withLabel
              tabIndex="-1"
              disabled={!isValidFundCaps}
            />
          </div>
          {isSymStake && (
            <div className="coin-card-wrapper">
              <CoinCard
                inputProps={{
                  'data-test': 'stake-coin-input-rune',
                  tabIndex: '0',
                }}
                data-test="coin-card-stake-coin-rune"
                asset="rune"
                tooltip={runeToolTip}
                amount={runeAmount}
                price={runePrice}
                priceIndex={priceIndex}
                unit={pricePrefix}
                onChange={handleChangeTokenAmount(RUNE_SYMBOL)}
                disabled={!isValidFundCaps}
              />
            </div>
          )}
        </div>
        <div>
          <Label>SLIP: {stakeSlip}</Label>
          {renderFee()}
        </div>
        <div className="stake-share-info-wrapper">
          <div className="share-status-wrapper">
            <Drag
              title="Drag to add"
              source="blue"
              target="confirm"
              reset={dragReset}
              disabled={disableDrag || !isValidFundCaps}
              onConfirm={handleStake}
              onDrag={handleDrag}
            />
          </div>
        </div>
      </>
    );

    const addAsymTabLabel = `Add ${tokenTicker}`;
    const addSymTabLabel = `Add ${tokenTicker} + RUNE`;

    return (
      <div className="share-detail-wrapper">
        <Tabs withBorder onChange={setSelectedTab} activeKey={selectedTab}>
          <TabPane
            tab={addAsymTabLabel}
            key={TabKeys.ADD_ASYM}
            disabled={!isValidFundCaps}
          >
            {addLiquidityTab}
          </TabPane>
          <TabPane
            tab={addSymTabLabel}
            key={TabKeys.ADD_SYM}
            disabled={!isValidFundCaps}
          >
            {addLiquidityTab}
          </TabPane>
          <TabPane tab="Withdraw" key={TabKeys.WITHDRAW}>
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
              value={withdrawPercentage}
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
                    asset="rune"
                    assetValue={sourceTokenAmount}
                    price={sourcePrice}
                    priceUnit={pricePrefix}
                  />
                  <CoinData
                    asset={tokenTicker}
                    assetValue={targetTokenAmount}
                    price={targetPrice}
                    priceUnit={pricePrefix}
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
                  onConfirm={handleWithdraw}
                  onDrag={handleDrag}
                />
                <div className="cooldown-info">
                  {hasNoStakeUnits && (
                    <Text type="danger">{hasNoUnitsLabel}</Text>
                  )}
                  {!!withdrawDisabled && (
                    <>
                      <Label>
                        You must wait {remainingTimeString} until you can
                        withdraw again.
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  };

  const renderYourShare = () => {
    const assetPrice = validBNOrZero(priceIndex[tokenSymbol]);

    const { units: stakeUnits }: StakersAssetData = stakersAssetData;
    const stakeUnitsBN = bnOrZero(stakeUnits);
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

    const totalRuneValue = baseAmount(runeShare.multipliedBy(runePrice));
    const totalAssetValue = baseAmount(assetShare.multipliedBy(assetPrice));
    const totalValue = baseAmount(
      totalRuneValue.amount().plus(totalAssetValue.amount()),
    );

    const runeStakedPrice = formatBaseAsTokenAmount(totalRuneValue);
    const assetStakedPrice = formatBaseAsTokenAmount(totalAssetValue);
    const totalValuePrice = formatBaseAsTokenAmount(totalValue);

    const hasStake = hasWallet && stakeUnitsBN.isGreaterThan(0);
    const liquidityUnitsAmount = baseAmount(stakeUnits);
    const liquidityUnitsLabel = formatBaseAsTokenAmount(liquidityUnitsAmount);

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
              <div className="your-share-info-wrapper">
                <Label className="share-info-title" size="normal">
                  Your Pool Share
                </Label>
                <div className="share-info-row">
                  <div className="your-share-info">
                    <Status
                      title="Liquidity Units"
                      value={liquidityUnitsLabel}
                      loading={loading}
                    />
                  </div>
                  <div className="your-share-info">
                    <Status
                      title="Pool Share"
                      value={poolShare ? `${formatBN(poolShare)}%` : '...'}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              <div className="your-share-info-wrapper">
                <Label className="share-info-title" size="normal">
                  CURRENT REDEMPTION VALUE
                </Label>
                <div className="share-info-row">
                  <div className="your-share-info">
                    <Status
                      title={tokenTicker.toUpperCase()}
                      value={assetStakedShare}
                      loading={loading}
                    />
                    <Label
                      className="your-share-price-label"
                      size="normal"
                      color="gray"
                      loading={loading}
                    >
                      {`${pricePrefix} ${assetStakedPrice}`}
                    </Label>
                  </div>
                  <div className="your-share-info">
                    <Status
                      title="RUNE"
                      value={runeStakedShare}
                      loading={loading}
                    />
                    <Label
                      className="your-share-price-label"
                      size="normal"
                      color="gray"
                      loading={loading}
                    >
                      {`${pricePrefix} ${runeStakedPrice}`}
                    </Label>
                  </div>
                </div>
                <div className="share-info-row">
                  <div className="your-share-info pool-share-info">
                    <Status
                      title="Total Value"
                      value={`${pricePrefix} ${totalValuePrice}`}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
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
          <h2>Loading of added data for this pool failed.</h2>
          {msg && <p className="placeholder-label">{msg}</p>}
          <p className="placeholder-label">
            {' '}
            You might have to create a pool first.
          </p>
        </div>
      </div>
    );
  };

  const yourShareSpan = hasWallet ? 8 : 24;

  return (
    <ContentWrapper className="pool-stake-wrapper" transparent>
      <Row className="share-view" gutter={8}>
        {!stakersAssetData && stakerPoolDataError && (
          <Col className="your-share-view" md={24}>
            {renderStakeDataPoolError()}
          </Col>
        )}
        {stakersAssetData && hasWallet && (
          <Col className="share-detail-view" span={24} lg={16}>
            {renderShareDetail()}
          </Col>
        )}
        {stakersAssetData && (
          <Col className="your-share-view" span={24} lg={yourShareSpan}>
            {renderYourShare()}
          </Col>
        )}
      </Row>
      {hasWallet && (
        <PrivateModal
          visible={openPrivateModal}
          onOk={handleConfirmTransaction}
          onCancel={handleCancelPrivateModal}
          onPoolAddressLoaded={handlePoolAddressConfirmed}
        />
      )}
      {!hasWallet && (
        <Modal
          title="PLEASE ADD WALLET"
          visible={openWalletAlert}
          onOk={handleConnectWallet}
          onCancel={hideWalletAlert}
          okText="ADD WALLET"
        >
          <Label>Please add a wallet to add liquidity.</Label>
        </Modal>
      )}
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
      poolLoading: state.Midgard.poolLoading,
      stakerPoolData: state.Midgard.stakerPoolData,
      stakerPoolDataLoading: state.Midgard.stakerPoolDataLoading,
      stakerPoolDataError: state.Midgard.stakerPoolDataError,
      transferFees: state.Binance.transferFees,
      thorchainData: state.Midgard.thorchain,
    }),
    {
      getStakerPoolData: midgardActions.getStakerPoolData,
      getPoolDataForAsset: midgardActions.getPoolData,
      getPoolAddress: midgardActions.getPoolAddress,
      setTxResult: appActions.setTxResult,
      setTxTimerModal: appActions.setTxTimerModal,
      setTxHash: appActions.setTxHash,
      resetTxStatus: appActions.resetTxStatus,
      refreshBalance: walletActions.refreshBalance,
      refreshStakes: walletActions.refreshStakes,
    },
  ),
  withRouter,
)(PoolStake);
