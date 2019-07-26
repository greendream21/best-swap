import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { ContentWrapper } from './NetworkView.style';
import { stats } from './data';
import StatusGroup from '../../components/uielements/statusGroup';

class NetworkView extends Component {
  render() {
    return (
      <ContentWrapper>
        <Row>
          <Col span="12">
            <StatusGroup title="nodes" status={stats.nodes} />
            <StatusGroup title="sidechain" status={stats.sidechain} />
          </Col>
          <Col span="12">
            <StatusGroup title="threshold addresses" status={stats.threshold} />
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default NetworkView;
