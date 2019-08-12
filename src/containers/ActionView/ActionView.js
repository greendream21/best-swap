import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ActionViewWrapper, HeaderAction } from './ActionView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';
import { headerData } from './data';

import { SwapIntro, SwapView } from '../Swap';
import { Pool } from '../Pool';
import { Trade } from '../Trade';
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
  };

  static defaultProps = {
    type: '',
    view: 'view',
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
    this.props.history.push('/');
  };

  handleHeaderAction = () => {
    console.log('header action');
  };

  handleUnlock = () => {
    this.props.history.push('/swap');
  };

  getHeaderText = () => {
    const { type } = this.props;

    if (type) {
      return headerData[type] || '';
    }
    return '';
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
            <HeaderAction>
              <div className="header-action-text">refresh</div>
            </HeaderAction>
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
    const view = this.getView();

    console.log(view);
    return (
      <ActionViewWrapper>
        <PanelHeader>{this.renderHeader()}</PanelHeader>
        {view === 'swap' && <SwapIntro onNext={this.handleSetTab('pools')} />}
        {view === 'pool' && (
          <Pool
            onBack={this.handleSetTab('swap')}
            onNext={this.handleSetTab('trade')}
          />
        )}
        {view === 'trade' && (
          <Trade
            onBack={this.handleSetTab('pools')}
            onNext={this.handleStart}
          />
        )}
        {view === 'tutorial' && <TutorialView />}
        {view === 'connect-view' && (
          <ConnectView onUnlock={this.handleUnlock} />
        )}
        {view === 'stats-view' && <StatsView />}
        {view === 'faqs-view' && <FaqsView />}
        {view === 'network' && <NetworkView />}
        {view === 'swap-view' && <SwapView />}
      </ActionViewWrapper>
    );
  }
}

export default withRouter(ActionView);
