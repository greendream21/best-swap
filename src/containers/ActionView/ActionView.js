import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ActionViewWrapper, HeaderAction } from './ActionView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';
import { headerData } from './data';

import { Swap } from '../Swap';
import { Pool } from '../Pool';
import { Trade } from '../Trade';
import ViewHeader from '../../components/uielements/viewHeader';
import ConnectView from '../ConnectView';
import StatsView from '../StatsView';
import FaqsView from '../FaqsView';
import NetworkView from '../NetworkView';

const { TabPane } = Tabs;

class ActionView extends Component {
  static propTypes = {
    header: PropTypes.string,
  };

  static defaultProps = {
    header: '',
  };

  state = {
    activeTab: 'swap',
  };

  handleChangeTab = activeTab => {
    this.setState({
      activeTab,
    });
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
    console.log('unlock action');
  };

  getHeaderText = () => {
    const { header } = this.props;

    if (header) {
      return headerData[header] || '';
    }
    return '';
  };

  getView = () => {
    const { header } = this.props;
    const { activeTab } = this.state;

    if (header) {
      return header;
    }
    return activeTab;
  };

  render() {
    const { header } = this.props;
    const { activeTab } = this.state;

    const headerText = this.getHeaderText();
    const view = this.getView();
    console.log(view);
    return (
      <ActionViewWrapper>
        <PanelHeader>
          {!header && (
            <>
              <Tabs
                activeKey={activeTab}
                onChange={this.handleChangeTab}
                action
              >
                <TabPane tab="swap" key="swap" />
                <TabPane tab="pools" key="pools" />
                <TabPane tab="trade" key="trade" />
              </Tabs>
              <HeaderAction>
                <div className="header-action-text">refresh</div>
              </HeaderAction>
            </>
          )}
          {header && (
            <ViewHeader
              title={headerText}
              actionText="refresh"
              onBack={this.handleBack}
              onAction={this.handleHeaderAction}
            />
          )}
        </PanelHeader>
        {view === 'swap' && <Swap onNext={this.handleSetTab('pools')} />}
        {view === 'pools' && (
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
        {view === 'connect' && <ConnectView onUnlock={this.handleUnlock} />}
        {view === 'stats' && <StatsView />}
        {view === 'faqs' && <FaqsView />}
        {view === 'network' && <NetworkView />}
      </ActionViewWrapper>
    );
  }
}

export default withRouter(ActionView);
