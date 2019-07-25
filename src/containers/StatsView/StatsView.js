import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { ContentWrapper } from './StatsView.style';
import { stats } from './data';
import StatusGroup from '../../components/uielements/statusGroup';

class StatsView extends Component {
  render() {
    return (
      <ContentWrapper>
        <Row>
          <Col span="12">
            <StatusGroup title="users" status={stats.users} />
            <StatusGroup title="pools" status={stats.pools} />
          </Col>
          <Col span="12">
            <StatusGroup title="transactions" status={stats.transactions} />
            <StatusGroup title="stakers" status={stats.stakers} />
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default StatsView;
