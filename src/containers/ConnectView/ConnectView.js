import React, { Component } from 'react';
import { Row, Col, Icon, Input } from 'antd';
import PropTypes from 'prop-types';

import { ContentWrapper } from './ConnectView.style';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import FormGroup from '../../components/uielements/formGroup';

const { TextArea } = Input;

class ConnectView extends Component {
  static propTypes = {
    onUnlock: PropTypes.func.isRequired,
  };

  render() {
    const { onUnlock } = this.props;

    return (
      <ContentWrapper>
        <Row className="connect-view-title">
          <Col span="24">
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
              keywtone file
            </Button>
          </div>
          <div className="connect-view-content-form">
            <Label size="large" weight="bold" color="normal">
              Select Keystore File
            </Label>
            <Button color="primary" typevalue="outline">
              <Icon type="upload" />
              Choose File to Upload
            </Button>
            <FormGroup
              title="Or paste here:"
              description="The browser does not store your keys"
            >
              <TextArea rows={4} placeholder="24 word phrase" />
            </FormGroup>
            <FormGroup
              title="Encrypt with password:"
              description="This will securely encrypt your keys in the browser"
            >
              <Input type="password" placeholder="password" />
            </FormGroup>
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
