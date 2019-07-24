import React, { Component } from 'react';

import {
  ActionViewWrapper,
  HeaderAction,
  ContentView,
} from './ActionView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';

import { Swap } from '../Swap';

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

  render() {
    const { activeTab } = this.state;

    return (
      <ActionViewWrapper>
        <PanelHeader>
          <Tabs
            defaultActiveKey={activeTab}
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
        </PanelHeader>
        {activeTab === 'swap' && <Swap />}
      </ActionViewWrapper>
    );
  }
}

export default ActionView;
