import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Row, Col, message, InputNumber } from 'antd';
import { ledger, crypto } from '@binance-chain/javascript-sdk';
import u2f_transport from '@ledgerhq/hw-transport-u2f';

import Binance from '../../clients/binance';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';

import * as walletActions from '../../redux/wallet/actions';

const { saveWallet } = walletActions;

ledger.transports.u2f = u2f_transport;
window.ledger = ledger;

const Connector = props => {
  const [connecting, setConnecting] = useState(false);
  const [ledgerIndex, setLedgerIndex] = useState(0);

  const ledgerConnect = async () => {
    setConnecting(true);
    message.success(
      <Label style={{ color: '#50E3C2' }}>Please approve on your ledger</Label>,
      5,
    );

    // use the u2f transport
    const timeout = 50000;
    const transport = await ledger.transports.u2f.create(timeout);
    const app = new ledger.app(transport, 100000, 100000);
    window.app = app;

    // get version
    try {
      const version = await app.getVersion();
      console.log('version', version);
    } catch ({ message, statusCode }) {
      console.error('version error', message, statusCode);
    }

    // we can provide the hd path (app checks first two parts are same as below)
    const hdPath = [44, 714, 0, 0, ledgerIndex];

    // select which address to use
    // TODO (Chad): use "bnb" when on mainnet
    const _ = await app.showAddress(Binance.getPrefix(), hdPath); // results

    // get public key
    let pk;
    try {
      pk = (await app.getPublicKey(hdPath)).pk;

      // get address from pubkey
      // TODO: use "bnb" when on mainnet
      const address = crypto.getAddressFromPublicKey(pk, Binance.getPrefix());
      setConnecting(false);

      props.saveWallet({
        type: 'ledger',
        wallet: address,
        ledger: app,
        hdPath,
      });
    } catch (err) {
      console.error('pk error', err.message, err.statusCode);
      message.error('public key error' + err.message);
      setConnecting(false);
    }
  };

  return (
    <div className="ledger-connect-wrapper">
      <Row style={{ marginBottom: 20 }}>
        <Label size="large" weight="bold" color="normal">
          Connect your Ledger
        </Label>
      </Row>
      <Row>
        <Col span={3}>
          <img src="/assets/img/step1.svg" alt="Step 1" />
        </Col>
        <Col span={8}>
          <Label weght="bold">Enter PIN Code</Label>
        </Col>
        <Col>
          <img
            src="/assets/img/ledger-pin.svg"
            style={{ padding: 10 }}
            alt="pincode"
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col span={3}>
          <img src="/assets/img/step2.svg" alt="Step 2" />
        </Col>
        <Col span={8}>
          <Row>
            <Label weight="bol">Open Binance Chain</Label>
          </Row>
        </Col>
        <Col>
          <img
            src="/assets/img/ledger-app.svg"
            style={{ padding: 10 }}
            alt="Open App"
          />
        </Col>
      </Row>
      <Row>
        <Label weight="small">“Binance Chain Ready” must be on-screen</Label>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col className="ledger-guide-wrapper" span={24}>
          <div>
            <a
              href="https://www.binance.org/static/guides/DEX-Ledger-Documentation.html"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Label>App Installation & Usage Instructions</Label>
            </a>
          </div>
          <div>
            <a
              href="https://support.ledger.com/hc/en-us/articles/115005165269-Connection-issues-with-Windows-or-Linux"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Label>Having Connection Issues?</Label>
            </a>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="ledger-footer" span={24}>
          <div>
            <div>
              <Label>Index Number</Label>
            </div>
            <InputNumber
              min={0}
              size="small"
              value={ledgerIndex}
              onChange={i => {
                setLedgerIndex(i);
              }}
            />
          </div>
          <Button
            className="ledger-connect-btn"
            onClick={ledgerConnect}
            loading={connecting}
            round="true"
          >
            Connect to Ledger <Icon type="arrow-right" />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

Connector.propTypes = {
  saveWallet: PropTypes.func.isRequired,
};

export default connect(null, {
  saveWallet,
})(Connector);
