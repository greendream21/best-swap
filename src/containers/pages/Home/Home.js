import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { HomeWrapper } from './Home.style';
import WalletView from '../../WalletView';
import ActionView from '../../ActionView';

class Home extends Component {
  render() {
    return (
      <HomeWrapper>
        <Row gutter={32}>
          <Col span={6}>
            <WalletView />
          </Col>
          <Col span={18}>
            <ActionView />
          </Col>
        </Row>
      </HomeWrapper>
    );
  }
}

export default Home;
