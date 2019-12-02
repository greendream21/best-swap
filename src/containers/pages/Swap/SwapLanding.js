import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';

import { SwapWrapper } from './Swap.style';
import ActionView from '../../ActionView';

class SwapLanding extends Component {
  render() {
    return (
      <SwapWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <ActionView type="swap" view="detail" info="bnb-rune" />
          </Col>
        </Row>
      </SwapWrapper>
    );
  }
}

export default withRouter(SwapLanding);
