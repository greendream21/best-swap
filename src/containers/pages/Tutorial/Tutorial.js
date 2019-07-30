import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { TutorialWrapper } from './Tutorial.style';
import TutorialView from '../../TutorialView';

class Tutorial extends Component {
  render() {
    return (
      <TutorialWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <TutorialView />
          </Col>
        </Row>
      </TutorialWrapper>
    );
  }
}

export default Tutorial;
