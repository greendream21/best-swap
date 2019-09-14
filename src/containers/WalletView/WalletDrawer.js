import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button as AntdButton, notification } from 'antd';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';

import WalletView from './WalletView';
import Button from '../../components/uielements/button';
import Label from '../../components/uielements/label';

import { WalletDrawerWrapper, Drawer } from './WalletDrawer.style';

import walletActions from '../../redux/wallet/actions';

const { forgetWallet } = walletActions;

const WalletDrawer = props => {
  const [visible, setVisible] = useState(false);
  const {
    user: { wallet },
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

  const status = wallet ? 'connected' : 'disconnected';

  return (
    <WalletDrawerWrapper>
      <AntdButton shape="circle" onClick={toggleDrawer}>
        <Icon type="wallet" />
      </AntdButton>
      <Drawer
        placement="right"
        closable={false}
        width={350}
        onClose={onClose}
        visible={visible}
      >
        <WalletView status={status} />
        {wallet && (
          <div className="wallet-address">
            <Icon type="copy" onClick={onCopyWallet} />
            <Label>{wallet}</Label>
          </div>
        )}
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
};

export default connect(
  state => ({
    user: state.Wallet.user,
  }),
  { forgetWallet },
)(WalletDrawer);
