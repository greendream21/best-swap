import React, { Component } from 'react';

import { WalletViewWrapper } from './WalletView.style';
import Tabs from '../../components/uielements/tabs';
import Label from '../../components/uielements/label';

const { TabPane } = Tabs;

class WalletView extends Component {
  render() {
    return (
      <WalletViewWrapper>
        <Tabs defaultActiveKey="assets" onChange={this.handleChangeTab}>
          <TabPane tab="assets" key="assets">
            <Label>Connect your wallet</Label>
          </TabPane>
          <TabPane tab="stakes" key="stakes">
            Stakes Lists
          </TabPane>
        </Tabs>
      </WalletViewWrapper>
    );
  }
}

export default WalletView;
