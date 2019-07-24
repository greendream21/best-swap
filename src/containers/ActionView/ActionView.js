import React, { Component } from 'react';

import { ActionViewWrapper, HeaderAction } from './ActionView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';

import { Swap } from '../Swap';
import { Pool } from '../Pool';
import { Trade } from '../Trade';

const { TabPane } = Tabs;

class ActionView extends Component {
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
    console.log('Start!!!');
  };

  render() {
    const { activeTab } = this.state;

    return (
      <ActionViewWrapper>
        <PanelHeader>
          <Tabs activeKey={activeTab} onChange={this.handleChangeTab} action>
            <TabPane tab="swap" key="swap" />
            <TabPane tab="pools" key="pools" />
            <TabPane tab="trade" key="trade" />
          </Tabs>
          <HeaderAction>
            <div className="header-action-text">refresh</div>
          </HeaderAction>
        </PanelHeader>
        {activeTab === 'swap' && <Swap onNext={this.handleSetTab('pools')} />}
        {activeTab === 'pools' && (
          <Pool
            onBack={this.handleSetTab('swap')}
            onNext={this.handleSetTab('trade')}
          />
        )}
        {activeTab === 'trade' && (
          <Trade
            onBack={this.handleSetTab('pools')}
            onNext={this.handleStart}
          />
        )}
      </ActionViewWrapper>
    );
  }
}

export default ActionView;
