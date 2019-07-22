import React, { Component } from 'react';

import PanelHeader from '../uielements/panelHeader';
import { ViewPanelWrapper } from './viewPanel.style';
import Tabs from '../uielements/tabs';

const { TabPane } = Tabs;

class ViewPanel extends Component {
  handleChangeTab = key => {
    console.log(key);
  };

  render() {
    return (
      <ViewPanelWrapper>
        <PanelHeader>
          <Tabs defaultActiveKey="swap" onChange={this.handleChangeTab}>
            <TabPane tab="Swap" key="swap">
              Asset Lists
            </TabPane>
            <TabPane tab="Stake" key="stake">
              Stake Lists
            </TabPane>
          </Tabs>
        </PanelHeader>
      </ViewPanelWrapper>
    );
  }
}

export default ViewPanel;
