import React, { useState, useCallback, useEffect, useMemo } from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { SwapOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { TransferResult } from '@thorchain/asgardex-binance';
import {
  bnOrZero,
  isValidBN,
  bn,
  validBNOrZero,
} from '@thorchain/asgardex-util';

import BigNumber from 'bignumber.js';
import * as RD from '@devexperts/remote-data-ts';

import {
  TokenAmount,
  tokenAmount,
  baseToToken,
  BaseAmount,
} from '@thorchain/asgardex-token';
import Text from 'antd/lib/typography/Text';
import Button from '../../components/uielements/button';
import Label from '../../components/uielements/label';
import Drag from '../../components/uielements/drag';
import TokenCard from '../../components/uielements/tokens/tokenCard';
import Modal from '../../components/uielements/modal';
import PrivateModal from '../../components/modals/privateModal';
import { bncClient, asgardexBncClient } from '../../env';

import {
  ContentWrapper,
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
import { getTickerFormat, getSymbolPair } from '../../helpers/stringHelper';
import {
  getSwapData,
  confirmSwap,
  getValidSwapPairs,
  isValidSwap,
} from '../../helpers/utils/swapUtils';
import { SwapData } from '../../helpers/utils/types';

import * as appActions from '../../redux/app/actions';
import * as walletActions from '../../redux/wallet/actions';
import AddressInput from '../../components/uielements/addressInput';
import ContentTitle from '../../components/uielements/contentTitle';
import Slider from '../../components/uielements/slider';
import StepBar from '../../components/uielements/stepBar';
import { Maybe, Nothing, TokenData, FixmeType } from '../../types/bepswap';
import { User, AssetData } from '../../redux/wallet/types';
import { TxStatus, TxTypes, TxResult } from '../../redux/app/types';

import { PriceDataIndex, PoolDataMap } from '../../redux/midgard/types';
import { RootState } from '../../redux/store';
import { getAssetFromString } from '../../redux/midgard/utils';
import { PoolDetailStatusEnum } from '../../types/generated/midgard';
import { TransferFeesRD, TransferFees } from '../../redux/binance/types';
import {
  getAssetDataFromBalance,
  bnbBaseAmount,
} from '../../helpers/walletHelper';
import { RUNE_SYMBOL } from '../../settings/assetData';
import usePrevious from '../../hooks/usePrevious';
import useFee from '../../hooks/useFee';

import { SwapSendView } from './types';
import showNotification from '../../components/uielements/notification';
import { swapRequestUsingWalletConnect } from '../../helpers/utils/trustwalletUtils';
import Loader from '../../components/utility/loaders/pageLoader';
import { CONFIRM_DISMISS_TIME } from '../../settings/constants';

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
    refreshBalance,
    setTxResult,
    setTxHash,
    setTxTimerModal,
    resetTxStatus,
  } = props;

  const { symbolpair } = useParams();
  const swapPair = getSymbolPair(symbolpair);
  const sourceSymbol = swapPair?.source || '';
  const targetSymbol = swapPair?.target || '';

  const runePrice = validBNOrZero(priceIndex[RUNE_SYMBOL]);

  const {
    hasSufficientRuneFee,
    hasSufficientBnbFee,
    hasSufficientBnbFeeInBalance,
    getAmountAfterFee,
    getThresholdAmount,
  } = useFee();

  const history = useHistory();
  const maxSlip = 30;

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
      user && refreshBalance(user.wallet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txStatus]);

  const handleGetSwapData = (): Maybe<SwapData> => {
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
  };

  const swapData = handleGetSwapData();

  const isValidRecipient = async () => {
    return asgardexBncClient.validateAddress(address);
  };

  const handleChangeAddress = useCallback(
    (address: string) => {
      setAddress(address);
    },
    [setAddress],
  );

  /**
   * Check to consider special cases for BNB
   */
  const considerBnb = useMemo((): boolean => {
    return sourceSymbol?.toUpperCase() === 'BNB';
  }, [sourceSymbol]);

  const handleChangePercent = (percent: number) => {
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
  };

  const handleChangeValue = (value: BigNumber) => {
    const newValue = tokenAmount(value);
    const wallet = user ? user.wallet : null;

    // if wallet is disconnected, just set the value
    if (!wallet) {
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
  };

  const handleConfirmSwap = async () => {
    const swapData = handleGetSwapData();

    if (user && sourceSymbol && targetSymbol && swapData) {
      const tokenAmountToSwap = xValue;

      try {
        let response: TransferResult | FixmeType;
        const { slipLimit } = swapData;

        if (user.type === 'walletconnect') {
          response = await swapRequestUsingWalletConnect({
            walletConnect: user.walletConnector,
            bncClient,
            walletAddress: user.wallet,
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
            user.wallet,
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

          // start tx timer
          setTxResult({ status: false });
          handleStartTimer();
        }
      } catch (error) {
        showNotification({
          type: 'error',
          message: 'Swap Invalid',
          description: `Swap information is not valid: ${error.toString()}`,
        });
        setDragReset(true);
        resetTxStatus();
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  const handleConfirmTransaction = () => {
    handleConfirmSwap();
    setOpenPrivateModal(false);
  };

  const handleOpenPrivateModal = useCallback(() => {
    setOpenPrivateModal(true);
  }, [setOpenPrivateModal]);

  const handleCancelPrivateModal = useCallback(() => {
    setOpenPrivateModal(false);
    setDragReset(true);
  }, [setOpenPrivateModal, setDragReset]);

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

  const validateSlip = (slip: BigNumber) => {
    if (slip.isGreaterThanOrEqualTo(maxSlip)) {
      showNotification({
        type: 'error',
        message: 'Swap Invalid',
        description: `Slip ${slip.toFormat(
          2,
          BigNumber.ROUND_DOWN,
        )}% is too high, try less than ${maxSlip}%.`,
      });
      setDragReset(true);
      return false;
    }
    return true;
  };

  /**
   * Handler for moving drag slider to the end
   *
   * That's the point we do first validation
   *
   */
  const handleEndDrag = async () => {
    const wallet = user ? user.wallet : null;

    // Validate existing wallet
    if (!wallet) {
      setOpenWalletAlert(true);
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
    const isValidRecipientValue = await isValidRecipient();
    if (view === SwapSendView.SEND && !isValidRecipientValue) {
      setInvalidAddress(true);
      setDragReset(true);
      return;
    }

    // Validate calculation + slip
    const swapData = handleGetSwapData();
    if (swapData && validateSlip(swapData.slip)) {
      if (wallet) {
        handleOpenPrivateModal();
      } else {
        setInvalidAddress(true);
        setDragReset(true);
      }
    }
  };

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

  const handleChangeSwapType = (toSend: boolean) => {
    const view = toSend ? SwapSendView.SEND : SwapSendView.DETAIL;
    setView(view);
  };

  const handleSwitchSlipProtection = () => {
    setSlipProtection(!slipProtection);
  };

  const handleChangeSource = (asset: string) => {
    const selectedToken = getTickerFormat(asset);
    const target = getTickerFormat(targetSymbol);

    if (sourceSymbol && targetSymbol) {
      const URL =
        selectedToken === target
          ? `/swap/${targetSymbol}:${sourceSymbol}`
          : `/swap/${asset}:${targetSymbol}`;
      history.push(URL);
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `Could not parse target / source pair: ${targetSymbol} / ${sourceSymbol}`,
      );
    }
  };

  const handleSelectTarget = (asset: string) => {
    const selectedToken = getTickerFormat(asset);
    const source = getTickerFormat(sourceSymbol);

    if (sourceSymbol && targetSymbol) {
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
  };

  const handleReversePair = () => {
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
  };

  const handleSelectSourceAmount = (amount: number) => {
    const sourceAsset = getAssetDataFromBalance(assetData, sourceSymbol);

    if (!sourceAsset) {
      return;
    }

    const totalAmount = sourceAsset.assetValue.amount() ?? bn(0);
    // formula (totalAmount * amount) / 100
    const xValueBN = totalAmount.multipliedBy(amount).div(100);
    setXValue(tokenAmount(xValueBN));
  };

  const getPopupContainer = () => {
    return document.getElementsByClassName('slip-protection')[0] as HTMLElement;
  };

  const renderProtectPopoverContent = () => {
    return <PopoverContent>Protect my price (within 3%)</PopoverContent>;
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
      return `${token.amount().toString()} BNB + 1 RUNE`;
    };

    const txtLoading = <Text>Fee: ...</Text>;

    const hasBnbFee = hasSufficientBnbFee(xValue, sourceSymbol);

    return (
      <FeeParagraph>
        {RD.fold(
          () => txtLoading,
          () => txtLoading,
          (_: Error) => <Text>Error: Fee could not be loaded</Text>,
          (fees: TransferFees) => (
            <>
              <Text>Fee: {formatBnbAmount(fees.single)}</Text>
              {considerBnb && hasBnbFee && (
                <Text>
                  {' '}
                  (It will be substructed from your entered BNB value)
                </Text>
              )}
              {bnbAmount && !hasSufficientBnbFeeInBalance && (
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
          ),
        )(transferFees)}
      </FeeParagraph>
    );
  };

  // render
  if (
    !sourceSymbol ||
    !targetSymbol ||
    !Object.keys(poolData).length ||
    !isValidSwap(pools, sourceSymbol, targetSymbol)
  ) {
    return <Loader />;
  }

  const swapSource = getTickerFormat(sourceSymbol);
  const swapTarget = getTickerFormat(targetSymbol);

  // TODO: need to be refactored
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

  // add rune data in the target token list
  tokensData.push({
    asset: RUNE_SYMBOL,
    price: runePrice,
  });

  const { sourceData, targetData } = getValidSwapPairs(
    assetData,
    tokensData,
    sourceSymbol,
    targetSymbol,
  );

  if (!swapData) {
    return <Loader />;
  }
  const { slip, outputAmount, outputPrice } = swapData;

  const sourcePriceBN = bn(priceIndex[sourceSymbol]);
  const sourcePrice = isValidBN(sourcePriceBN) ? sourcePriceBN : outputPrice;
  const targetPriceBN = bn(priceIndex[targetSymbol]);
  const targetPrice = isValidBN(targetPriceBN) ? targetPriceBN : outputPrice;

  const ratio = !targetPrice.isEqualTo(bn(0))
    ? sourcePrice.div(targetPrice)
    : bn(0);
  const ratioLabel = `1 ${swapSource.toUpperCase()} = ${ratio.toFixed(
    3,
  )} ${swapTarget.toUpperCase()}`;

  const disableDrag = !hasSufficientBnbFeeInBalance;

  const slipValue = slip
    ? `SLIP ${slip.toFormat(2, BigNumber.ROUND_DOWN)}%`
    : Nothing;

  // TODO: all components need to be refactored to accept symbols instead of tickers
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
              assetData={targetData}
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
                    content={renderProtectPopoverContent()}
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
            title="Drag to swap"
            source={swapSource}
            target={swapTarget}
            reset={dragReset}
            disabled={disableDrag}
            onConfirm={handleEndDrag}
            onDrag={handleDrag}
          />
        </div>
        {renderFee()}
      </SwapAssetCard>
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
      setTxResult: appActions.setTxResult,
      setTxTimerModal: appActions.setTxTimerModal,
      resetTxStatus: appActions.resetTxStatus,
      setTxHash: appActions.setTxHash,
      refreshBalance: walletActions.refreshBalance,
    },
  ),
  withRouter,
)(SwapSend);
