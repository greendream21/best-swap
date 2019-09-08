import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';

import { PoolWrapper } from './Pool.style';
import ActionView from '../../ActionView';

class Pool extends Component {
  render() {
    const { view, info } = this.props.match.params;

    return (
      <PoolWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <ActionView type="pool" view={view} info={info} />
          </Col>
        </Row>
      </PoolWrapper>
    );
  }
}

export default withRouter(Pool);
