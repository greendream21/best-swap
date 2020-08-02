import React, { useState, useEffect, useCallback } from 'react';
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
import { client as binanceClient } from '@thorchain/asgardex-binance';
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
  tokenToBase,
} from '@thorchain/asgardex-token';
import Text from 'antd/lib/typography/Text';

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
import { Maybe, Nothing, AssetPair } from '../../types/bepswap';
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
import { BINANCE_NET } from '../../env';
import { TransferFeesRD, TransferFees } from '../../redux/binance/types';
import {
  getAssetFromAssetData,
  bnbBaseAmount,
} from '../../helpers/walletHelper';
import { ShareDetailTabKeys, WithdrawData } from './types';
import showNotification from '../../components/uielements/notification';
import { CONFIRM_DISMISS_TIME } from '../../settings/constants';
import usePrevious from '../../hooks/usePrevious';
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
    getStakerPoolData,
    resetTxStatus,
    setTxResult,
    setTxHash,
    setTxTimerModal,
  } = props;

  const history = useHistory();
  const { symbol = '' } = useParams();

  const [selectedShareDetailTab, setSelectedShareDetailTab] = useState<
    ShareDetailTabKeys
  >(ShareDetailTabKeys.ADD);

  const [widthdrawPercentage, setWithdrawPercentage] = useState(50);
  const [selectRatio, setSelectRatio] = useState<boolean>(true);
  const [runeAmount, setRuneAmount] = useState<TokenAmount>(tokenAmount(0));
  const [targetAmount, setTargetAmount] = useState<TokenAmount>(tokenAmount(0));
  const [runePercent, setRunePercent] = useState<number>(0);

  const [dragReset, setDragReset] = useState<boolean>(true);

  const [openWalletAlert, setOpenWalletAlert] = useState(false);
  const [openPrivateModal, setOpenPrivateModal] = useState(false);

  const [txType, setTxType] = useState<TxTypes>();

  const tokenSymbol = symbol.toUpperCase();
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

  const refreshStakerData = useCallback(() => {
    // get staker info again after finished
    getStakerPoolDetail();

    if (user) {
      const wallet = user.wallet;
      refreshStakes(wallet);
      refreshBalance(wallet);
    }
  }, [getStakerPoolDetail, refreshBalance, refreshStakes, user]);

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
    // TODO: check if it needs to fetch staker detail on mount
    getStakerPoolDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // stakerPoolData needs to be updated whenever pool changed
  useEffect(() => {
    getStakerPoolDetail();
  }, [symbol, getStakerPoolDetail]);

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
        if (totalSourceAmount.isLessThan(valueAsToken.amount())) {
          setRuneAmount(tokenAmount(totalSourceAmount));
          setRunePercent(100);
        } else {
          setRuneAmount(valueAsToken);
        }
      } else if (tokenName !== 'rune') {
        if (totalSourceAmount.isLessThan(valueAsToken.amount())) {
          setTargetAmount(tokenAmount(totalSourceAmount));
        } else {
          setTargetAmount(valueAsToken);
        }
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
      setTxResult({
        status: false,
      });

      const data = getData();
      const bncClient = await binanceClient(BINANCE_NET);

      try {
        const { result } = await stakeRequest({
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
      showNotification({
        type: 'error',
        message: 'Stake Invalid',
        description: 'You need to enter an amount to stake.',
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
        showNotification({
          type: 'error',
          message: 'Invalid BNB value',
          description: 'Not enough BNB to cover the fee for this transaction.',
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
      setTxResult({
        status: false,
      });

      const bncClient = await binanceClient(BINANCE_NET);

      try {
        const percent = withdrawRate * 100;

        const { result } = await withdrawRequest({
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
    const keystore = user ? user.keystore : null;

    if (!wallet) {
      setOpenWalletAlert(true);
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
      return;
    }

    if (keystore) {
      setTxType(TxTypes.WITHDRAW);
      handleOpenPrivateModal();
    } else if (wallet) {
      handleConfirmWithdraw();
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
    setSelectRatio(!selectRatio);
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

  const poolStats = getPoolData('rune', symbol, poolInfo, priceIndex);
  const calcResult = getData();

  const yourShareSpan = hasWallet ? 8 : 24;

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
