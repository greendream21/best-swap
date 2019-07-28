import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { FaqsWrapper } from './Faqs.style';
import ActionView from '../../ActionView';

class Faqs extends Component {
  render() {
    return (
      <FaqsWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <ActionView header="faqs" />
          </Col>
        </Row>
      </FaqsWrapper>
    );
  }
}

export default Faqs;
