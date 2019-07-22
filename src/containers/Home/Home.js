import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { HomeWrapper } from './Home.style';
import ViewPanel from '../../components/viewPanel';

class Home extends Component {
  render() {
    return (
      <HomeWrapper>
        <Row>
          <Col span={6}>
            <ViewPanel />
          </Col>
          <Col span={18}>{/* <ControlPanel /> */}</Col>
        </Row>
      </HomeWrapper>
    );
  }
}

export default Home;
