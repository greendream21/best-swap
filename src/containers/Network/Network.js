import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { NetworkWrapper } from './Network.style';
import ActionView from '../ActionView';

class Network extends Component {
  render() {
    return (
      <NetworkWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <ActionView header="network" />
          </Col>
        </Row>
      </NetworkWrapper>
    );
  }
}

export default Network;
