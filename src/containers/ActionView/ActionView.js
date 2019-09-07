import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ActionViewWrapper } from './ActionView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';
import { headerData } from './data';

import { SwapIntro, SwapView, SwapDetail } from '../Swap';
import { PoolIntro, PoolView, PoolStake, PoolCreate } from '../Pool';
import { TradeIntro, TradeView, TradeDetail } from '../Trade';
import ViewHeader from '../../components/uielements/viewHeader';
import ConnectView from '../ConnectView';
import StatsView from '../StatsView';
import FaqsView from '../FaqsView';
import NetworkView from '../NetworkView';
import TutorialView from '../TutorialView';

const { TabPane } = Tabs;

class ActionView extends Component {
  static propTypes = {
    type: PropTypes.string,
    view: PropTypes.string,
    info: PropTypes.string,
  };

  static defaultProps = {
    type: '',
    view: 'view',
    info: '',
  };

  state = {
    activeTab: 'swap',
  };

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
    if (view === 'swap-detail' || view === 'swap-send') {
      this.props.history.push('/swap');
    }
    if (view.includes('pool-')) {
      this.props.history.push('/pool');
    }
    if (view.includes('trade-')) {
      this.props.history.push('/trade');
    }
  };

  handleHeaderAction = () => {};

  handleUnlock = () => {
    this.props.history.push('/swap');
  };

  getHeaderText = () => {
    const view = this.getView();

    return headerData[view] || '';
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
    const { type } = this.props;
    const { activeTab } = this.state;
    const active = type || activeTab;
    const headerText = this.getHeaderText();

    return (
      <>
        {!headerText && (
          <>
            <Tabs activeKey={active} onChange={this.handleChangeTab} action>
              <TabPane tab="swap" key="swap" />
              <TabPane tab="pool" key="pool" />
              <TabPane tab="trade" key="trade" />
            </Tabs>
          </>
        )}
        {headerText && (
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
    const { info } = this.props;
    const view = this.getView();

    return (
      <ActionViewWrapper>
        <PanelHeader>{this.renderHeader()}</PanelHeader>
        {view === 'swap' && <SwapIntro onNext={this.handleSetTab('pool')} />}
        {view === 'pool' && (
          <PoolIntro
            onBack={this.handleSetTab('swap')}
            onNext={this.handleSetTab('trade')}
          />
        )}
        {view === 'trade' && (
          <TradeIntro
            onBack={this.handleSetTab('pool')}
            onNext={this.handleStart}
          />
        )}
        {view === 'tutorial' && <TutorialView />}
        {view === 'connect-view' && (
          <ConnectView onUnlock={this.handleUnlock} />
        )}
        {view === 'stats-view' && <StatsView />}
        {view === 'faqs-view' && <FaqsView />}
        {view === 'network-view' && <NetworkView />}
        {view === 'swap-view' && <SwapView />}
        {view === 'swap-detail' && <SwapDetail view="detail" info={info} />}
        {view === 'swap-send' && <SwapDetail view="send" info={info} />}
        {view === 'pool-view' && <PoolView />}
        {view === 'pool-stake-new' && (
          <PoolStake view="stake-new" info={info} />
        )}
        {view === 'pool-stake-detail' && (
          <PoolStake view="stake-detail" info={info} />
        )}
        {view === 'pool-stake-view' && (
          <PoolStake view="stake-view" info={info} />
        )}
        {view === 'pool-withdraw' && <PoolStake view="withdraw" info={info} />}
        {view === 'pool-new' && <PoolCreate view="new" info={info} />}
        {view === 'trade-view' && <TradeView />}
        {(view === 'trade-buy' || view === 'trade-sell') && (
          <TradeDetail view={view} info={info} />
        )}
      </ActionViewWrapper>
    );
  }
}

export default withRouter(ActionView);
