import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';
import { WalletOutlined, SyncOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';

import { delay } from '@thorchain/asgardex-util';
import Button from '../../components/uielements/button';
import Label from '../../components/uielements/label';
import WalletButton from '../../components/uielements/walletButton';

import {
  WalletDrawerWrapper,
  Drawer,
} from './WalletDrawer.style';

import * as walletActions from '../../redux/wallet/actions';
import { RootState } from '../../redux/store';
import { User } from '../../redux/wallet/types';
import { Maybe } from '../../types/bepswap';
import WalletView from './WalletView';
import { getAppContainer } from '../../helpers/elementHelper';

type Props = {
  user: Maybe<User>;
  forgetWallet: typeof walletActions.forgetWallet;
  refreshBalance: typeof walletActions.refreshBalance;
  refreshStakes: typeof walletActions.refreshStakes;
};

const WalletDrawer: React.FC<Props> = props => {
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const history = useHistory();

  const { user, refreshBalance, refreshStakes } = props;
  const wallet = user ? user.wallet : null;

  const toggleDrawer = useCallback(() => {
    if (wallet && visible === false) {
      refreshBalance(wallet);
      refreshStakes(wallet);
    }
    setVisible(!visible);
  }, [refreshBalance, refreshStakes, visible, wallet]);

  const onClose = () => {
    setVisible(false);
  };

  const onCopyWallet = useCallback(() => {
    if (wallet) {
      copy(wallet);
      notification.open({
        message: 'Address Copy successful!',
        getContainer: getAppContainer,
      });
    }
  }, [wallet]);

  const onClickRefresh = useCallback(async () => {
    if (wallet) {
      refreshBalance(wallet);
      refreshStakes(wallet);
    }

    setRefresh(true);
    await delay(1000);
    setRefresh(false);
  }, [refreshBalance, refreshStakes, wallet]);

  const handleGotoTransaction = () => {
    onClose();
    history.push('/transaction');
  };

  const status = wallet ? 'connected' : 'disconnected';

  return (
    <WalletDrawerWrapper>
      <WalletButton
        data-test="wallet-draw-button"
        connected
        address={wallet}
        onClick={toggleDrawer}
      />
      <div className="wallet-mobile-btn" onClick={toggleDrawer}>
        <WalletOutlined />
      </div>
      <Drawer
        placement="right"
        closable={false}
        width={350}
        onClose={onClose}
        visible={visible}
      >
        <div className="refresh-balance-icon" onClick={onClickRefresh}>
          <SyncOutlined spin={refresh} />
        </div>
        <WalletView status={status} />
        <div className="wallet-drawer-tools">
          <Button
            className="forget-btn"
            data-test="wallet-forget-button"
            typevalue="outline"
            color="warning"
            onClick={props.forgetWallet}
          >
            FORGET
          </Button>
          <Button
            className="transaction-btn"
            data-test="wallet-transaction-button"
            typevalue="outline"
            color="primary"
            onClick={handleGotoTransaction}
          >
            transactions
          </Button>
        </div>
        {wallet && (
          <div className="wallet-address">
            <Label className="wallet-label-wrapper">{wallet}</Label>
            <div
              className="copy-btn-wrapper"
              onClick={wallet ? onCopyWallet : undefined}
            >
              COPY
            </div>
          </div>
        )}
      </Drawer>
    </WalletDrawerWrapper>
  );
};

export default connect(
  (state: RootState) => ({
    user: state.Wallet.user,
  }),
  {
    refreshBalance: walletActions.refreshBalance,
    refreshStakes: walletActions.refreshStakes,
    forgetWallet: walletActions.forgetWallet,
  },
)(WalletDrawer);
