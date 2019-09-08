import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button as AntdButton } from 'antd';
import { connect } from 'react-redux';

import WalletView from './WalletView';
import Button from '../../components/uielements/button';

import { WalletDrawerWrapper, Drawer } from './WalletDrawer.style';

import walletActions from '../../redux/wallet/actions';

const { forgetWallet } = walletActions;

const WalletDrawer = props => {
  const [visible, setVisible] = useState(false);

  const toggleDrawer = () => {
    setVisible(!visible);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <WalletDrawerWrapper>
      <AntdButton shape="circle" onClick={toggleDrawer}>
        <Icon type="wallet" />
      </AntdButton>
      <Drawer
        placement="right"
        closable={false}
        width={300}
        onClose={onClose}
        visible={visible}
      >
        <WalletView />
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
  forgetWallet: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    user: state.Wallet.user,
  }),
  { forgetWallet },
)(WalletDrawer);
