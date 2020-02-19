import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Tooltip, Icon } from 'antd';

import Tabs from '../uielements/tabs';
import TxView from '../uielements/txView';
import Logo from '../uielements/logo';

import { StyledHeader, LogoWrapper, HeaderActionButtons } from './header.style';
import HeaderSetting from './headerSetting';
import WalletDrawer from '../../containers/WalletView/WalletDrawer';

import { setTxTimerModal, setTxTimerStatus } from '../../redux/app/actions';
import WalletButton from '../uielements/walletButton';
import BasePriceSelector from './basePriceSelector';
import { MAX_VALUE } from '../../redux/app/const';

const { TabPane } = Tabs;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'swap',
    };
  }

  handleClickTxView = () => {
    const { setTxTimerModal } = this.props;

    setTxTimerModal(true);
  };

  handleEndTxView = () => {
    const {
      setTxTimerStatus,
      txStatus: { modal },
    } = this.props;
    // Update `status` from here if modal is hided (not running)
    // to avoid unexptected UX issues within modal (it's final icon won't be visible)
    if (!modal) {
      setTxTimerStatus(false);
    }
  };

  getPageType = () => {
    const url = window.location.pathname;
    if (url === '/') return 'swap';

    const pageTypes = [
      {
        type: 'swap',
        key: 'swap',
      },
      {
        type: 'pool',
        key: 'pools',
      },
    ];
    let pageType = '';

    pageTypes.forEach(data => {
      const { type, key } = data;

      if (url.includes(type)) {
        pageType = key;
      }
    });

    return pageType;
  };

  handleChangeTab = activeTab => {
    const url = window.location.pathname;
    if (!url.includes('/introduction')) {
      const URL = `/${activeTab}`;

      this.props.history.push(URL);
    } else {
      const URL = `/introduction/${activeTab}`;

      this.props.history.push(URL);
    }
  };

  renderHeader = () => {
    const type = this.getPageType();
    const { activeTab } = this.state;
    const active = type || activeTab;

    const swapTab = (
      <Link to="/swap">
        <span>
          <Icon type="swap" />
          swap
        </span>
      </Link>
    );
    const poolsTab = (
      <Link to="/pools">
        <span>
          <Icon type="database" theme="filled" />
          stake
        </span>
      </Link>
    );

    return (
      <div className="header-tab-container">
        <Tabs
          data-test="action-tabs"
          activeKey={active}
          onChange={this.handleChangeTab}
          action
        >
          <TabPane tab={swapTab} key="swap" />
          <TabPane tab={poolsTab} key="pools" />
        </Tabs>
      </div>
    );
  };

  render() {
    const { txStatus, user } = this.props;
    const { status, value, type } = txStatus;
    const wallet = user ? user.wallet : null;
    const connected = wallet !== null;

    const intro = (
      <Link to="/introduction">
        <Tooltip title="Introduction?">
          <Button shape="circle" size="small" icon="question" />
        </Tooltip>
      </Link>
    );

    return (
      <StyledHeader>
        <LogoWrapper>
          <Link to="/">
            <Logo name="bepswap" type="long" />
          </Link>
          {intro}
        </LogoWrapper>
        {this.renderHeader()}
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
          {!connected && (
            <Link to="/connect">
              <div className="wallet-mobile-btn">
                <Icon type="wallet" />
              </div>
            </Link>
          )}
          {connected && <WalletDrawer />}
          <BasePriceSelector />
          <HeaderSetting />
          {connected && (
            <TxView
              status={status}
              value={value}
              maxValue={MAX_VALUE}
              className={type === undefined ? 'disabled' : ''}
              onClick={type !== undefined ? this.handleClickTxView : undefined}
              onEnd={this.handleEndTxView}
            />
          )}
        </HeaderActionButtons>
      </StyledHeader>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  txStatus: PropTypes.object.isRequired,
  setTxTimerModal: PropTypes.func.isRequired,
  setTxTimerStatus: PropTypes.func.isRequired,
  user: PropTypes.object, // Maybe<User>
  history: PropTypes.object.isRequired,
};

export default compose(
  connect(
    state => ({
      txStatus: state.App.txStatus,
      user: state.Wallet.user,
    }),
    {
      setTxTimerModal,
      setTxTimerStatus,
    },
  ),
  withRouter,
)(Header);
