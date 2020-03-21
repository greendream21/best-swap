import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { crypto } from '@binance-chain/javascript-sdk';
import { FilePicker } from 'react-file-picker';
import { Row, Icon, Input, Form, Tooltip } from 'antd';

import { ContentWrapper } from './ConnectView.style';
import Binance from '../../clients/binance';

import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import FormGroup from '../../components/uielements/formGroup';

import * as walletActions from '../../redux/wallet/actions';

const { saveWallet } = walletActions;

const Keystore = props => {
  const [keystore, setKeystore] = useState(null);
  const [password, setPassword] = useState(null);
  const [invalideStatus, setInvalideStatus] = useState(false);
  const [keystoreError, setKeystoreError] = useState(null);

  const history = useHistory();

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
    setInvalideStatus(false);
  };

  const unlock = e => {
    e.preventDefault();

    try {
      const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
      const address = crypto.getAddressFromPrivateKey(
        privateKey,
        Binance.getPrefix(),
      );

      props.saveWallet({
        type: 'keystore',
        wallet: address,
        keystore,
      });

      // clean up
      setPassword(null);
      setKeystore(null);

      // redirect to previous page

      history.goBack();
    } catch (error) {
      setInvalideStatus(true);
      console.error(error);
    }
  };

  const ready = (password || '').length > 0 && keystoreError === null;

  const title = (
    <div>
      Decryption password{' '}
      <Tooltip
        title="This is the password used to decrypt your encrypted keystore file"
        placement="bottomRight"
      >
        <Icon type="question-circle" />
      </Tooltip>
    </div>
  );

  return (
    <ContentWrapper>
      <div className="keystore-connect-wrapper">
        <Label weight="bold" color="normal">
          Select Keystore File
        </Label>
        <FilePicker
          onChange={f => uploadKeystore(f)}
          onError={err => console.error(err)}
        >
          <div className="file-upload-wrapper">
            <Button color="primary" typevalue="outline">
              <Icon type="upload" />
              Choose File to Upload
            </Button>
            &nbsp;
            {keystore && !keystoreError && (
              <Icon
                type="check-circle"
                theme="twoTone"
                twoToneColor="#52c41a"
              />
            )}
          </div>
        </FilePicker>
        {keystoreError && (
          <span style={{ color: '#FF4136' }}>{keystoreError}</span>
        )}
        <FormGroup
          className={invalideStatus ? 'has-error' : ''}
          title={title}
          description="This is the password used to decrypt your encrypted keystore file"
        >
          <Form onSubmit={unlock}>
            <Input.Password
              data-test="keystore-password"
              onChange={onPasswordChange}
              placeholder="password"
              allowClear
            />
            {invalideStatus && (
              <div className="ant-form-explain">Password is wrong!</div>
            )}
          </Form>
        </FormGroup>
        <Row className="keystore-footer">
          <Button
            className="unlock-btn"
            data-test="keystore-submit"
            htmlType="submit"
            onClick={unlock}
            disabled={!ready}
            round="true"
          >
            Unlock
          </Button>
        </Row>
      </div>
    </ContentWrapper>
  );
};

Keystore.propTypes = {
  saveWallet: PropTypes.func.isRequired,
};

export default connect(null, {
  saveWallet,
})(Keystore);
