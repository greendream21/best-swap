import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';

import { TutorialWrapper } from './Tutorial.style';
import TutorialView from '../../TutorialView';

class Tutorial extends Component {
  render() {
    const { type, view } = this.props.match.params; // eslint-disable-line

    return (
      <TutorialWrapper>
        <Row gutter={32}>
          <Col span={24}>
            <TutorialView type={type} view={view} />
          </Col>
        </Row>
      </TutorialWrapper>
    );
  }
}

export default withRouter(Tutorial);
