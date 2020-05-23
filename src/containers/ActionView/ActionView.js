import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LeftOutlined } from '@ant-design/icons';

import { ActionViewWrapper, BackLink } from './ActionView.style';
import { SwapIntro, SwapView, SwapSend } from '../Swap';
import { PoolIntro, PoolView, PoolStake, PoolCreate } from '../Pool';
import TransactionView from '../TransactionView';
import ConnectView from '../ConnectView';
import FaqsView from '../FaqsView';
import NetworkView from '../NetworkView';

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
    if (pageView === 'swap-detail' || pageView === 'swap-landing') {
      routing = '/swap';
    }
    if (pageView.includes('pools-')) {
      routing = '/pools';
    }

    const backTitle = pageView === 'swap-landing' ? 'See all pools' : 'Back';

    return (
      <Link to={routing}>
        <BackLink>
          <LeftOutlined />
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
          {view === 'connect-view' && <ConnectView />}
          {/* {view === 'stats-view' && <StatsView />} */}
          {view === 'faqs-view' && <FaqsView />}
          {view === 'network-view' && <NetworkView />}
          {view === 'swap-view' && <SwapView />}
          {view === 'swap-detail' && <SwapSend info={info} />}
          {view === 'swap-landing' && <SwapSend info={info} />}
          {view === 'pools-view' && <PoolView />}
          {view === 'pools-pool' && <PoolStake symbol={symbol} />}
          {view === 'pools-new' && <PoolCreate symbol={symbol} />}
          {view === 'transaction-history' && <TransactionView />}
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
