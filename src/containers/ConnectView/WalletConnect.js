import React from 'react';

import { crypto } from '@binance-chain/javascript-sdk';
import { Row, Col } from 'antd';
import { ContentWrapper } from './ConnectView.style';

import WalletConnect from '@trustwallet/walletconnect';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';

const WalletConnectPane = props => {
  const walletConnect = async () => {
    const walletConnector = (window.mywallet = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
    }));

    walletConnector.killSession();

    // Check if connection is already established
    if (!walletConnector.connected) {
      console.log('Creating session');
      // create new session
      walletConnector.createSession().then(() => {
        // get uri for QR Code modal
        const uri = walletConnector.uri;
        // display QR Code modal
        WalletConnectQRCodeModal.open(uri, () => {
          console.log('QR Code Modal closed');
        });
      });
    }

    // Subscribe to connection events
    walletConnector.on('connect', (error, payload) => {
      if (error) {
        throw error;
      }

      // Close QR Code Modal
      WalletConnectQRCodeModal.close();

      // Get provided accounts and chainId
      // const { accounts, chainId } = payload.params[0];

      walletConnector
        .getAccounts()
        .then(result => {
          // Returns the accounts
          const account = result.find(account => account.network === 714);
          console.log('ACCOUNT:', account);
          console.log('WALLET CONNECT ACCOUNTS RESULTS ' + account.address);
          console.log('ADDR:', crypto.decodeAddress(account.address));

          // TODO: set walletConnector, account.address, and account into redux

          // TODO: navigate to next page
          props.history.push('/');
        })
        .catch(error => {
          // Error returned when rejected
          console.error(error);
        });
    });

    walletConnector.on('session_update', (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      // const { accounts, chainId } = payload.params[0];
    });

    walletConnector.on('disconnect', (error, payload) => {
      if (error) {
        throw error;
      }

      // Delete walletConnector
      // TODO: remove wallet info from Redux
    });
  };

  const paneStyle = {
    backgroundColor: '#48515D',
    marginLeft: '10px',
    marginRight: '10px',
    marginTop: '50px',
    borderRadius: 5,
    boxShadow: '0px 0px 5px #50E3C2',
  };

  return (
    <ContentWrapper>
      <Row style={{ bottom: 5 }}>
        <span>
          Click to scan a QR code and link your mobile wallet using
          WalletConnect.
        </span>
      </Row>

      <Row>
        <Col xs={24} md={3}></Col>
        <Col xs={24} md={8} style={paneStyle}>
          <img
            src={'/assets/img/qr-code.svg'}
            alt="qr-code"
            style={{ margin: 30 }}
            onClick={() => walletConnect()}
          />
        </Col>
        <Col xs={24} md={13}></Col>
      </Row>
    </ContentWrapper>
  );
};

export default WalletConnectPane;
