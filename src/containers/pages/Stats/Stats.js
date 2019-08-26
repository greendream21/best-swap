import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { StatsWrapper } from './Stats.style';
import ActionView from '../../ActionView';

class Stats extends Component {
  render() {
    return (
      <StatsWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <ActionView type="stats" />
          </Col>
        </Row>
      </StatsWrapper>
    );
  }
}

export default Stats;
