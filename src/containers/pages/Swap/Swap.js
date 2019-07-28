import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { SwapWrapper } from './Swap.style';
import WalletView from '../../WalletView';
import ActionView from '../../ActionView';

class Swap extends Component {
  render() {
    return (
      <SwapWrapper>
        <Row gutter={32}>
          <Col span={6}>
            <WalletView />
          </Col>
          <Col span={18}>
            <ActionView header="swap" />
          </Col>
        </Row>
      </SwapWrapper>
    );
  }
}

export default Swap;
