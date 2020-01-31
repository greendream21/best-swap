import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { ActionViewWrapper, BackLink } from './ActionView.style';
import { SwapIntro, SwapView, SwapSend } from '../Swap';
import { PoolIntro, PoolView, PoolStake, PoolCreate } from '../Pool';
import { TradeIntro, TradeView, TradeDetail } from '../Trade';
import ConnectView from '../ConnectView';
import StatsView from '../StatsView';
import FaqsView from '../FaqsView';
import NetworkView from '../NetworkView';
import TutorialView from '../TutorialView';

import * as walletActions from '../../redux/wallet/actions';

const { refreshBalance } = walletActions;

class ActionView extends Component {
  componentDidMount() {
    const { user, refreshBalance } = this.props;

    if (user && user.wallet) {
      const address = user.wallet;

      refreshBalance(address);
    }
  }

  getView = () => {
    const { type, view } = this.props;
    if (type) {
      return `${type}-${view}`;
    }
  };

  renderBack = () => {
    const { view } = this.props;
    if (view === 'view') return '';

    const pageView = this.getView();
    let routing = '';

    if (
      pageView === 'connect-view' ||
      pageView === 'stats-view' ||
      pageView === 'faqs-view'
    ) {
      routing = '/swap';
    }
    if (
      pageView === 'swap-detail' ||
      pageView === 'swap-landing' ||
      pageView === 'swap-send'
    ) {
      routing = '/swap';
    }
    if (pageView.includes('pools-')) {
      routing = '/pools';
    }
    if (pageView.includes('trade-')) {
      routing = '/trade';
    }

    const backTitle = pageView === 'swap-landing' ? 'See all pools' : 'Back';

    return (
      <Link to={routing}>
        <BackLink>
          <Icon type="left" />
          <span>{backTitle}</span>
        </BackLink>
      </Link>
    );
  };

  render() {
    const { info, symbol } = this.props;
    const view = this.getView();

    return (
      <>
        {this.renderBack()}
        <ActionViewWrapper>
          {view === 'intro-swap' && <SwapIntro />}
          {view === 'intro-pools' && <PoolIntro />}
          {view === 'intro-trade' && <TradeIntro />}
          {view === 'tutorial' && <TutorialView />}
          {view === 'connect-view' && <ConnectView />}
          {view === 'stats-view' && <StatsView />}
          {view === 'faqs-view' && <FaqsView />}
          {view === 'network-view' && <NetworkView />}
          {view === 'swap-view' && <SwapView />}
          {view === 'swap-detail' && <SwapSend view="detail" info={info} />}
          {view === 'swap-landing' && <SwapSend view="detail" info={info} />}
          {view === 'swap-send' && <SwapSend view="send" info={info} />}
          {view === 'pools-view' && <PoolView />}
          {view === 'pools-pool' && <PoolStake symbol={symbol} />}
          {view === 'pools-new' && <PoolCreate symbol={symbol} />}
          {view === 'trade-view' && <TradeView />}
          {view === 'trade-detail' && <TradeDetail symbol={symbol} />}
        </ActionViewWrapper>
      </>
    );
  }
}

ActionView.propTypes = {
  type: PropTypes.string,
  view: PropTypes.string,
  info: PropTypes.string,
  user: PropTypes.object, // Maybe<User>
  refreshBalance: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  symbol: PropTypes.string,
};

ActionView.defaultProps = {
  type: '',
  view: 'view',
  info: '',
};

export default compose(
  connect(
    state => ({
      user: state.Wallet.user,
    }),
    {
      refreshBalance,
    },
  ),
  withRouter,
)(ActionView);
