import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';

import { ContentWrapper } from './ConnectView.style';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';

import Keystore from './Keystore';
import WalletConnect from './WalletConnect';

class ConnectView extends Component {
  static propTypes = {
    onUnlock: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      walletType: 'walletconnect',
    };
  }

  setWalletType(t) {
    this.setState({
      walletType: t,
    });
  }

  render() {
    const { onUnlock } = this.props;

    const btns = [
      {
        label: 'wallet connect',
        value: 'walletconnect',
        comp: <WalletConnect {...this.props} />,
      },
      {
        label: 'ledger',
        value: 'ledger',
        comp: <Keystore {...this.props} />,
      },
      {
        label: 'keystore file',
        value: 'keystore',
        comp: <Keystore {...this.props} />,
      },
    ];

    const selected = btns.find(btn => btn.value === this.state.walletType);
    console.log('Selected:', selected);

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
            {btns.map(btn => {
              return (
                <Button
                  onClick={() => {
                    this.setWalletType(btn.value);
                  }}
                  focused={this.state.walletType === btn.value}
                  color="primary"
                  typevalue="ghost"
                  sizevalue="big"
                >
                  {btn.label}
                </Button>
              );
            })}
          </div>
          <div className="connect-view-content-form">{selected.comp}</div>
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
