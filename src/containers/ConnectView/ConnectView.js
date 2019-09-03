import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';

import { ContentWrapper } from './ConnectView.style';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';

import Keystore from './Keystore';

class ConnectView extends Component {
  static propTypes = {
    onUnlock: PropTypes.func.isRequired,
  };

  render() {
    const { onUnlock } = this.props;

    return (
      <ContentWrapper>
        <Row className="connect-view-title">
          <Col span={24}>
            <Label size="normal" weight="bold" color="normal">
              SELECT WALLET
            </Label>
          </Col>
        </Row>
        <Row className="connect-view-content">
          <div className="connect-view-content-buttons">
            <Button color="primary" typevalue="ghost" sizevalue="big">
              wallet connect
            </Button>
            <Button color="primary" typevalue="ghost" sizevalue="big">
              ledger
            </Button>
            <Button color="primary" typevalue="ghost" sizevalue="big">
              keystore file
            </Button>
          </div>
          <div className="connect-view-content-form">
            <Keystore {...this.props} />
          </div>
        </Row>
        <Row className="bottom-nav-button">
          <Button onClick={onUnlock} color="primary">
            unlock
          </Button>
        </Row>
      </ContentWrapper>
    );
  }
}

export default ConnectView;
