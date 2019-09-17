import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';

import { ActionViewWrapper } from './ActionView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';
import { headerData } from './data';

import { SwapIntro, SwapView, SwapSend } from '../Swap';
import { PoolIntro, PoolView, PoolStake, PoolCreate } from '../Pool';
import { TradeIntro, TradeView, TradeDetail } from '../Trade';
import ViewHeader from '../../components/uielements/viewHeader';
import ConnectView from '../ConnectView';
import StatsView from '../StatsView';
import FaqsView from '../FaqsView';
import NetworkView from '../NetworkView';
import TutorialView from '../TutorialView';

import walletActions from '../../redux/wallet/actions';

const { refreshBalance, refreshStake } = walletActions;

const { TabPane } = Tabs;

class ActionView extends Component {
  static propTypes = {
    type: PropTypes.string,
    view: PropTypes.string,
    info: PropTypes.string,
    user: PropTypes.object.isRequired,
    refreshBalance: PropTypes.func.isRequired,
    refreshStake: PropTypes.func.isRequired,
  };

  static defaultProps = {
    type: '',
    view: 'view',
    info: '',
  };

  state = {
    activeTab: 'swap',
  };

  componentDidMount() {
    const { user, refreshBalance, refreshStake } = this.props;

    if (user && user.wallet) {
      const address = user.wallet;

      refreshBalance(address);
      refreshStake(address);
    }
  }

  handleChangeTab = activeTab => {
    const { type } = this.props;

    if (type) {
      const URL = `/${activeTab}`;

      this.props.history.push(URL);
    } else {
      this.setState({
        activeTab,
      });
    }
  };

  handleSetTab = activeTab => () => {
    this.setState({
      activeTab,
    });
  };

  handleStart = () => {
    this.props.history.push('/connect');
  };

  handleBack = () => {
    const view = this.getView();
    if (
      view === 'connect-view' ||
      view === 'stats-view' ||
      view === 'faqs-view'
    ) {
      this.props.history.push('/swap');
    }
    if (view === 'swap-detail' || view === 'swap-send') {
      this.props.history.push('/swap');
    }
    if (view.includes('pool-')) {
      this.props.history.push('/pools');
    }
    if (view.includes('trade-')) {
      this.props.history.push('/trade');
    }
  };

  handleHeaderAction = () => {};

  getHeaderText = () => {
    const view = this.getView();

    return headerData[view];
  };

  getView = () => {
    const { type, view } = this.props;
    const { activeTab } = this.state;

    if (type) {
      return `${type}-${view}`;
    }

    return activeTab;
  };

  renderHeader = () => {
    const { type, user } = this.props;
    const { wallet } = user;
    const connected = wallet ? true : false;
    const { activeTab } = this.state;
    const active = type || activeTab;
    const headerText = this.getHeaderText();
    const intro = (
      <Link to="/introduction">
        <Tooltip title="Introduction?">
          <Button shape="circle" size="small" icon="question" />
        </Tooltip>
      </Link>
    );

    return (
      <>
        {headerText === undefined && (
          <>
            <Tabs
              activeKey={active}
              onChange={this.handleChangeTab}
              style={{ width: '100%' }}
              action
            >
              <TabPane tab="swap" key="swap" />
              <TabPane tab="pools" key="pools" />
            </Tabs>
            {intro}
          </>
        )}
        {headerText !== undefined && (
          <ViewHeader
            title={headerText}
            actionText="refresh"
            onBack={this.handleBack}
            onAction={this.handleHeaderAction}
          />
        )}
      </>
    );
  };

  render() {
    const { ticker, info } = this.props;
    const view = this.getView();
    console.log('View', view);

    return (
      <ActionViewWrapper>
        <PanelHeader>{this.renderHeader()}</PanelHeader>
        {view === 'swap' && <SwapIntro onNext={this.handleSetTab('pools')} />}
        {view === 'pools' && (
          <PoolIntro
            onBack={this.handleSetTab('swap')}
            onNext={this.handleSetTab('trade')}
          />
        )}
        {view === 'trade' && (
          <TradeIntro
            onBack={this.handleSetTab('pools')}
            onNext={this.handleStart}
          />
        )}
        {view === 'tutorial' && <TutorialView />}
        {view === 'connect-view' && <ConnectView />}
        {view === 'stats-view' && <StatsView />}
        {view === 'faqs-view' && <FaqsView />}
        {view === 'network-view' && <NetworkView />}
        {view === 'swap-view' && <SwapView />}
        {view === 'swap-detail' && <SwapSend view="detail" info={info} />}
        {view === 'swap-send' && <SwapSend view="send" info={info} />}
        {view === 'pools-view' && <PoolView />}
        {view === 'pools-pool' && <PoolStake ticker={ticker} />}
        {view === 'pool-new' && <PoolCreate view="new" info={info} />}
        {view === 'trade-view' && <TradeView />}
        {(view === 'trade-buy' || view === 'trade-sell') && (
          <TradeDetail view={view} info={info} />
        )}
      </ActionViewWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      user: state.Wallet.user,
    }),
    {
      refreshBalance,
      refreshStake,
    },
  ),
  withRouter,
)(ActionView);
