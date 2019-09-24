import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';

import { SwapWrapper } from './Swap.style';
import ActionView from '../../ActionView';

class Swap extends Component {
  render() {
    const { view, info } = this.props.match.params; // eslint-disable-line

    return (
      <SwapWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <ActionView type="swap" view={view} info={info} />
          </Col>
        </Row>
      </SwapWrapper>
    );
  }
}

export default withRouter(Swap);
