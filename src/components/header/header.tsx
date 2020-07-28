import React, { useCallback } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { WalletOutlined } from '@ant-design/icons';

import * as RD from '@devexperts/remote-data-ts';

import Logo from '../uielements/logo';
import TxProgress from '../uielements/txProgress';

import { StyledHeader, LogoWrapper, HeaderActionButtons } from './header.style';
import HeaderSetting from './headerSetting';
import WalletDrawer from '../../containers/WalletView/WalletDrawer';

import ThemeSwitch from '../uielements/themeSwitch';
import WalletButton from '../uielements/walletButton';
import BasePriceSelector from './basePriceSelector';
import { Maybe, Nothing } from '../../types/bepswap';
import { RootState } from '../../redux/store';
import { User } from '../../redux/wallet/types';

import * as appActions from '../../redux/app/actions';
import * as walletActions from '../../redux/wallet/actions';

import { MAX_VALUE } from '../../redux/app/const';
import { TxStatus, TxResult, TxTypes } from '../../redux/app/types';

type ConnectedProps = {
  user: Maybe<User>;
  midgardBasePath: Maybe<string>;
  txStatus: TxStatus;
  txResult: Maybe<TxResult>;
  setTxTimerValue: typeof appActions.setTxTimerValue;
  countTxTimerValue: typeof appActions.countTxTimerValue;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxTimerStatus: typeof appActions.setTxTimerStatus;
  refreshBalance: typeof walletActions.refreshBalance;
  refreshStakes: typeof walletActions.refreshStakes;
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
    setTxTimerValue,
    countTxTimerValue,
    setTxTimerModal,
    setTxTimerStatus,
    refreshBalance,
    refreshStakes,
  } = props;
  const history = useHistory();

  const wallet: Maybe<string> = user ? user.wallet : Nothing;

  const refreshStakerData = useCallback(() => {
    if (wallet) {
      refreshStakes(wallet);
      refreshBalance(wallet);
    }
  }, [refreshBalance, refreshStakes, wallet]);

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
      if (txResult !== null && value < MAX_VALUE) {
        setTxTimerValue(MAX_VALUE);
      }
      // In other cases (no `txResult`) we don't jump to last `indexValue`...
      if (txResult === null) {
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
    // Update `status` from here if modal is hided (not running)
    // to avoid unexptected UX issues within modal (it's final icon won't be visible)
    if (!txStatus.modal) {
      setTxTimerStatus(false);
      if (
        txStatus.type === TxTypes.STAKE ||
        txStatus.type === TxTypes.WITHDRAW
      ) {
        refreshStakerData();
      }
    }
  }, [txStatus, setTxTimerStatus, refreshStakerData]);

  const { status, value, startTime } = txStatus;

  return (
    <StyledHeader>
      <LogoWrapper>
        <Link to="/pools">
          <Logo name="bepswap" type="long" />
        </Link>
        <HeaderSetting midgardBasePath={midgardBasePath} />
      </LogoWrapper>
      <HeaderActionButtons>
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
    </StyledHeader>
  );
};

export default connect(
  (state: RootState) => ({
    txResult: state.App.txResult,
    txStatus: state.App.txStatus,
    user: state.Wallet.user,
    midgardBasePath: RD.toNullable(state.Midgard.apiBasePath),
  }),
  {
    setTxResult: appActions.setTxResult,
    setTxTimerValue: appActions.setTxTimerValue,
    countTxTimerValue: appActions.countTxTimerValue,
    setTxTimerModal: appActions.setTxTimerModal,
    setTxTimerStatus: appActions.setTxTimerStatus,
    refreshBalance: walletActions.refreshBalance,
    refreshStakes: walletActions.refreshStakes,
  },
)(Header);
