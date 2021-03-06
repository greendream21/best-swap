import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { connect } from 'react-redux';
import { withRouter, useHistory, useParams, Link } from 'react-router-dom';

import * as RD from '@devexperts/remote-data-ts';
import { TransferResult } from '@thorchain/asgardex-binance';
import {
  TokenAmount,
  tokenAmount,
  baseToToken,
  BaseAmount,
} from '@thorchain/asgardex-token';
import { bn } from '@thorchain/asgardex-util';
import { Alert } from 'antd';
import Text from 'antd/lib/typography/Text';
import BigNumber from 'bignumber.js';
import { compose } from 'redux';

import Helmet from 'components/helmet';
import PrivateModal from 'components/modals/privateModal';
import Button from 'components/uielements/button';
import ContentTitle from 'components/uielements/contentTitle';
import Drag from 'components/uielements/drag';
import Label from 'components/uielements/label';
import Modal from 'components/uielements/modal';
import showNotification from 'components/uielements/notification';
import { TooltipIcon } from 'components/uielements/Popover';
import Slider from 'components/uielements/slider';
import TokenCard from 'components/uielements/tokens/tokenCard';

import { TransferFeesRD, TransferFees } from 'redux/binance/types';
import { PriceDataIndex } from 'redux/midgard/types';
import { RootState } from 'redux/store';
import * as walletActions from 'redux/wallet/actions';
import { User, AssetData } from 'redux/wallet/types';

import useMidgard from 'hooks/useMidgard';
import usePrevious from 'hooks/usePrevious';
import usePrice from 'hooks/usePrice';

import { BINANCE_TX_BASE_URL } from 'helpers/apiHelper';
import { getSwapMemo, getStakeMemo, getWithdrawMemo } from 'helpers/memoHelper';
import { getTickerFormat, getShortAmount } from 'helpers/stringHelper';
import { normalTx } from 'helpers/utils/sendUtils';
import { sendRequestUsingWalletConnect } from 'helpers/utils/trustwalletUtils';
import {
  getAssetDataFromBalance,
  bnbBaseAmount,
  isValidRecipient,
} from 'helpers/walletHelper';

import { RUNE_SYMBOL } from 'settings/assetData';

import { Maybe, FixmeType } from 'types/bepswap';

import { bncClient } from '../../env';
import {
  ContentWrapper,
  SwapAssetCard,
  CardForm,
  CardFormItem,
  CardFormItemError,
  SwapDataWrapper,
  FeeParagraph,
  SliderSwapWrapper,
  LabelInfo,
  Input,
  InputRow,
  FormLabel,
  PoolSelectWrapper,
  PoolSelectLabelWrapper,
  TokenMenu,
  SendTypeWrapper,
  AlertWrapper,
  WithdrawPercent,
  Header,
} from './SendView.style';
import { SendMode } from './types';

type Props = {
  assetData: AssetData[];
  priceIndex: PriceDataIndex;
  user: Maybe<User>;
  transferFees: TransferFeesRD;
  refreshBalance: typeof walletActions.refreshBalance;
};

type MemoType = 'swap' | 'deposit' | 'withdraw';

const SwapSend: React.FC<Props> = (props: Props): JSX.Element => {
  const { user, transferFees, assetData, priceIndex, refreshBalance } = props;

  const history = useHistory();
  const { symbol } = useParams();
  const { hasSufficientBnbFeeInBalance, getThresholdAmount } = usePrice();

  const isRune = symbol === RUNE_SYMBOL;

  const {
    poolAddress,
    poolAddressLoading,
    getPoolAddress,
    pools,
  } = useMidgard();

  const poolSymbols = useMemo(() => {
    return pools.map(pool => pool.split('.')[1]);
  }, [pools]);

  const [sendMode, setSendMode] = useState<SendMode>(SendMode.NORMAL);
  const [poolAddressInput, setPoolAddressInput] = useState<string>(
    poolAddress || '',
  );
  const [selectedPool, setSelectedPool] = useState<string>('BNB');

  const [memoType, setMemoType] = useState<MemoType>('swap');
  const [withdrawPercent, setWithdrawPercent] = useState<number>(10);

  const isExpertMode = useMemo(() => sendMode === SendMode.EXPERT, [sendMode]);

  const handleSelectPool = useCallback((poolAsset: string) => {
    setSelectedPool(poolAsset);
    setMemo('');
  }, []);

  const sourceSymbol = symbol || '';
  const ticker = getTickerFormat(symbol);
  const walletAddress = useMemo(() => (user ? user.wallet : null), [user]);

  const sourceAssets: string[] = useMemo(
    () => (walletAddress ? assetData.map(data => data.asset) : []),
    [assetData, walletAddress],
  );
  const hasAssetInBalance = !!sourceAssets.find(asset => asset === symbol);

  // return to homepage if the router is not valid
  if (!sourceSymbol || !hasAssetInBalance) {
    history.push('/pools');
  }

  const [address, setAddress] = useState<string>('');
  const [invalidAddress, setInvalidAddress] = useState<boolean>(false);
  const [dragReset, setDragReset] = useState<boolean>(true);

  const [openPrivateModal, setOpenPrivateModal] = useState<boolean>(false);
  const [openWalletAlert, setOpenWalletAlert] = useState<boolean>(false);

  const [xValue, setXValue] = useState<TokenAmount>(tokenAmount(0));
  const [percent, setPercent] = useState<number>(0);
  const [memo, setMemo] = useState('');

  const recipientAddress =
    sendMode === SendMode.NORMAL ? address : poolAddressInput;

  useEffect(() => {
    getPoolAddress();
  }, [getPoolAddress]);

  const prevPoolAddressLoading = usePrevious(poolAddressLoading);
  useEffect(() => {
    if (!poolAddressLoading && prevPoolAddressLoading && poolAddress) {
      setPoolAddressInput(poolAddress);
    }
  }, [poolAddress, poolAddressLoading, prevPoolAddressLoading]);

  const handleChangeAddress = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      if (value.toLowerCase() === 'pool') {
        setSendMode(SendMode.EXPERT);
      }
      setAddress(value);
    },
    [setAddress],
  );

  const handleChangeMemo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMemo(e.target.value);
    },
    [setMemo],
  );

  const handleChangeWithdarwPercent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let percentage = Number.isNaN(Number(e.target.value)) ? 0 : Number(e.target.value);

      percentage = percentage > 100 ? 100 : percentage;
      percentage = percentage < 0 ? 0 : percentage;

      setWithdrawPercent(Number(percentage));
      setMemo(getWithdrawMemo(selectedPool, percentage * 100));
    },
    [setWithdrawPercent, selectedPool],
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

  const handleConfirmSend = useCallback(async () => {
    if (user && walletAddress && sourceSymbol && recipientAddress) {
      const tokenAmountToSend = xValue;

      try {
        let response: TransferResult | FixmeType;

        if (user.type === 'walletconnect') {
          response = await sendRequestUsingWalletConnect({
            walletConnect: user.walletConnector,
            bncClient,
            fromAddress: walletAddress,
            toAddress: recipientAddress,
            symbol: sourceSymbol,
            amount: tokenAmountToSend,
            memo,
          });
        } else {
          response = await normalTx({
            bncClient,
            sourceSymbol,
            amount: tokenAmountToSend,
            fromAddress: walletAddress,
            toAddress: recipientAddress,
            memo,
          });
        }

        const result = response?.result ?? [];

        const hash = result[0]?.hash;
        if (hash) {
          const txURL = BINANCE_TX_BASE_URL + hash;
          setOpenPrivateModal(false);
          setDragReset(true);

          // refresh wallet balance after send
          refreshBalance(walletAddress);

          showNotification({
            type: 'open',
            message: 'Send Tx Success.',
            description: 'Transaction sent successfully!',
            btn: (
              <a href={txURL} target="_blank" rel="noopener noreferrer">
                VIEW TX
              </a>
            ),
            duration: 20,
          });
        }
      } catch (error) {
        setOpenPrivateModal(false);
        showNotification({
          type: 'error',
          message: 'Send Invalid',
          description: `${error.toString()}`,
        });
        setDragReset(true);
        console.error(error); // eslint-disable-line no-console
      }
    }
  }, [
    user,
    walletAddress,
    sourceSymbol,
    xValue,
    memo,
    refreshBalance,
    recipientAddress,
  ]);

  const handleConfirmTransaction = useCallback(() => {
    handleConfirmSend();
    setOpenPrivateModal(false);
  }, [handleConfirmSend]);

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

    // Check if amount has sufficient BNB for binance tx fee
    if (!hasSufficientBnbFeeInBalance) {
      showNotification({
        type: 'error',
        message: 'Insufficient BNB amount',
        description: 'Not enough BNB to cover the fee for transaction.',
      });
      setDragReset(true);
      return;
    }

    if (sendMode === SendMode.NORMAL) {
      // Validate address to send to
      const isValidRecipientValue = await isValidRecipient(address);
      if (!isValidRecipientValue) {
        setInvalidAddress(true);
        setDragReset(true);
        showNotification({
          type: 'error',
          message: 'Invalid Recipient Address',
          description: 'Recipient Address is not valid.',
        });
        return;
      }
    } else {
      const isValidRecipientValue = await isValidRecipient(poolAddressInput);
      if (!isValidRecipientValue) {
        setDragReset(true);
        showNotification({
          type: 'error',
          message: 'Invalid Pool Address',
          description: 'Pool Address is not valid.',
        });
        return;
      }
    }

    if (user?.type === 'walletconnect') {
      handleConfirmSend();
    }

    handleOpenPrivateModal();
  }, [
    sendMode,
    user,
    walletAddress,
    address,
    poolAddressInput,
    xValue,
    handleOpenPrivateModal,
    handleConfirmSend,
    hasSufficientBnbFeeInBalance,
  ]);

  const handleChangeSource = useCallback(
    (asset: string) => {
      if (sourceSymbol) {
        setXValue(tokenAmount(0));

        const URL = `/send/${asset}`;
        history.push(URL);
      }
    },
    [sourceSymbol, history],
  );

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

  const handleSelectDepositMemo = useCallback(() => {
    if (selectedPool) {
      setMemo(getStakeMemo(selectedPool));
      setMemoType('deposit');
    }
  }, [selectedPool]);

  const handleSelectSwapMemo = useCallback(() => {
    if (selectedPool) {
      setMemo(getSwapMemo(selectedPool));
      setMemoType('swap');
    }
  }, [selectedPool]);

  const handleSelectWithdrawMemo = useCallback(() => {
    if (selectedPool) {
      setMemo(getWithdrawMemo(selectedPool, withdrawPercent * 100));
      setMemoType('withdraw');
    }
  }, [selectedPool, withdrawPercent]);

  const renderPoolSelect = () => {
    return (
      <PoolSelectWrapper>
        <PoolSelectLabelWrapper>
          <Label size="large" weight="bold">
            Select a Pool
          </Label>
        </PoolSelectLabelWrapper>
        <TokenMenu
          asset={selectedPool}
          assetData={poolSymbols}
          withSearch
          onChangeAsset={handleSelectPool}
        />
      </PoolSelectWrapper>
    );
  };

  const renderSendType = () => {
    return (
      <SendTypeWrapper>
        <Label>Select Memo Type: </Label>
        <Button
          sizevalue="small"
          color="primary"
          typevalue="outline"
          onClick={handleSelectSwapMemo}
        >
          Swap
        </Button>
        <Button
          sizevalue="small"
          color="primary"
          typevalue="outline"
          onClick={handleSelectDepositMemo}
        >
          Deposit
        </Button>
        <Button
          sizevalue="small"
          color="primary"
          typevalue="outline"
          onClick={handleSelectWithdrawMemo}
          focused={memoType === 'withdraw'}
        >
          Withdraw
        </Button>
        {memoType === 'withdraw' && (
          <WithdrawPercent>
            <Input
              value={withdrawPercent}
              onChange={handleChangeWithdarwPercent}
              typevalue="ghost"
              placeholder="Percent"
            />
          </WithdrawPercent>
        )}
      </SendTypeWrapper>
    );
  };

  const formatBnbAmount = (value: BaseAmount) => {
    const token = baseToToken(value);
    return `${token.amount().toString()} BNB`;
  };
  const bnbAmount = bnbBaseAmount(assetData);

  /**
   * Renders fee
   */
  const renderFee = () => {
    const txtLoading = <Text />;
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
                  <b>NETWORK FEE:</b> {formatBnbAmount(fees.single)}
                </Label>
                <TooltipIcon
                  tooltip={
                    <Label>
                      <b>NOTE:</b> 0.1 BNB WILL BE LEFT IN YOUR WALLET FOR
                      TRANSACTION FEE.
                    </Label>
                  }
                />
              </LabelInfo>
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

  const sourcePrice = bn(priceIndex[sourceSymbol]);

  const disableDrag = !hasSufficientBnbFeeInBalance;

  const pageTitle = `Send ${ticker.toUpperCase()}`;
  const metaDescription = pageTitle;

  const renderSendConfirmData = () => {
    const sendAmount = getShortAmount(xValue.amount());
    const sendData = `${sendAmount} ${ticker}`;

    return (
      <SwapDataWrapper>
        <Label>
          <b>Send: </b>
          {sendData.toUpperCase()}
        </Label>
        <Label>
          <b>Recipient: </b>
          {recipientAddress}
        </Label>
        <Label>
          <b>Memo: </b>
          {memo}
        </Label>
        <LabelInfo>
          <Label>
            <b>Network Fee:</b> 0.000375 BNB
          </Label>
          <TooltipIcon
            tooltip={
              <Label>
                <b>NOTE:</b> 0.1 BNB WILL BE LEFT IN YOUR WALLET FOR TRANSACTION
                FEE.
              </Label>
            }
          />
        </LabelInfo>
      </SwapDataWrapper>
    );
  };

  return (
    <ContentWrapper className="swap-detail-wrapper">
      <Helmet title={pageTitle} content={metaDescription} />
      <SwapAssetCard>
        <ContentTitle>
          <Header>
            <div>send {ticker}</div>
            {!isRune && symbol && (
              <Link to={`/swap/${RUNE_SYMBOL}:${symbol.toUpperCase()}`}>
                <Button typevalue="outline">Swap</Button>
              </Link>
            )}
            {isRune && (
              <Button typevalue="outline" disabled>Swap</Button>
            )}
          </Header>
        </ContentTitle>
        <div className="swap-content">
          <div className="swap-detail-panel">
            <TokenCard
              inputTitle="input"
              asset={ticker}
              assetData={sourceAssets}
              amount={xValue}
              price={sourcePrice}
              priceIndex={priceIndex}
              onChange={handleChangeValue}
              onChangeAsset={handleChangeSource}
              onSelect={handleSelectSourceAmount}
              withSearch
            />
            <SliderSwapWrapper>
              <div className="slider">
                <Slider
                  value={percent}
                  onChange={handleChangePercent}
                  withLabel
                  tabIndex="-1"
                />
              </div>
            </SliderSwapWrapper>
            {isExpertMode && renderPoolSelect()}
            <InputRow>
              <CardForm>
                <CardFormItem className={invalidAddress ? 'has-error' : ''}>
                  <FormLabel>Recipient</FormLabel>
                  <Input
                    typevalue="ghost"
                    sizevalue="big"
                    value={recipientAddress}
                    onChange={handleChangeAddress}
                    autoComplete="off"
                    placeholder="Address"
                    disabled={isExpertMode}
                  />
                </CardFormItem>
              </CardForm>
              {invalidAddress && (
                <CardFormItemError>
                  Recipient address is invalid!
                </CardFormItemError>
              )}
            </InputRow>
            {isExpertMode && renderSendType()}
            <InputRow>
              <FormLabel>Memo</FormLabel>
              <Input
                typevalue="ghost"
                sizevalue="big"
                value={memo}
                onChange={handleChangeMemo}
                autoComplete="off"
                placeholder="Memo"
              />
            </InputRow>
            {renderFee()}
          </div>
        </div>
        <div className="drag-confirm-wrapper">
          {isExpertMode && (
            <AlertWrapper>
              <Alert
                message="You are sending an asset to the Pool, Use at own RISK!"
                showIcon
                type="warning"
              />
            </AlertWrapper>
          )}
          <Drag
            title="Drag to send"
            source={ticker}
            target="confirm"
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
      >
        {renderSendConfirmData()}
      </PrivateModal>
      <Modal
        title="PLEASE ADD WALLET"
        visible={openWalletAlert}
        onOk={handleConnectWallet}
        onCancel={hideWalletAlert}
        okText="ADD WALLET"
      >
        <Label>Please add a wallet to send.</Label>
      </Modal>
    </ContentWrapper>
  );
};

export default compose(
  connect(
    (state: RootState) => ({
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      transferFees: state.Binance.transferFees,
    }),
    {
      refreshBalance: walletActions.refreshBalance,
    },
  ),
  withRouter,
)(SwapSend);
