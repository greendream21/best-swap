import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
// import { crypto } from '@binance-chain/javascript-sdk';
import { Row } from 'antd';
import WalletConnect from '@trustwallet/walletconnect';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';

import { ContentWrapper, QRCodeWrapper } from './ConnectView.style';

import * as walletActions from '../../redux/wallet/actions';
import Label from '../../components/uielements/label';
import { FixmeType } from '../../types/bepswap';

type Props = {
  saveWallet: typeof walletActions.saveWallet;
};

const WalletConnectPane = (props: Props) => {
  const history = useHistory();

  const walletConnect = async () => {
    const qrcodeModalOptions = {
      mobileLinks: ['trust'],
    };

    const walletConnector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      qrcodeModal: WalletConnectQRCodeModal,
      qrcodeModalOptions,
    });

    walletConnector.killSession();

    // Check if connection is already established
    if (!walletConnector.connected) {
      // create new session

      walletConnector.createSession().then(() => {
        // get uri for QR Code modal
        const uri = walletConnector.uri;
        // display QR Code modal OR MobileLink for trustwallet
        WalletConnectQRCodeModal.open(uri, () => {}, qrcodeModalOptions);
      });
    }

    // Subscribe to connection events
    walletConnector.on('connect', error => {
      if (error) {
        console.log('walletConnector connect error: ', error);
        throw error;
      }

      // Close QR Code Modal
      WalletConnectQRCodeModal.close();

      // Get provided accounts and chainId
      // const { accounts, chainId } = payload.params[0];

      walletConnector
        .getAccounts()
        .then((result: FixmeType) => {
          // Returns the accounts
          const account: FixmeType = result.find(
            (account: FixmeType) => account.network === 714,
          );
          // const address = crypto.decodeAddress(account.address);
          const address = account?.address ?? '';

          props.saveWallet({
            type: 'walletconnect',
            wallet: address,
            walletConnector,
          });

          // redirect to previous page
          history.goBack();
        })
        .catch(error => {
          // Error returned when rejected
          console.error('walletConnector getAccount error!', error);
        });
    });

    walletConnector.on('session_update', error => {
      if (error) {
        console.log('walletConnector session_update error: ', error);

        throw error;
      }

      // Get updated accounts and chainId
      // const { accounts, chainId } = payload.params[0];
    });

    walletConnector.on('disconnect', error => {
      if (error) {
        console.log('walletConnector disconnect error: ', error);

        throw error;
      }

      // Delete walletConnector
      // props.saveWallet({ type: 'walletconnect', walletConnector: null, wallet: '' });
    });
  };

  return (
    <ContentWrapper>
      <Row style={{ bottom: 5 }}>
        <Label>
          Click to scan a QR code and link your mobile wallet using
          WalletConnect.
        </Label>
      </Row>

      <QRCodeWrapper>
        <img
          src="/assets/img/qr-code.svg"
          alt="qr-code"
          style={{ margin: 30 }}
          onClick={() => walletConnect()}
        />
      </QRCodeWrapper>
    </ContentWrapper>
  );
};

WalletConnectPane.propTypes = {
  saveWallet: PropTypes.func.isRequired,
};

export default WalletConnectPane;
