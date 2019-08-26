import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';

import { TradeWrapper } from './Trade.style';
import WalletView from '../../WalletView';
import ActionView from '../../ActionView';

class Trade extends Component {
  render() {
    const { view, info } = this.props.match.params;

    return (
      <TradeWrapper>
        <Row gutter={32}>
          <Col span={6}>
            <WalletView
              page="trade"
              view={view}
              info={info}
              status="connected"
            />
          </Col>
          <Col span={18}>
            <ActionView type="trade" view={view} info={info} />
          </Col>
        </Row>
      </TradeWrapper>
    );
  }
}

export default withRouter(Trade);
