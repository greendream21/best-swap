import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';

import { SwapWrapper } from './Swap.style';
import WalletView from '../../WalletView';
import ActionView from '../../ActionView';

class Swap extends Component {
  render() {
    const { view } = this.props.match.params;

    return (
      <SwapWrapper>
        <Row gutter={32}>
          <Col span={6}>
            <WalletView status="connected" />
          </Col>
          <Col span={18}>
            <ActionView type="swap" view={view} />
          </Col>
        </Row>
      </SwapWrapper>
    );
  }
}

export default withRouter(Swap);
