import React, { Component } from 'react';

import { ActionViewWrapper, HeaderAction } from './ActionView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';

const { TabPane } = Tabs;

class ActionView extends Component {
  render() {
    return (
      <ActionViewWrapper>
        <PanelHeader>
          <Tabs defaultActiveKey="swap" onChange={this.handleChangeTab} action>
            <TabPane tab="swap" key="swap" />
            <TabPane tab="pools" key="pools" />
            <TabPane tab="trade" key="trade" />
          </Tabs>
          <HeaderAction>
            <div className="header-action-text">refresh</div>
          </HeaderAction>
        </PanelHeader>
      </ActionViewWrapper>
    );
  }
}

export default ActionView;
