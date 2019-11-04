import React, { Component } from 'react';
import { Row, Col } from 'antd';

import { ContentWrapper } from './ConnectView.style';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';

import Keystore from './Keystore';
import WalletConnect from './WalletConnect';
import Ledger from './Ledger';

class ConnectView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      walletType: 'keystore',
    };
  }

  setWalletType(t) {
    this.setState({
      walletType: t,
    });
  }

  render() {
    const btns = [
      {
        label: 'wallet connect',
        value: 'walletconnect',
        comp: <WalletConnect {...this.props} />,
      },
      {
        label: 'ledger',
        value: 'ledger',
        comp: <Ledger {...this.props} />,
      },
      {
        label: 'keystore file',
        value: 'keystore',
        comp: <Keystore {...this.props} />,
      },
    ];

    const selected = btns.find(btn => btn.value === this.state.walletType);

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
          <Col className="connect-view-content-buttons" xs={24} sm={8}>
            {btns.map(btn => {
              return (
                <Button
                  key={btn.value}
                  onClick={() => {
                    this.setWalletType(btn.value);
                  }}
                  focused={this.state.walletType === btn.value}
                  color="primary"
                  typevalue="ghost"
                  sizevalue="big"
                  disabled={btn.value === 'walletconnect'}
                >
                  {btn.label}
                </Button>
              );
            })}
          </Col>
          <Col className="connect-view-content-form" xs={24} sm={8}>
            {selected.comp}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default ConnectView;
