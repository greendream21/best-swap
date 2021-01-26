import React, { useState, useCallback, useMemo } from 'react';

import { connect } from 'react-redux';
import { withRouter, useHistory, useParams } from 'react-router-dom';

import * as RD from '@devexperts/remote-data-ts';
import { TransferResult } from '@thorchain/asgardex-binance';
import {
  TokenAmount,
  tokenAmount,
  baseToToken,
  BaseAmount,
} from '@thorchain/asgardex-token';
import { bn } from '@thorchain/asgardex-util';
import { Popover } from 'antd';
import Text from 'antd/lib/typography/Text';
import BigNumber from 'bignumber.js';
import { compose } from 'redux';

import Helmet from 'components/helmet';
import PrivateModal from 'components/modals/privateModal';
import ContentTitle from 'components/uielements/contentTitle';
import Drag from 'components/uielements/drag';
import Label from 'components/uielements/label';
import Modal from 'components/uielements/modal';
import showNotification from 'components/uielements/notification';
import Slider from 'components/uielements/slider';
import TokenCard from 'components/uielements/tokens/tokenCard';

import { TransferFeesRD, TransferFees } from 'redux/binance/types';
import { PriceDataIndex } from 'redux/midgard/types';
import { RootState } from 'redux/store';
import * as walletActions from 'redux/wallet/actions';
import { User, AssetData } from 'redux/wallet/types';

import usePrice from 'hooks/usePrice';

import { BINANCE_TX_BASE_URL } from 'helpers/apiHelper';
import { getAppContainer } from 'helpers/elementHelper';
import { getTickerFormat, getShortAmount } from 'helpers/stringHelper';
import { normalTx } from 'helpers/utils/sendUtils';
import { sendRequestUsingWalletConnect } from 'helpers/utils/trustwalletUtils';
import {
  getAssetDataFromBalance,
  bnbBaseAmount,
  isValidRecipient,
} from 'helpers/walletHelper';

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
  PopoverIcon,
  Input,
  FormLabel,
} from './SendView.style';

type Props = {
  assetData: AssetData[];
  priceIndex: PriceDataIndex;
  user: Maybe<User>;
  transferFees: TransferFeesRD;
  refreshBalance: typeof walletActions.refreshBalance;
};

const SwapSend: React.FC<Props> = (props: Props): JSX.Element => {
  const { user, transferFees, assetData, priceIndex, refreshBalance } = props;

  const history = useHistory();
  const { symbol } = useParams();
  const {
    hasSufficientBnbFee,
    hasSufficientBnbFeeInBalance,
    getThresholdAmount,
  } = usePrice();

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

  const handleChangeAddress = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(e.target.value);
    },
    [setAddress],
  );

  const handleChangeMemo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMemo(e.target.value);
    },
    [setMemo],
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
    if (user && walletAddress && sourceSymbol) {
      const tokenAmountToSend = xValue;

      try {
        let response: TransferResult | FixmeType;

        if (user.type === 'walletconnect') {
          response = await sendRequestUsingWalletConnect({
            walletConnect: user.walletConnector,
            bncClient,
            fromAddress: walletAddress,
            toAddress: address,
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
            toAddress: address,
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
    address,
    xValue,
    memo,
    refreshBalance,
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
    if (!hasSufficientBnbFee(xValue, sourceSymbol)) {
      showNotification({
        type: 'error',
        message: 'Insufficient BNB amount',
        description: 'Not enough BNB to cover the fee for transaction.',
      });
      setDragReset(true);
      return;
    }

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

    handleOpenPrivateModal();
  }, [
    walletAddress,
    address,
    sourceSymbol,
    xValue,
    handleOpenPrivateModal,
    hasSufficientBnbFee,
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
                <Popover
                  content={
                    <Label>
                      <b>NOTE:</b> 0.1 BNB WILL BE LEFT IN YOUR WALLET FOR
                      TRANSACTION FEE.
                    </Label>
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
          <b>SEND: </b>
          {sendData}
        </Label>
        <Label>
          <b>RECIPIENT: </b>
          {address}
        </Label>
        <Label>
          <b>MEMO: </b>
          {memo}
        </Label>
        <LabelInfo>
          <Label>
            <b>NETWORK FEE:</b> 0.000375 BNB
          </Label>
          <Popover
            content={
              <Label>
                <b>NOTE:</b> 0.1 BNB WILL BE LEFT IN YOUR WALLET FOR TRANSACTION
                FEE.
              </Label>
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
      </SwapDataWrapper>
    );
  };

  return (
    <ContentWrapper className="swap-detail-wrapper">
      <Helmet title={pageTitle} content={metaDescription} />
      <SwapAssetCard>
        <ContentTitle>send {ticker}</ContentTitle>
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
                />
              </div>
            </SliderSwapWrapper>
            <div className="swaptool-container">
              <CardForm>
                <CardFormItem className={invalidAddress ? 'has-error' : ''}>
                  <FormLabel>Recipient</FormLabel>
                  <Input
                    typevalue="ghost"
                    sizevalue="normal"
                    value={address}
                    onChange={handleChangeAddress}
                    autoComplete="off"
                    placeholder="Address"
                  />
                </CardFormItem>
              </CardForm>
              {invalidAddress && (
                <CardFormItemError>
                  Recipient address is invalid!
                </CardFormItemError>
              )}
            </div>
            <FormLabel>Memo</FormLabel>
            <Input
              typevalue="ghost"
              sizevalue="normal"
              value={memo}
              onChange={handleChangeMemo}
              autoComplete="off"
              placeholder="memo"
            />
            {renderFee()}
          </div>
        </div>
        <div className="drag-confirm-wrapper">
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
