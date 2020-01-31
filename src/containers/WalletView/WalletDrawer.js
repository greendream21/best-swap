import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, notification } from 'antd';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';

import WalletView from './WalletView';
import Button from '../../components/uielements/button';
import Label from '../../components/uielements/label';
import WalletButton from '../../components/uielements/walletButton';

import { WalletDrawerWrapper, Drawer } from './WalletDrawer.style';

import * as walletActions from '../../redux/wallet/actions';

const WalletDrawer = props => {
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const { user, refreshBalance, refreshStake } = props;
  const wallet = user ? user.wallet : null;

  const toggleDrawer = () => {
    if (wallet && visible === false) {
      refreshBalance(wallet);
      refreshStake(wallet);
    }
    setVisible(!visible);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onCopyWallet = () => {
    copy(wallet);
    notification.open({
      message: 'Copy successful!',
    });
  };

  const onClickRefresh = () => {
    if (wallet) {
      refreshBalance(wallet);
      refreshStake(wallet);
    }

    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  };

  const status = wallet ? 'connected' : 'disconnected';

  return (
    <WalletDrawerWrapper>
      <WalletButton
        data-test="wallet-draw-button"
        connected
        value={wallet}
        onClick={toggleDrawer}
      />
      <div className="wallet-mobile-btn" onClick={toggleDrawer}>
        <Icon type="wallet" />
      </div>
      <Drawer
        placement="right"
        closable={false}
        width={350}
        onClose={onClose}
        visible={visible}
      >
        <div className="refresh-balance-icon" onClick={onClickRefresh}>
          <Icon type="sync" spin={refresh} />
        </div>
        <WalletView status={status} />
        <div className="wallet-drawer-tools">
          <Button
            className="forget-btn"
            data-test="wallet-forget-button"
            typevalue="outline"
            color="primary"
            onClick={props.forgetWallet}
          >
            FORGET
          </Button>
          {/* <Button
            className="transaction-btn"
            data-test="wallet-transaction-button"
            typevalue="outline"
            color="warning"
          >
            TRANSACTION
          </Button> */}
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

WalletDrawer.propTypes = {
  user: PropTypes.object, // Maybe<User>
  forgetWallet: PropTypes.func.isRequired,
  refreshBalance: PropTypes.func.isRequired,
  refreshStake: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    user: state.Wallet.user,
  }),
  {
    refreshBalance: walletActions.refreshBalance,
    refreshStake: walletActions.refreshStake,
    forgetWallet: walletActions.forgetWallet,
  },
)(WalletDrawer);
