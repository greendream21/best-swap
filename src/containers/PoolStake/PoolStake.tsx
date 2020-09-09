import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Row, Col, Popover } from 'antd';
import {
  InboxOutlined,
  InfoOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
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
import Button from '../../components/uielements/button';
import AddWallet from '../../components/uielements/addWallet';
import PrivateModal from '../../components/modals/privateModal';

import * as appActions from '../../redux/app/actions';
import * as midgardActions from '../../redux/midgard/actions';
import * as walletActions from '../../redux/wallet/actions';

import {
  ContentWrapper,
  Tabs,
  PopoverContainer,
  FeeParagraph,
  PopoverContent,
  PopoverIcon,
} from './PoolStake.style';
import {
  stakeRequest,
  withdrawRequest,
  getCalcResult,
  CalcResult,
  getPoolData,
} from '../../helpers/utils/poolUtils';
import { PoolData } from '../../helpers/utils/types';
import { getTickerFormat } from '../../helpers/stringHelper';
import TokenInfo from '../../components/uielements/tokens/tokenInfo';
import { RootState } from '../../redux/store';
import { User, AssetData } from '../../redux/wallet/types';
import { Maybe, Nothing, AssetPair, FixmeType } from '../../types/bepswap';
import { TxStatus, TxTypes, TxResult } from '../../redux/app/types';
import {
  AssetDetailMap,
  StakerPoolData,
  PoolDataMap,
  PriceDataIndex,
  ThorchainData,
} from '../../redux/midgard/types';
import { StakersAssetData } from '../../types/generated/midgard';
import { getAssetFromString } from '../../redux/midgard/utils';
import { TransferFeesRD, TransferFees } from '../../redux/binance/types';
import { bnbBaseAmount } from '../../helpers/walletHelper';
import { ShareDetailTabKeys, WithdrawData } from './types';
import showNotification from '../../components/uielements/notification';
import {
  stakeRequestUsingWalletConnect,
  withdrawRequestUsingWalletConnect,
} from '../../helpers/utils/trustwalletUtils';
import { CONFIRM_DISMISS_TIME } from '../../settings/constants';
import usePrevious from '../../hooks/usePrevious';
import useFee from '../../hooks/useFee';
import useNetwork from '../../hooks/useNetwork';

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
  priceIndex: PriceDataIndex;
  basePriceAsset: string;
  poolLoading: boolean;
  thorchainData: ThorchainData;
  getStakerPoolData: typeof midgardActions.getStakerPoolData;
  getPoolDataForAsset: typeof midgardActions.getPoolData;
  setTxResult: typeof appActions.setTxResult;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxHash: typeof appActions.setTxHash;
  resetTxStatus: typeof appActions.resetTxStatus;
  refreshBalance: typeof walletActions.refreshBalance;
  refreshStakes: typeof walletActions.refreshStakes;
  transferFees: TransferFeesRD;
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
    priceIndex,
    basePriceAsset,
    thorchainData,
    txStatus,
    refreshBalance,
    refreshStakes,
    getPoolDataForAsset,
    getStakerPoolData,
    resetTxStatus,
    setTxResult,
    setTxHash,
    setTxTimerModal,
  } = props;

  const history = useHistory();
  const { symbol = '' } = useParams();

  const { isValidFundCaps } = useNetwork();

  const [selectedShareDetailTab, setSelectedShareDetailTab] = useState<
    ShareDetailTabKeys
  >(ShareDetailTabKeys.ADD);

  const [widthdrawPercentage, setWithdrawPercentage] = useState(0);
  const [selectRatio, setSelectRatio] = useState<boolean>(true);
  const [runeAmount, setRuneAmount] = useState<TokenAmount>(tokenAmount(0));
  const [targetAmount, setTargetAmount] = useState<TokenAmount>(tokenAmount(0));
  const [runePercent, setRunePercent] = useState<number>(0);

  const [dragReset, setDragReset] = useState<boolean>(true);

  const [openWalletAlert, setOpenWalletAlert] = useState(false);
  const [openPrivateModal, setOpenPrivateModal] = useState(false);

  const [txType, setTxType] = useState<TxTypes>();

  const feeType = useMemo(() => {
    if (
      selectedShareDetailTab === ShareDetailTabKeys.ADD &&
      runeAmount.amount().isGreaterThan(0) &&
      targetAmount.amount().isGreaterThan(0)
    ) {
      return 'multi';
    }
    return 'single';
  }, [selectedShareDetailTab, runeAmount, targetAmount]);

  const {
    bnbFeeAmount,
    hasSufficientBnbFeeInBalance,
    hasSufficientBnbFee,
    getThresholdAmount,
  } = useFee(feeType);

  // TODO: Create custom usePrice hooks
  const runePrice = validBNOrZero(priceIndex[RUNE_SYMBOL]);

  const tokenSymbol = symbol.toUpperCase();
  const tokenTicker = getTickerFormat(symbol);
  const basePriceAssetTicker = getTickerFormat(basePriceAsset).toUpperCase();

  const emptyStakerPoolData: StakersAssetData = {
    asset: tokenSymbol,
    stakeUnits: '0',
    dateFirstStaked: 0,
  };

  const [stakersAssetData, setStakersAssetData] = useState<StakersAssetData>(
    emptyStakerPoolData,
  );

  let withdrawData: Maybe<WithdrawData> = Nothing;

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
      setSelectedShareDetailTab(ShareDetailTabKeys.ADD);
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

  const getData = (): CalcResult => {
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
   * Calculate the output amount to stake based on the input amount and locked status
   * @param assetSymbol input asset symbol
   * @param locked used for manual locked ratio calculation, default = false
   */
  const handleChangeTokenAmount = (assetSymbol: string, locked = false) => (
    value: BigNumber,
  ) => {
    const totalSourceAmount = getThresholdAmount(assetSymbol).amount();
    const totalTokenAmount = getThresholdAmount(tokenSymbol).amount();
    const valueAsToken = tokenAmount(value);

    if (!selectRatio && !locked) {
      if (assetSymbol === RUNE_SYMBOL) {
        if (totalSourceAmount.isLessThan(valueAsToken.amount())) {
          setRuneAmount(tokenAmount(totalSourceAmount));
          setRunePercent(100);
        } else {
          setRuneAmount(valueAsToken);
        }
      } else if (assetSymbol !== RUNE_SYMBOL) {
        if (totalSourceAmount.isLessThan(valueAsToken.amount())) {
          setTargetAmount(tokenAmount(totalSourceAmount));
        } else {
          setTargetAmount(valueAsToken);
        }
      }
      return;
    }

    if (assetSymbol === RUNE_SYMBOL) {
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
    } else if (assetSymbol !== RUNE_SYMBOL) {
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
  const handleChangePercent = (tokenSymbol: string) => (amount: number) => {
    const totalAmount = getThresholdAmount(tokenSymbol).amount();
    const totalTokenAmount = getThresholdAmount(symbol).amount();

    const value = totalAmount.multipliedBy(amount).div(100);

    if (tokenSymbol === RUNE_SYMBOL) {
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
            sourceAmount: runeAmount,
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
      const URL = `/pool/${asset}`;
      setRuneAmount(tokenAmount(0));
      setTargetAmount(tokenAmount(0));
      setRunePercent(0);
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

    // Helper to format BNB amounts properly (we can't use `formatTokenAmountCurrency`)
    // TODO (@Veado) Update `formatTokenAmountCurrency` of `asgardex-token` (now in `asgardex-util`) to accept decimals
    const formatBnbAmount = (value: BaseAmount) => {
      const token = baseToToken(value);
      return `${token.amount().toString()} BNB`;
    };

    const txtLoading = <Text>Fee: ...</Text>;
    const isStakingBNB =
      selectedShareDetailTab === ShareDetailTabKeys.ADD &&
      targetAmount.amount().isGreaterThan(0);

    return (
      <FeeParagraph style={{ paddingTop: '10px' }}>
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
                {isStakingBNB && (
                  <Text> (It will be substructed from BNB amount)</Text>
                )}
                {wallet && bnbAmount && !hasSufficientBnbFeeInBalance && (
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

      const data = getData();

      try {
        let response: TransferResult | FixmeType;

        if (user.type === 'walletconnect') {
          response = await stakeRequestUsingWalletConnect({
            walletConnect: user.walletConnector,
            bncClient,
            walletAddress: user.wallet,
            runeAmount,
            assetAmount: targetAmount,
            poolAddress: data.poolAddress || '',
            symbol: data.symbolTo || '',
          });
        } else {
          response = await stakeRequest({
            bncClient,
            wallet,
            runeAmount,
            tokenAmount: targetAmount,
            poolAddress: data.poolAddress,
            symbolTo: data.symbolTo,
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
          message: 'Stake Invalid',
          description: `${error?.toString() ??
            'Stake information is not valid.'}`,
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

    if (!isValidFundCaps) {
      showNotification({
        type: 'error',
        message: 'Stake Invalid',
        description:
          '90% Funds Cap has been reached. You cannot stake right now, come back later.',
      });
      setDragReset(true);
      return;
    }

    // Validate amounts to stake
    if (
      runeAmount.amount().isLessThanOrEqualTo(0) &&
      targetAmount.amount().isLessThanOrEqualTo(0)
    ) {
      showNotification({
        type: 'error',
        message: 'Stake Invalid',
        description: 'You need to enter an amount to stake.',
      });
      handleCloseModal();
      setDragReset(true);
      return;
    }

    // Validate BNB amount before stake
    // if bnb amount is greater than 0 but doesn't have sufficient fee, cancel the stake
    if (
      targetAmount.amount().isGreaterThan(0) &&
      !hasSufficientBnbFee(targetAmount, symbol)
    ) {
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
      setTxType(TxTypes.STAKE);
      handleOpenPrivateModal();
      if (user?.type === 'walletconnect') {
        handleConfirmStake();
      }
    }
  };

  const handleConfirmWithdraw = async () => {
    const withdrawRate = widthdrawPercentage / 100;

    if (user) {
      const { wallet } = user;

      try {
        const percent = withdrawRate * 100;

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

  const handleWithdraw = () => {
    const wallet = user ? user.wallet : null;

    if (!wallet) {
      setOpenWalletAlert(true);
      setDragReset(true);
      return;
    }

    const runeValue = withdrawData?.runeValue ?? baseAmount(0);
    const runeAmount = baseToToken(runeValue);

    if (runeAmount.amount().isLessThanOrEqualTo(1)) {
      showNotification({
        type: 'error',
        message: 'Invalid amount',
        description:
          'Withdraw amount must exceed 1 RUNE to cover network fees.',
      });
      setDragReset(true);
      return;
    }

    if (widthdrawPercentage > 10) {
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
      if (user?.type === 'walletconnect') {
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
    // if lock status is switched from unlock to lock, re-calculate the output amount again
    if (!selectRatio) {
      handleChangeTokenAmount(RUNE_SYMBOL, true)(runeAmount.amount());
    }
    setSelectRatio(!selectRatio);
  };

  const renderStakeInfo = (poolDetail: PoolData) => {
    const loading = isLoading();

    const { depth, volume24, volumeAT, totalStakers, apy, roi } = poolDetail;

    const attrs = [
      {
        key: 'depth',
        title: 'Depth',
        value: `${basePriceAssetTicker} ${formatBaseAsTokenAmount(depth)}`,
      },
      {
        key: 'vol24',
        title: '24hr Volume',
        value: `${basePriceAssetTicker} ${formatBaseAsTokenAmount(volume24)}`,
      },
      {
        key: 'volAT',
        title: 'All Time Volume',
        value: `${basePriceAssetTicker} ${formatBaseAsTokenAmount(volumeAT)}`,
      },
      {
        key: 'stakers',
        title: 'Total Stakers',
        value: totalStakers.toString(),
      },
      {
        key: 'apy',
        title: 'APY',
        value: `${apy}% APY`,
      },
      {
        key: 'roi',
        title: 'Return To Date',
        value: `${roi}%`,
      },
    ];

    return attrs.map(info => {
      const { title, value, key } = info;

      return (
        <Col className="token-info-card" key={key} xs={12} sm={8} md={6} lg={4}>
          <TokenInfo
            asset="RUNE"
            target={tokenTicker}
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
    const tokenPrice = validBNOrZero(priceIndex[tokenSymbol]);

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

    const ratioText = selectRatio
      ? 'Unlock to set the ratio manually'
      : 'Lock to set the ratio automatically';

    return (
      <div className="share-detail-wrapper">
        <Tabs
          withBorder
          onChange={setSelectedShareDetailTab}
          activeKey={selectedShareDetailTab}
        >
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
                  asset="rune"
                  amount={runeAmount}
                  price={runePrice}
                  priceIndex={priceIndex}
                  unit={basePriceAssetTicker}
                  onChange={handleChangeTokenAmount(RUNE_SYMBOL)}
                />
                <Slider
                  value={runePercent}
                  onChange={handleChangePercent(RUNE_SYMBOL)}
                  withLabel
                  tabIndex="-1"
                />
                <PopoverContainer className="stake-ratio-select">
                  <Popover
                    content={<PopoverContent>{ratioText}</PopoverContent>}
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
                        sizevalue="normal"
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
                  asset={tokenTicker}
                  assetData={tokensData}
                  amount={targetAmount}
                  price={tokenPrice}
                  priceIndex={priceIndex}
                  unit={basePriceAssetTicker}
                  onChangeAsset={handleSelectTraget}
                  onChange={handleChangeTokenAmount(tokenSymbol)}
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
              value={widthdrawPercentage}
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
                    priceUnit={basePriceAssetTicker}
                  />
                  <CoinData
                    asset={tokenTicker}
                    assetValue={targetTokenAmount}
                    price={targetPrice}
                    priceUnit={basePriceAssetTicker}
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

    const assetPrice = validBNOrZero(priceIndex[tokenSymbol]);

    const { stakeUnits }: StakersAssetData = stakersAssetData;
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

    const runeStakedPrice = formatBaseAsTokenAmount(
      baseAmount(runeShare.multipliedBy(runePrice)),
    );
    const assetStakedPrice = formatBaseAsTokenAmount(
      baseAmount(assetShare.multipliedBy(assetPrice)),
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
                      {`${basePriceAssetTicker} ${runeStakedPrice}`}
                    </Label>
                  </div>
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
                      {`${basePriceAssetTicker} ${assetStakedPrice}`}
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
  const poolInfo = poolData[tokenSymbol] || {};
  const assetDetail = assets?.[tokenSymbol] ?? {};

  const poolDetail = getPoolData(
    tokenSymbol,
    poolInfo,
    assetDetail,
    priceIndex,
  );
  const calcResult = getData();

  const yourShareSpan = hasWallet ? 8 : 24;

  return (
    <ContentWrapper className="pool-stake-wrapper" transparent>
      <Row className="stake-info-view">{renderStakeInfo(poolDetail)}</Row>
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
            {renderShareDetail(poolDetail, stakersAssetData, calcResult)}
          </Col>
        )}
      </Row>
      {hasWallet && (
        <>
          <PrivateModal
            visible={openPrivateModal}
            onOk={handleConfirmTransaction}
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
      transferFees: state.Binance.transferFees,
      thorchainData: state.Midgard.thorchain,
    }),
    {
      getStakerPoolData: midgardActions.getStakerPoolData,
      getPoolDataForAsset: midgardActions.getPoolData,
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
