import React, { Component } from 'react';

import { ActionViewWrapper } from './ActionView.style';
import Tabs from '../../components/uielements/tabs';

const { TabPane } = Tabs;

class ActionView extends Component {
  render() {
    return (
      <ActionViewWrapper>
        <Tabs defaultActiveKey="swap" onChange={this.handleChangeTab}>
          <TabPane tab="swap" key="swap">
            swap view
          </TabPane>
          <TabPane tab="pools" key="pools">
            Pools Lists
          </TabPane>
          <TabPane tab="trade" key="trade">
            Trade Lists
          </TabPane>
        </Tabs>
      </ActionViewWrapper>
    );
  }
}

export default ActionView;
