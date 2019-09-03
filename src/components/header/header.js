import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import TxView from '../uielements/txView';
import Logo from '../uielements/logo';

import { StyledHeader } from './header.style';
import HeaderSetting from './headerSetting';

import appActions from '../../redux/app/actions';

const { setTxTimerModal } = appActions;

class Header extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    txStatus: PropTypes.object.isRequired,
    setTxTimerModal: PropTypes.func.isRequired,
  };

  handleClickTxView = () => {
    const { setTxTimerModal, txStatus } = this.props;

    if (txStatus.status) {
      setTxTimerModal(true);
    }
  };

  render() {
    const { title, txStatus } = this.props;
    const { status } = txStatus;

    return (
      <StyledHeader>
        <Link to="/">
          <Logo className="header-logo" name="bepswap" type="long" />
        </Link>
        <p className="header-title">{title}</p>
        <div className="header-right">
          <HeaderSetting />
          <TxView start={status} onClick={this.handleClickTxView} />
        </div>
      </StyledHeader>
    );
  }
}

export default compose(
  connect(
    state => ({
      txStatus: state.App.txStatus,
    }),
    {
      setTxTimerModal,
    },
  ),
)(Header);
