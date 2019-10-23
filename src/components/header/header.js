import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import TxView from '../uielements/txView';
import Logo from '../uielements/logo';

import { StyledHeader, LogoWrapper, HeaderActionButtons } from './header.style';
import HeaderSetting from './headerSetting';
import WalletDrawer from '../../containers/WalletView/WalletDrawer';

import appActions from '../../redux/app/actions';
import WalletButton from '../uielements/walletButton';

const { setTxTimerModal } = appActions;

class Header extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    txStatus: PropTypes.object.isRequired,
    setTxTimerModal: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  handleClickTxView = () => {
    const { setTxTimerModal } = this.props;
    setTxTimerModal(true);
  };

  render() {
    const { txStatus, user } = this.props;
    const { status } = txStatus;
    const { wallet } = user;
    const connected = !!wallet;

    return (
      <StyledHeader>
        <LogoWrapper>
          <Link to="/">
            <Logo name="bepswap" type="long" />
          </Link>
        </LogoWrapper>
        <HeaderActionButtons>
          {!connected && (
            <Link to="/connect">
              <WalletButton
                data-test="add-wallet-button"
                connected={connected}
                value={wallet}
              />
            </Link>
          )}
          {connected && <WalletDrawer />}
          <HeaderSetting />
          {connected && (
            <TxView start={status} onClick={this.handleClickTxView} />
          )}
        </HeaderActionButtons>
      </StyledHeader>
    );
  }
}

export default compose(
  connect(
    state => ({
      txStatus: state.App.txStatus,
      user: state.Wallet.user,
    }),
    {
      setTxTimerModal,
    },
  ),
)(Header);
