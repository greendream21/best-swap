import React, { Component } from 'react';

import { WalletViewWrapper } from './WalletView.style';
import Tabs from '../../components/uielements/tabs';

const { TabPane } = Tabs;

class WalletView extends Component {
  render() {
    return (
      <WalletViewWrapper>
        <Tabs defaultActiveKey="assets" onChange={this.handleChangeTab}>
          <TabPane tab="assets" key="assets">
            Connect your wallet
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
