import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';

import { TradeWrapper } from './Trade.style';
import ActionView from '../../ActionView';

class Trade extends Component {
  render() {
    const { symbol } = this.props.match.params; // eslint-disable-line
    let view = 'detail';
    if (!symbol) view = 'view';

    return (
      <TradeWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <ActionView type="trade" view={view} />
          </Col>
        </Row>
      </TradeWrapper>
    );
  }
}

export default withRouter(Trade);
