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

import walletActions from '../../redux/wallet/actions';

const { forgetWallet, refreshBalance, refreshStake } = walletActions;

const WalletDrawer = props => {
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const {
    user: { wallet },
    refreshBalance,
    refreshStake,
  } = props;

  const toggleDrawer = () => {
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
    refreshBalance(wallet);
    refreshStake(wallet);

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
        {wallet && (
          <div className="wallet-address">
            <div className="copy-btn-wrapper">
              <Icon type="copy" onClick={onCopyWallet} />
            </div>
            <Label className="wallet-label-wrapper">{wallet}</Label>
          </div>
        )}
        <WalletView status={status} />
        <Button
          className="forget-btn"
          data-test="wallet-forget-button"
          typevalue="outline"
          color="warning"
          onClick={props.forgetWallet}
        >
          Forget
        </Button>
      </Drawer>
    </WalletDrawerWrapper>
  );
};

WalletDrawer.propTypes = {
  user: PropTypes.object.isRequired,
  forgetWallet: PropTypes.func.isRequired,
  refreshBalance: PropTypes.func.isRequired,
  refreshStake: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    user: state.Wallet.user,
  }),
  {
    refreshBalance,
    refreshStake,
    forgetWallet,
  },
)(WalletDrawer);
