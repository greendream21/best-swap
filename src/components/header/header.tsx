import React, { useCallback, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Alert } from 'antd';
import { WalletOutlined } from '@ant-design/icons';

import * as RD from '@devexperts/remote-data-ts';

import Logo from '../uielements/logo';
import TxProgress from '../uielements/txProgress';
import ConfirmModal from '../modals/confirmModal';
import showNotification from '../uielements/notification';

import {
  StyledAlertWrapper,
  StyledHeader,
  LogoWrapper,
  HeaderActionButtons,
} from './header.style';
import HeaderSetting from './headerSetting';
import WalletDrawer from '../../containers/WalletView/WalletDrawer';

import Label from '../uielements/label';
import ThemeSwitch from '../uielements/themeSwitch';
import WalletButton from '../uielements/walletButton';
import BasePriceSelector from './basePriceSelector';
import { Maybe, Nothing, Pair } from '../../types/bepswap';

import { RootState } from '../../redux/store';
import { User } from '../../redux/wallet/types';
import { TransferEventRD } from '../../redux/binance/types';

import * as appActions from '../../redux/app/actions';
import * as binanceActions from '../../redux/binance/actions';

import { MAX_VALUE } from '../../redux/app/const';
import { TxStatus, TxResult, TxTypes } from '../../redux/app/types';
import { getNet, isMainnet } from '../../env';
import useNetwork from '../../hooks/useNetwork';

import { getSymbolPair } from '../../helpers/stringHelper';
import {
  getBetaConfirm,
  saveBetaConfirm,
} from '../../helpers/webStorageHelper';
import { getTxResult } from '../../helpers/utils/swapUtils';
import {
  withdrawResult,
  WithdrawResultParams,
} from '../../helpers/utils/poolUtils';

type ConnectedProps = {
  user: Maybe<User>;
  midgardBasePath: Maybe<string>;
  txStatus: TxStatus;
  txResult: Maybe<TxResult>;
  wsTransferEvent: TransferEventRD;
  getBEPSwapData: typeof appActions.getBEPSwapData;
  setTxTimerValue: typeof appActions.setTxTimerValue;
  countTxTimerValue: typeof appActions.countTxTimerValue;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxTimerStatus: typeof appActions.setTxTimerStatus;
  resetTxStatus: typeof appActions.resetTxStatus;
  setTxResult: typeof appActions.setTxResult;
  subscribeBinanceTransfers: typeof binanceActions.subscribeBinanceTransfers;
  unSubscribeBinanceTransfers: typeof binanceActions.unSubscribeBinanceTransfers;
};

type ComponentProps = {
  title: string;
};

type Props = ConnectedProps & ComponentProps;

const Header: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    user,
    midgardBasePath,
    txStatus,
    txResult,
    wsTransferEvent,
    getBEPSwapData,
    setTxTimerValue,
    countTxTimerValue,
    setTxTimerModal,
    setTxTimerStatus,
    resetTxStatus,
    setTxResult,
    subscribeBinanceTransfers,
    unSubscribeBinanceTransfers,
  } = props;
  const history = useHistory();
  const hasBetaConfirmed = getBetaConfirm();

  const { globalRuneStakeStatus } = useNetwork();

  const wallet: Maybe<string> = user ? user.wallet : Nothing;
  const { status, value, startTime, hash, info, type: txType } = txStatus;

  // when the page loaded first time
  useEffect(() => {
    getBEPSwapData();
    if (wallet) {
      subscribeBinanceTransfers({ address: wallet, net: getNet() });
      return () => {
        unSubscribeBinanceTransfers();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when user wallet changes, subscribe Websocket again
  useEffect(() => {
    // subscribe again if another wallet has been added
    if (wallet) {
      unSubscribeBinanceTransfers();
      subscribeBinanceTransfers({ address: wallet, net: getNet() });
    }
  }, [wallet, subscribeBinanceTransfers, unSubscribeBinanceTransfers]);

  // wsTransferEvent has been updated
  useEffect(() => {
    const currentWsTransferEvent = RD.toNullable(wsTransferEvent);

    if (
      currentWsTransferEvent &&
      hash !== undefined &&
      txResult?.status === false &&
      wallet
    ) {
      const transferHash = currentWsTransferEvent?.data?.H;

      if (txType === TxTypes.SWAP) {
        const pair: Pair = getSymbolPair(info);

        if (txStatus.status) {
          const txResultData = getTxResult({
            pair,
            tx: currentWsTransferEvent,
            address: wallet,
          });

          if (txResultData) {
            setTxResult({
              status: true,
              ...txResultData,
            });
          }
        }
      }
      if (txType === TxTypes.STAKE) {
        if (transferHash === hash) {
          // Stake TX with same tx hash is detected
          // DO SOMETHING
        }
      }
      if (txType === TxTypes.WITHDRAW) {
        const withdrawTxRes = withdrawResult({
          tx: currentWsTransferEvent,
          symbol: info,
          address: wallet,
        } as WithdrawResultParams);

        // if withdraw hash has been detected, set tx status as TRUE
        if (withdrawTxRes) {
          setTxResult({
            status: true,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RD.toNullable(wsTransferEvent), wallet, txResult, txStatus]);

  const handleClickTxProgress = useCallback(() => {
    if (txStatus.type !== undefined) {
      setTxTimerModal(true);
    } else {
      history.push('/transaction');
    }
  }, [setTxTimerModal, txStatus, history]);

  const handleChangeTxProgress = () => {
    const { value, type: txType, hash } = txStatus;
    if (txType === TxTypes.SWAP) {
      // Count handling depends on `txResult`
      // If tx has been confirmed, then we jump to last `valueIndex` ...
      if (txResult?.status && value < MAX_VALUE) {
        setTxTimerValue(MAX_VALUE);
      }
      // In other cases (no `txResult`) we don't jump to last `indexValue`...
      if (!txResult?.status) {
        // ..., but we are still counting
        if (value < 75) {
          // Add a quarter
          countTxTimerValue(25);
        } else if (value >= 75 && value < 95) {
          // With last quarter we just count a little bit to signalize still a progress
          countTxTimerValue(0.75);
        }
      }
    } else if (txType === TxTypes.WITHDRAW) {
      // If tx has been confirmed finally,
      // then we jump to last `valueIndex` ...
      if (txResult?.status && value < MAX_VALUE) {
        setTxTimerValue(MAX_VALUE);
      }
      // In other cases (no `txResult`) we don't jump to last `indexValue`...
      if (!txResult?.status) {
        // ..., but we are still counting
        if (value < 75) {
          // Add a quarter
          countTxTimerValue(25);
        } else if (value >= 75 && value < 95) {
          // With last quarter we just count a little bit to signalize still a progress
          countTxTimerValue(1);
        }
      }
    } else if (txType === TxTypes.STAKE) {
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
    } else if (txType === TxTypes.CREATE) {
      // pool create tx
      countTxTimerValue(25);
    }
  };

  const handleEndTxProgress = useCallback(() => {
    setTxTimerStatus(false);
  }, [setTxTimerStatus]);

  const handleCloseModal = () => {
    // hide modal
    setTxTimerModal(false);

    if (txType === TxTypes.CREATE) {
      showNotification({
        type: 'open',
        message: 'Pool Created Successfully!',
        description:
          'It may take a few moments until a new pool appears in the pool list!',
      });
    }
  };

  const handleFinishModal = () => {
    handleCloseModal();
    resetTxStatus();
  };

  return (
    <>
      {isMainnet && !hasBetaConfirmed && (
        <StyledAlertWrapper>
          <Alert
            message="Warning"
            description="This product is in beta. Do not stake or swap large amounts of funds."
            showIcon
            closable
            type="warning"
            onClose={() => saveBetaConfirm(true)}
          />
        </StyledAlertWrapper>
      )}
      <StyledHeader>
        <LogoWrapper>
          <Link to="/pools">
            <Logo name="bepswap" type="long" />
          </Link>
          <HeaderSetting midgardBasePath={midgardBasePath} />
        </LogoWrapper>
        <HeaderActionButtons>
          <Label className="global-rune-stake-status">
            {globalRuneStakeStatus}
          </Label>
          {!wallet && (
            <Link to="/connect">
              <WalletButton
                data-test="add-wallet-button"
                connected={false}
                address={wallet}
              />
            </Link>
          )}
          {!wallet && (
            <Link to="/connect">
              <div className="wallet-mobile-btn">
                <WalletOutlined />
              </div>
            </Link>
          )}
          {wallet && <WalletDrawer />}
          <ThemeSwitch />
          <BasePriceSelector />
          {wallet && (
            <TxProgress
              status={status}
              value={value}
              maxValue={MAX_VALUE}
              maxSec={45}
              startTime={startTime}
              onClick={handleClickTxProgress}
              onChange={handleChangeTxProgress}
              onEnd={handleEndTxProgress}
            />
          )}
        </HeaderActionButtons>
        <ConfirmModal
          txStatus={txStatus}
          txResult={txResult || {}}
          onClose={handleCloseModal}
          onFinish={handleFinishModal}
        />
      </StyledHeader>
    </>
  );
};

export default connect(
  (state: RootState) => ({
    txResult: state.App.txResult,
    txStatus: state.App.txStatus,
    user: state.Wallet.user,
    midgardBasePath: RD.toNullable(state.Midgard.apiBasePath),
    wsTransferEvent: state.Binance.wsTransferEvent,
  }),
  {
    getBEPSwapData: appActions.getBEPSwapData,
    setTxResult: appActions.setTxResult,
    setTxTimerValue: appActions.setTxTimerValue,
    countTxTimerValue: appActions.countTxTimerValue,
    setTxTimerModal: appActions.setTxTimerModal,
    setTxTimerStatus: appActions.setTxTimerStatus,
    resetTxStatus: appActions.resetTxStatus,
    subscribeBinanceTransfers: binanceActions.subscribeBinanceTransfers,
    unSubscribeBinanceTransfers: binanceActions.unSubscribeBinanceTransfers,
  },
)(Header);
