import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';

import { HomeWrapper } from './Home.style';
import ActionView from '../../ActionView';

class Home extends Component {
  render() {
    const { view = 'swap' } = this.props.match.params; // eslint-disable-line

    return (
      <HomeWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <ActionView type="intro" view={view} />
          </Col>
        </Row>
      </HomeWrapper>
    );
  }
}

export default withRouter(Home);
