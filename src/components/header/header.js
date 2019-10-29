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

import appActions from '../../redux/app/actions';
import WalletButton from '../uielements/walletButton';

const { TabPane } = Tabs;

const { setTxTimerModal } = appActions;

class Header extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    txStatus: PropTypes.object.isRequired,
    setTxTimerModal: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = {
    activeTab: 'swap',
  };

  handleClickTxView = () => {
    const { setTxTimerModal } = this.props;

    setTxTimerModal(true);
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
      {
        type: 'trade',
        key: 'trade',
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

  handleChangeTab = type => activeTab => {
    if (type) {
      const URL = `/${activeTab}`;

      this.props.history.push(URL);
    } else {
      this.setState({
        activeTab,
      });
    }
  };

  renderHeader = () => {
    const type = this.getPageType();
    const { activeTab } = this.state;
    const active = type || activeTab;

    console.log('type ', type);
    const swapTab = (
      <span>
        <Icon type="swap" />
        swap
      </span>
    );
    const poolsTab = (
      <span>
        <Icon type="database" theme="filled" />
        stake
      </span>
    );
    const tradeTab = (
      <span>
        <Icon type="area-chart" />
        trade
      </span>
    );

    return (
      <div className="header-tab-container">
        <Tabs
          data-test="action-tabs"
          activeKey={active}
          onChange={this.handleChangeTab(type)}
          action
        >
          <TabPane tab={swapTab} key="swap" />
          <TabPane tab={poolsTab} key="pools" />
          <TabPane tab={tradeTab} key="trade" />
        </Tabs>
      </div>
    );
  };

  render() {
    const { txStatus, user } = this.props;
    const { status } = txStatus;
    const { wallet } = user;
    const connected = !!wallet;

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
  withRouter,
)(Header);
