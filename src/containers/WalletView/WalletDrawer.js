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

const { forgetWallet, refreshBalance } = walletActions;

const WalletDrawer = props => {
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const {
    user: { wallet },
    refreshBalance,
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
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  };

  const status = wallet ? 'connected' : 'disconnected';

  return (
    <WalletDrawerWrapper>
      <WalletButton connected value={wallet} onClick={toggleDrawer} />
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
};

export default connect(
  state => ({
    user: state.Wallet.user,
  }),
  {
    refreshBalance,
    forgetWallet,
  },
)(WalletDrawer);
