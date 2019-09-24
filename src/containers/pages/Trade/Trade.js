import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';

import { TradeWrapper } from './Trade.style';
import ActionView from '../../ActionView';

class Trade extends Component {
  render() {
    const { view, info } = this.props.match.params; // eslint-disable-line

    return (
      <TradeWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <ActionView type="trade" view={view} info={info} />
          </Col>
        </Row>
      </TradeWrapper>
    );
  }
}

export default withRouter(Trade);
