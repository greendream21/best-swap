import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Row, Col, notification, InputNumber } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { ledger, crypto } from '@binance-chain/javascript-sdk';
import u2f_transport from '@ledgerhq/hw-transport-u2f';

import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import { getAppContainer } from '../../helpers/elementHelper';

import { asgardexBncClient } from '../../env';
import * as walletActions from '../../redux/wallet/actions';

ledger.transports.u2f = u2f_transport;

type Props = {
  saveWallet: typeof walletActions.saveWallet;
};

const LedgerConnector = (props: Props) => {
  const [connecting, setConnecting] = useState(false);
  const [ledgerIndex, setLedgerIndex] = useState(0);
  const history = useHistory();

  const ledgerConnect = async () => {
    setConnecting(true);

    // use the u2f transport
    console.log('[+] LEDGER DEBUG: CREATING TRANSPORT');
    const timeout = 50000;
    const transport = await ledger.transports.u2f.create(timeout);
    console.log('LEDGER DEBUG: CREATING TRANSPORT 2');
    const app = new ledger.app(transport, 100000, 100000);
    const hdPath = [44, 714, 0, 0, ledgerIndex];

    console.log('[+] LEDGER DEBUG: GETTING VERSION');
    // get version
    try {
      const version = await app.getVersion();
      console.log('LEDGER DEBUG: APP VERSION: ', version);
    } catch ({ message, statusCode }) {
      console.error('LEDGER DEBUG: VERSION ERROR: ', message, statusCode);
    }

    console.log('[+] LEDGER DEBUG: GETTING PUBLIC KEY');
    // get public key
    const pk =  (await app.getPublicKey(hdPath)).pk;

    // get address from pubkey
    const address = crypto.getAddressFromPublicKey(
      pk,
      asgardexBncClient.getPrefix(),
    );

    notification.info({
      message: 'Confirm your ledger address',
      description: address,
      getContainer: getAppContainer,
    });

    try {
          console.log('[+] LEDGER DEBUG: SHOWING ADDRESS');
      // REQUESTS THE USER TO CONFIRM ADDRESS>
      const _ = await app.showAddress(asgardexBncClient.getPrefix(), hdPath); // results

      setConnecting(false);

      props.saveWallet({
        type: 'ledger',
        wallet: address,
        ledger: app,
        hdPath,
      });

      notification.success({
        message: 'Ledger connected!',
        description: 'Your ledger has successfully connected.',
        getContainer: getAppContainer,
        duration: 3,
      });

      // redirect to pool view page
      history.push('/pools');
    } catch (err) {
      console.error('pk error', err.message, err.statusCode);

      notification.error({
        message: 'Ledger Error',
        description: 'Transaction was cancelled. Please try again.',
        getContainer: getAppContainer,
      });
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
          <Label weight="bold">Enter PIN Code</Label>
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
            <Label weight="bold">Open Binance Chain</Label>
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
              onChange={(i: number | undefined) => {
                if (i) {
                  setLedgerIndex(i);
                }
              }}
            />
          </div>
          <Button
            className="ledger-connect-btn"
            onClick={ledgerConnect}
            loading={connecting}
            round="true"
          >
            Connect to Ledger <ArrowRightOutlined />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default LedgerConnector;
