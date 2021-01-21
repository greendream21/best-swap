import React, { useState, useCallback, useEffect, useMemo } from 'react';

import { connect } from 'react-redux';
import { withRouter, useHistory, useParams } from 'react-router-dom';

import {
  SwapOutlined,
  LockOutlined,
  UnlockOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import * as RD from '@devexperts/remote-data-ts';
import { TransferResult } from '@thorchain/asgardex-binance';
import {
  TokenAmount,
  tokenAmount,
  baseToToken,
  BaseAmount,
} from '@thorchain/asgardex-token';
import {
  isValidBN,
  bn,
  assetAmount as aa,
  assetToBase as a2b,
} from '@thorchain/asgardex-util';
import { Popover } from 'antd';
import Text from 'antd/lib/typography/Text';
import BigNumber from 'bignumber.js';
import * as H from 'history';
import { compose } from 'redux';

import Helmet from 'components/helmet';
import PrivateModal from 'components/modals/privateModal';
import SlipVerifyModal from 'components/modals/slipVerifyModal';
import AddressInput from 'components/uielements/addressInput';
import Button from 'components/uielements/button';
import ContentTitle from 'components/uielements/contentTitle';
import Drag from 'components/uielements/drag';
import Label from 'components/uielements/label';
import Modal from 'components/uielements/modal';
import showNotification from 'components/uielements/notification';
import Slider from 'components/uielements/slider';
import TokenCard from 'components/uielements/tokens/tokenCard';
import Loader from 'components/utility/loaders/pageLoader';

import * as appActions from 'redux/app/actions';
import { TxStatus, TxTypes, TxResult } from 'redux/app/types';
import { TransferFeesRD, TransferFees } from 'redux/binance/types';
import * as midgardActions from 'redux/midgard/actions';
import { PriceDataIndex, PoolDataMap } from 'redux/midgard/types';
import { getAssetFromString } from 'redux/midgard/utils';
import { RootState } from 'redux/store';
import * as walletActions from 'redux/wallet/actions';
import { User, AssetData } from 'redux/wallet/types';

import usePrevious from 'hooks/usePrevious';
import usePrice from 'hooks/usePrice';

import { getAppContainer } from 'helpers/elementHelper';
import { getTickerFormat, getSymbolPair } from 'helpers/stringHelper';
import {
  getSwapData,
  confirmSwap,
  getValidSwapPairs,
  isValidSwap,
} from 'helpers/utils/swapUtils';
import { swapRequestUsingWalletConnect } from 'helpers/utils/trustwalletUtils';
import { SwapData } from 'helpers/utils/types';
import {
  getAssetDataFromBalance,
  bnbBaseAmount,
  isValidRecipient,
} from 'helpers/walletHelper';

import { RUNE_SYMBOL } from 'settings/assetData';
import { CONFIRM_DISMISS_TIME } from 'settings/constants';

import { Maybe, Nothing, FixmeType } from 'types/bepswap';
import { PoolDetailStatusEnum } from 'types/generated/midgard';

import { bncClient } from '../../env';
import {
  ContentWrapper,
  SwapAssetCard,
  CardForm,
  CardFormHolder,
  CardFormItem,
  CardFormItemError,
  SwapDataWrapper,
  PopoverContent,
  PopoverContainer,
  FeeParagraph,
  SliderSwapWrapper,
  LabelInfo,
  PopoverIcon,
  InverseButton,
} from './SwapSend.style';
import { SwapSendView } from './types';

const MAX_SLIP_LIMIT = 5;

type Props = {
  history: H.History;
  txResult?: TxResult;
  txStatus: TxStatus;
  assetData: AssetData[];
  poolAddress: string;
  poolData: PoolDataMap;
  pools: string[];
  basePriceAsset: string;
  priceIndex: PriceDataIndex;
  user: Maybe<User>;
  getPoolAddress: typeof midgardActions.getPoolAddress;
  getPoolDataForAsset: typeof midgardActions.getPoolData;
  setTxResult: typeof appActions.setTxResult;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxHash: typeof appActions.setTxHash;
  resetTxStatus: typeof appActions.resetTxStatus;
  refreshBalance: typeof walletActions.refreshBalance;
  transferFees: TransferFeesRD;
};

const SwapSend: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    user,
    transferFees,
    txStatus,
    assetData,
    poolData,
    poolAddress,
    priceIndex,
    pools,
    getPoolAddress,
    getPoolDataForAsset,
    refreshBalance,
    setTxResult,
    setTxHash,
    setTxTimerModal,
    resetTxStatus,
  } = props;

  const history = useHistory();
  const { symbolpair } = useParams();
  const {
    runePrice,
    getAsset1RateInAsset2,
    getFeeEstimation,
    hasSufficientRuneFee,
    hasSufficientBnbFee,
    hasSufficientBnbFeeInBalance,
    getAmountAfterFee,
    getThresholdAmount,
  } = usePrice();

  const [rateType, setRateType] = useState(true);

  const swapPair = getSymbolPair(symbolpair);
  const sourceSymbol = swapPair?.source || '';
  const targetSymbol = swapPair?.target || '';

  // return to home page if swap router is not valid
  if (!sourceSymbol || !targetSymbol) {
    history.push('/pools');
  }

  const swapSource = getTickerFormat(sourceSymbol);
  const swapTarget = getTickerFormat(targetSymbol);
  const walletAddress = useMemo(() => (user ? user.wallet : null), [user]);

  const [visibleSlipConfirmModal, setVisibleSlipConfirmModal] = useState(false);

  // get all enabled pool assets
  const enabledPools: string[] = useMemo(
    () =>
      Object.keys(poolData).reduce(
        (result: string[], tokenName: string) => {
          const tokenData = poolData[tokenName];

          if (tokenData?.status === PoolDetailStatusEnum.Enabled) {
            const asset = getAssetFromString(tokenData?.asset)?.symbol ?? '';
            result.push(asset);
          }
          return result;
        },
        [RUNE_SYMBOL],
      ),
    [poolData],
  );

  // include all pool assets for the source input if wallet is disconnected
  const assetsInWallet: string[] = useMemo(
    () => (walletAddress ? assetData.map(data => data.asset) : enabledPools),
    [assetData, enabledPools, walletAddress],
  );

  // get available swap pairs to show in the dropdown
  const { sourceAssets, targetAssets } = useMemo(
    () =>
      getValidSwapPairs(
        assetsInWallet,
        enabledPools,
        sourceSymbol,
        targetSymbol,
      ),
    [assetsInWallet, enabledPools, sourceSymbol, targetSymbol],
  );

  const [address, setAddress] = useState<string>('');
  const [invalidAddress, setInvalidAddress] = useState<boolean>(false);
  const [dragReset, setDragReset] = useState<boolean>(true);

  const [openPrivateModal, setOpenPrivateModal] = useState<boolean>(false);
  const [openWalletAlert, setOpenWalletAlert] = useState<boolean>(false);
  const [slipProtection, setSlipProtection] = useState<boolean>(true);

  const [xValue, setXValue] = useState<TokenAmount>(tokenAmount(0));
  const [percent, setPercent] = useState<number>(0);

  const [view, setView] = useState<SwapSendView>(SwapSendView.DETAIL);

  const prevTxStatus = usePrevious(txStatus);
  // if tx is completed, should refresh balance
  useEffect(() => {
    if (prevTxStatus?.status === true && txStatus.status === false) {
      walletAddress && refreshBalance(walletAddress);

      const assets = [sourceSymbol, targetSymbol].filter(
        asset => asset !== RUNE_SYMBOL,
      );

      // refresh pool data
      getPoolDataForAsset({ assets });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txStatus]);

  const swapData = useMemo((): Maybe<SwapData> => {
    if (!sourceSymbol || !targetSymbol) {
      return Nothing;
    }

    // calculate the input after 1 RUNE network fee
    const inputValueAfterRune = getAmountAfterFee(xValue, sourceSymbol);

    return getSwapData(
      sourceSymbol,
      targetSymbol,
      poolData,
      inputValueAfterRune,
      runePrice,
    );
  }, [
    poolData,
    runePrice,
    sourceSymbol,
    targetSymbol,
    getAmountAfterFee,
    xValue,
  ]);

  const handleChangeAddress = useCallback(
    (address: string) => {
      setAddress(address);
    },
    [setAddress],
  );

  const handleChangePercent = useCallback(
    (percent: number) => {
      const thresholdAmount = getThresholdAmount(sourceSymbol).amount();

      // formula (totalAmount * percent) / 100
      const newValue = thresholdAmount.multipliedBy(percent).div(100);

      if (thresholdAmount.isLessThan(newValue)) {
        setXValue(tokenAmount(thresholdAmount));
        setPercent(percent);
      } else {
        setXValue(tokenAmount(newValue));
        setPercent(percent);
      }
    },
    [sourceSymbol, getThresholdAmount],
  );

  const handleChangeValue = useCallback(
    (value: BigNumber) => {
      const newValue = tokenAmount(value);

      // if wallet is disconnected, just set the value
      if (!walletAddress) {
        setXValue(newValue);
        return;
      }

      const thresholdAmount = getThresholdAmount(sourceSymbol).amount();

      if (thresholdAmount.isLessThanOrEqualTo(newValue.amount())) {
        setXValue(tokenAmount(thresholdAmount));
        setPercent(100);
      } else {
        setXValue(newValue);
        setPercent(
          newValue
            .amount()
            .multipliedBy(100)
            .div(thresholdAmount)
            .toNumber(),
        );
      }
    },
    [walletAddress, sourceSymbol, getThresholdAmount],
  );

  const handleStartTimer = useCallback(() => {
    const targetAmount = swapData?.outputAmount;

    if (sourceSymbol && targetSymbol && targetAmount) {
      resetTxStatus({
        type: TxTypes.SWAP,
        value: 0,
        modal: true,
        status: true,
        startTime: Date.now(),
        info: symbolpair,
        txData: {
          sourceAsset: sourceSymbol,
          targetAsset: targetSymbol,
          sourceAmount: xValue,
          targetAmount,
        },
      });

      // dismiss modal after 1s
      setTimeout(() => {
        setTxTimerModal(false);
        setDragReset(true);
      }, CONFIRM_DISMISS_TIME);
    }
  }, [
    sourceSymbol,
    targetSymbol,
    swapData,
    xValue,
    symbolpair,
    resetTxStatus,
    setTxTimerModal,
    setDragReset,
  ]);

  const handleConfirmSwap = useCallback(async () => {
    if (user && walletAddress && sourceSymbol && targetSymbol && swapData) {
      const tokenAmountToSwap = xValue;

      try {
        let response: TransferResult | FixmeType;
        const { slipLimit } = swapData;

        if (user.type === 'walletconnect') {
          response = await swapRequestUsingWalletConnect({
            walletConnect: user.walletConnector,
            bncClient,
            walletAddress,
            source: sourceSymbol,
            target: targetSymbol,
            amount: tokenAmountToSwap,
            protectSlip: slipProtection,
            limit: slipLimit,
            poolAddress,
            targetAddress: address,
          });
        } else {
          response = await confirmSwap(
            bncClient,
            walletAddress,
            sourceSymbol,
            targetSymbol,
            tokenAmountToSwap,
            slipProtection,
            slipLimit,
            poolAddress,
            address,
          );
        }

        const result = response?.result ?? [];

        const hash = result[0]?.hash;
        if (hash) {
          setTxHash(hash);

          setOpenPrivateModal(false);
          // start tx timer
          setTxResult({ status: false });
          handleStartTimer();
        }
      } catch (error) {
        setOpenPrivateModal(false);
        showNotification({
          type: 'error',
          message: 'Swap Invalid',
          description: `Error: ${error.toString()}`,
        });
        setDragReset(true);
        resetTxStatus();
        console.error(error); // eslint-disable-line no-console
      }
    }
  }, [
    user,
    walletAddress,
    poolAddress,
    sourceSymbol,
    targetSymbol,
    swapData,
    address,
    xValue,
    slipProtection,
    handleStartTimer,
    resetTxStatus,
    setTxResult,
    setTxHash,
  ]);

  const handleConfirmTransaction = useCallback(() => {
    handleConfirmSwap();
    setOpenPrivateModal(false);
  }, [handleConfirmSwap]);

  const handleOpenSlipConfirmModal = useCallback(() => {
    setVisibleSlipConfirmModal(true);
  }, [setVisibleSlipConfirmModal]);

  const handleCloseSlipConfirmModal = useCallback(() => {
    setVisibleSlipConfirmModal(false);
  }, [setVisibleSlipConfirmModal]);

  const handleOpenPrivateModal = useCallback(() => {
    setOpenPrivateModal(true);
  }, [setOpenPrivateModal]);

  const handleCancelPrivateModal = useCallback(() => {
    setOpenPrivateModal(false);
    setDragReset(true);
  }, [setOpenPrivateModal, setDragReset]);

  const handleConfirmSlip = useCallback(() => {
    handleCloseSlipConfirmModal();
    // if wallet is connected
    if (walletAddress) {
      // get pool address before confirmation
      getPoolAddress();

      handleOpenPrivateModal();
    }
  }, [
    walletAddress,
    getPoolAddress,
    handleOpenPrivateModal,
    handleCloseSlipConfirmModal,
  ]);

  const handleDrag = useCallback(() => {
    setDragReset(false);
  }, [setDragReset]);

  const handleConnectWallet = useCallback(() => {
    setOpenWalletAlert(false);
    history.push('/connect');
  }, [setOpenWalletAlert, history]);

  const hideWalletAlert = useCallback(() => {
    setOpenWalletAlert(false);
    setDragReset(true);
  }, [setOpenWalletAlert, setDragReset]);

  const validateSlip = useCallback(
    (slip: BigNumber) => {
      if (slip.isGreaterThanOrEqualTo(MAX_SLIP_LIMIT)) {
        handleOpenSlipConfirmModal();
        setDragReset(true);
        return false;
      }
      return true;
    },
    [handleOpenSlipConfirmModal],
  );

  /**
   * Handler for moving drag slider to the end
   *
   * That's the point we do first validation
   *
   */
  const handleEndDrag = useCallback(async () => {
    // Validate existing wallet
    if (!walletAddress) {
      setOpenWalletAlert(true);
      setDragReset(true);
      return;
    }

    // Validate amount to swap
    if (xValue.amount().isLessThanOrEqualTo(0)) {
      showNotification({
        type: 'error',
        message: 'Swap Invalid',
        description: 'You need to enter an amount to swap.',
      });
      setDragReset(true);
      return;
    }

    // Check if amount has sufficient RUNE to cover network transaction Fee
    if (!hasSufficientRuneFee(xValue, sourceSymbol)) {
      showNotification({
        type: 'error',
        message: 'Invalid amount',
        description: 'Swap value must exceed 1 RUNE to cover network fee.',
      });
      setDragReset(true);
      return;
    }

    // Check if amount has sufficient BNB for binance tx fee
    if (!hasSufficientBnbFee(xValue, sourceSymbol)) {
      showNotification({
        type: 'error',
        message: 'Invalid BNB value',
        description: 'Not enough BNB to cover the fee for transaction.',
      });
      setDragReset(true);
      return;
    }

    // Validate address to send to
    const isValidRecipientValue = await isValidRecipient(address);
    if (view === SwapSendView.SEND && !isValidRecipientValue) {
      setInvalidAddress(true);
      setDragReset(true);
      return;
    }

    if (swapData && validateSlip(swapData.slip)) {
      // get pool address before confirmation
      getPoolAddress();

      handleOpenPrivateModal();
    }
  }, [
    walletAddress,
    address,
    sourceSymbol,
    view,
    xValue,
    swapData,
    validateSlip,
    getPoolAddress,
    handleOpenPrivateModal,
    hasSufficientBnbFee,
    hasSufficientRuneFee,
  ]);

  // called when pool address is loaded successfully
  const handlePoolAddressConfirmed = useCallback(() => {
    // if private modal is closed, don't process the tx
    if (!openPrivateModal) {
      return;
    }

    // if wallet type is walletconnect, send the swap tx sign request to trustwallet
    if (user?.type === 'walletconnect') {
      handleConfirmSwap();
    }
  }, [user, openPrivateModal, handleConfirmSwap]);

  const handleChangeSwapType = useCallback((toSend: boolean) => {
    const view = toSend ? SwapSendView.SEND : SwapSendView.DETAIL;
    setView(view);
  }, []);

  const handleSwitchSlipProtection = useCallback(() => {
    setSlipProtection(!slipProtection);
  }, [slipProtection]);

  const handleChangeSource = useCallback(
    (asset: string) => {
      const selectedToken = getTickerFormat(asset);
      const target = getTickerFormat(targetSymbol);

      if (sourceSymbol && targetSymbol) {
        setXValue(tokenAmount(0));

        const URL =
          selectedToken === target
            ? `/swap/${targetSymbol}:${sourceSymbol}`
            : `/swap/${asset}:${targetSymbol}`;
        history.push(URL);
      } else {
        console.error(
          `Could not parse target / source pair: ${targetSymbol} / ${sourceSymbol}`,
        );
      }
    },
    [sourceSymbol, targetSymbol, history],
  );

  const handleSelectTarget = useCallback(
    (asset: string) => {
      const selectedToken = getTickerFormat(asset);
      const source = getTickerFormat(sourceSymbol);

      if (sourceSymbol && targetSymbol) {
        setXValue(tokenAmount(0));

        const URL =
          source === selectedToken
            ? `/swap/${targetSymbol}:${sourceSymbol}`
            : `/swap/${sourceSymbol}:${asset}`;
        history.push(URL);
      } else {
        // eslint-disable-next-line no-console
        console.error(
          `Could not parse target / source pair: ${targetSymbol} / ${sourceSymbol}`,
        );
      }
    },
    [sourceSymbol, targetSymbol, history],
  );

  const handleReversePair = useCallback(() => {
    if (sourceSymbol && targetSymbol) {
      setXValue(tokenAmount(0));
      const URL = `/swap/${targetSymbol}:${sourceSymbol}`;
      history.push(URL);
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `Could not parse target / source pair: ${targetSymbol} / ${sourceSymbol}`,
      );
    }
  }, [sourceSymbol, targetSymbol, history]);

  const handleSelectSourceAmount = useCallback(
    (amount: number) => {
      const sourceAsset = getAssetDataFromBalance(assetData, sourceSymbol);

      if (!sourceAsset) {
        return;
      }

      const totalAmount = sourceAsset.assetValue.amount() ?? bn(0);
      // formula (totalAmount * amount) / 100
      const xValueBN = totalAmount.multipliedBy(amount).div(100);
      setXValue(tokenAmount(xValueBN));
    },
    [sourceSymbol, assetData],
  );

  const handleReverseRateType = useCallback(() => {
    setRateType(!rateType);
  }, [rateType]);

  const getPopupContainer = () => {
    return document.getElementsByClassName('slip-protection')[0] as HTMLElement;
  };

  /**
   * Renders fee
   */
  const renderFee = () => {
    const bnbAmount = bnbBaseAmount(assetData);

    const formatBnbAmount = (value: BaseAmount) => {
      const token = baseToToken(value);
      return `${token.amount().toString()} BNB + 1 RUNE`;
    };

    const txtLoading = <Text />;

    // const hasBnbFee = hasSufficientBnbFee(xValue, sourceSymbol);

    const { feeInUSDValue, feePercentValue } = getFeeEstimation({
      asset1: sourceSymbol,
      asset2: targetSymbol,
      amount1: a2b(aa(xValue.amount())),
      amount2: a2b(aa(swapData?.outputAmount?.amount() ?? 0)),
    });
    const totalFeeValue = `${feeInUSDValue} USD (${feePercentValue}%)`;

    return (
      <FeeParagraph>
        {RD.fold(
          () => txtLoading,
          () => txtLoading,
          (_: Error) => <Text>ERROR: FEE NOT LOADED</Text>,
          (fees: TransferFees) => (
            <>
              <LabelInfo>
                <Label>
                  <b>ESTIMATED FEE: </b>
                  {totalFeeValue}
                </Label>
                <Popover
                  content={
                    <>
                      <Label>
                        <b>NETWORK FEE:</b> {formatBnbAmount(fees.single)}
                      </Label>
                      {walletAddress &&
                        bnbAmount &&
                        hasSufficientBnbFeeInBalance && (
                          <Label>
                            <b>NOTE:</b> 0.1 BNB WILL BE LEFT IN YOUR WALLET FOR
                            TRANSACTION FEE.
                          </Label>
                        )}
                    </>
                  }
                  getPopupContainer={getAppContainer}
                  placement="top"
                  overlayStyle={{
                    padding: '6px',
                    animationDuration: '0s !important',
                    animation: 'none !important',
                  }}
                >
                  <PopoverIcon />
                </Popover>
              </LabelInfo>
              {/* {considerBnb && hasBnbFee && (
                <Label>
                  {' '}
                  (IT WILL BE SUBTRACTED FROM YOUR ENTERED BNB VALUE)
                </Label>
              )} */}

              {walletAddress && bnbAmount && !hasSufficientBnbFeeInBalance && (
                <Label type="danger">
                  YOU HAVE {formatBnbAmount(bnbAmount)} IN YOUR WALLET,
                  THAT&lsquo;S NOT ENOUGH TO COVER THE FEE FOR TRANSACTION.
                </Label>
              )}
            </>
          ),
        )(transferFees)}
      </FeeParagraph>
    );
  };

  // render
  if (
    !Object.keys(poolData).length ||
    !isValidSwap(pools, sourceSymbol, targetSymbol) ||
    !swapData
  ) {
    return <Loader />;
  }

  const { slip, outputAmount, outputPrice } = swapData;
  const slipPercent = slip.toNumber();

  const sourcePriceBN = bn(priceIndex[sourceSymbol]);
  const sourcePrice = isValidBN(sourcePriceBN) ? sourcePriceBN : outputPrice;
  const targetPriceBN = bn(priceIndex[targetSymbol]);
  const targetPrice = isValidBN(targetPriceBN) ? targetPriceBN : outputPrice;

  const isSourcePoolEnabled =
    sourceSymbol === RUNE_SYMBOL ||
    poolData?.[sourceSymbol]?.status === PoolDetailStatusEnum.Enabled;
  const isTargetPoolEnabled =
    targetSymbol === RUNE_SYMBOL ||
    poolData?.[targetSymbol]?.status === PoolDetailStatusEnum.Enabled;

  const disableDrag =
    !hasSufficientBnbFeeInBalance ||
    !isSourcePoolEnabled ||
    !isTargetPoolEnabled;

  const slipValue = slip
    ? `${slip.toFormat(2, BigNumber.ROUND_DOWN)}%`
    : Nothing;

  const pageTitle = `Swap ${swapSource.toUpperCase()} to ${swapTarget.toUpperCase()}`;
  const metaDescription = pageTitle;

  const rateValue = getAsset1RateInAsset2({
    asset1: sourceSymbol,
    asset2: targetSymbol,
  });
  const inverseRateValue = getAsset1RateInAsset2({
    asset1: targetSymbol,
    asset2: sourceSymbol,
  });

  return (
    <ContentWrapper className="swap-detail-wrapper">
      <Helmet title={pageTitle} content={metaDescription} />
      <SwapAssetCard>
        <ContentTitle>
          swapping {swapSource} &gt;&gt; {swapTarget}
        </ContentTitle>
        <div className="swap-content">
          <div className="swap-detail-panel">
            <TokenCard
              inputTitle="input"
              asset={swapSource}
              assetData={sourceAssets}
              amount={xValue}
              price={sourcePrice}
              priceIndex={priceIndex}
              onChange={handleChangeValue}
              onChangeAsset={handleChangeSource}
              onSelect={handleSelectSourceAmount}
              inputProps={{ 'data-test': 'coincard-source-input' }}
              withSearch
              data-test="coincard-source"
            />
            <SliderSwapWrapper>
              <div className="slider">
                <Slider
                  value={percent}
                  onChange={handleChangePercent}
                  withLabel
                />
              </div>
              <div className="swap-wrapper">
                <SwapOutlined
                  className="swap-outlined"
                  onClick={handleReversePair}
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
              assetData={targetAssets}
              amount={outputAmount}
              price={targetPrice}
              priceIndex={priceIndex}
              onChangeAsset={handleSelectTarget}
              withSearch
              data-test="coincard-target"
            />

            <div className="swaptool-container">
              <CardFormHolder>
                <CardForm>
                  <CardFormItem className={invalidAddress ? 'has-error' : ''}>
                    <AddressInput
                      value={address}
                      onChange={handleChangeAddress}
                      status={view === SwapSendView.SEND}
                      onStatusChange={handleChangeSwapType}
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
                    content={
                      <PopoverContent>
                        Protect my price (within 3%)
                      </PopoverContent>
                    }
                    getPopupContainer={getPopupContainer}
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
                        onClick={handleSwitchSlipProtection}
                        sizevalue="small"
                        typevalue="outline"
                        focused={slipProtection}
                      >
                        {slipProtection ? <LockOutlined /> : <UnlockOutlined />}
                      </Button>
                    </div>
                  </PopoverContainer>
                </CardForm>
              </CardFormHolder>
            </div>

            <SwapDataWrapper>
              {rateType && (
                <LabelInfo>
                  <Label>
                    <b>{rateValue}</b>
                  </Label>
                  <InverseButton
                    sizevalue="small"
                    typevalue="outline"
                    round="true"
                    onClick={handleReverseRateType}
                  >
                    <RetweetOutlined />
                  </InverseButton>
                </LabelInfo>
              )}
              {!rateType && (
                <LabelInfo>
                  <Label>
                    <b>{inverseRateValue}</b>
                  </Label>
                  <InverseButton
                    sizevalue="small"
                    typevalue="outline"
                    round="true"
                    onClick={handleReverseRateType}
                  >
                    <RetweetOutlined />
                  </InverseButton>
                </LabelInfo>
              )}
              <Label>
                <b>SLIP: </b>
                {slipValue}
              </Label>
              {renderFee()}
            </SwapDataWrapper>
          </div>
        </div>
        <div className="drag-confirm-wrapper">
          <Drag
            title="Drag to swap"
            source={swapSource}
            target={swapTarget}
            reset={dragReset}
            disabled={disableDrag}
            onConfirm={handleEndDrag}
            onDrag={handleDrag}
          />
        </div>
      </SwapAssetCard>
      <PrivateModal
        visible={openPrivateModal}
        onOk={handleConfirmTransaction}
        onCancel={handleCancelPrivateModal}
        onPoolAddressLoaded={handlePoolAddressConfirmed}
      />
      <SlipVerifyModal
        visible={visibleSlipConfirmModal}
        slipPercent={slipPercent}
        onCancel={handleCloseSlipConfirmModal}
        onConfirm={handleConfirmSlip}
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
      pools: state.Midgard.pools,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      transferFees: state.Binance.transferFees,
    }),
    {
      getPoolDataForAsset: midgardActions.getPoolData,
      getPoolAddress: midgardActions.getPoolAddress,
      setTxResult: appActions.setTxResult,
      setTxTimerModal: appActions.setTxTimerModal,
      resetTxStatus: appActions.resetTxStatus,
      setTxHash: appActions.setTxHash,
      refreshBalance: walletActions.refreshBalance,
    },
  ),
  withRouter,
)(SwapSend);
