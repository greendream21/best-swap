import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { ConnectWrapper } from './Connect.style';
import ActionView from '../../ActionView';

class Connect extends Component {
  render() {
    return (
      <ConnectWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <ActionView type="connect" />
          </Col>
        </Row>
      </ConnectWrapper>
    );
  }
}

export default Connect;
