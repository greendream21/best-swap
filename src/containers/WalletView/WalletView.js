import React, { Component } from 'react';

import { WalletViewWrapper } from './WalletView.style';
import Tabs from '../../components/uielements/tabs';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';

const { TabPane } = Tabs;

class WalletView extends Component {
  render() {
    return (
      <WalletViewWrapper>
        <Tabs defaultActiveKey="assets" onChange={this.handleChangeTab}>
          <TabPane tab="assets" key="assets">
            <Label>Connect your wallet</Label>
            <br />
            <Button color="success">connect</Button>
          </TabPane>
          <TabPane tab="stakes" key="stakes"></TabPane>
        </Tabs>
      </WalletViewWrapper>
    );
  }
}

export default WalletView;
