import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { crypto } from '@binance-chain/javascript-sdk';
import { FilePicker } from 'react-file-picker';
import { Icon, Input } from 'antd';

import { ContentWrapper } from './ConnectView.style';
import Binance from '../../clients/binance';

import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import FormGroup from '../../components/uielements/formGroup';

import walletActions from '../../redux/wallet/actions';

const { saveWallet } = walletActions;

const Keystore = props => {
  const [keystore, setKeystore] = useState(null);
  const [password, setPassword] = useState(null);

  const [keystoreError, setKeystoreError] = useState(null);

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const key = JSON.parse(reader.result);
      if (!('version' in key) || !('crypto' in key)) {
        setKeystoreError('Not a valid keystore file');
      } else {
        setKeystoreError(null);
        setKeystore(key);
      }
    } catch {
      setKeystoreError('Not a valid json file');
    }
  };

  const uploadKeystore = f => {
    reader.readAsText(f);
  };

  const onPasswordChange = e => {
    setPassword(e.target.value);
  };

  const unlock = () => {
    const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
    const address = crypto.getAddressFromPrivateKey(
      privateKey,
      Binance.getPrefix(),
    );

    props.saveWallet({
      type: 'keystore',
      wallet: address,
      keystore: keystore,
    });

    // clean up
    setPassword(null);
    setKeystore(null);
  };

  const ready = (password || '').length > 0 && keystoreError === null;

  return (
    <ContentWrapper>
      <Label size="large" weight="bold" color="normal">
        Select Keystore File
      </Label>
      <FilePicker
        onChange={f => uploadKeystore(f)}
        onError={err => console.error(err)}
      >
        <div>
          <Button color="primary" typevalue="outline">
            <Icon type="upload" />
            Choose File to Upload
          </Button>
          &nbsp;
          {keystore && !keystoreError && (
            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
          )}
        </div>
      </FilePicker>
      {keystoreError && (
        <span style={{ color: '#FF4136' }}>{keystoreError}</span>
      )}
      <FormGroup
        title="Decryption password:"
        description="This is the password used to decrypt your encrypted keystore file"
      >
        <Input.Password
          allowClear
          onChange={onPasswordChange}
          placeholder="password"
        />
      </FormGroup>
      <Button type="submit" onClick={unlock} disabled={!ready}>
        Unlock
      </Button>
    </ContentWrapper>
  );
};

Keystore.propTypes = {
  saveWallet: PropTypes.func.isRequired,
};

export default connect(
  null,
  {
    saveWallet,
  },
)(Keystore);
