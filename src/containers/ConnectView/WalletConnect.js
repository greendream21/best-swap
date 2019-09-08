import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { crypto } from '@binance-chain/javascript-sdk';
import { Row, Col } from 'antd';
import WalletConnect from '@trustwallet/walletconnect';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';

import { ContentWrapper } from './ConnectView.style';

import walletActions from '../../redux/wallet/actions';

const { saveWallet } = walletActions;

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
          const address = crypto.decodeAddress(account.address);
          console.log('ACCOUNT:', account);
          console.log('WALLET CONNECT ACCOUNTS RESULTS ' + account.address);

          props.saveWallet({
            type: 'walletconnect',
            wallet: address,
            walletconnect: walletConnector,
            account: account,
          });
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
      props.saveWallet({});
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

WalletConnectPane.propTypes = {
  saveWallet: PropTypes.func.isRequired,
};

export default connect(
  null,
  {
    saveWallet,
  },
)(WalletConnectPane);
