import React, { useState, useCallback } from 'react';

import { FilePicker } from 'react-file-picker';
import { useHistory } from 'react-router-dom';

import {
  QuestionCircleOutlined,
  UploadOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons';
import { crypto } from '@binance-chain/javascript-sdk';
import { delay } from '@thorchain/asgardex-util';
import { Row, Input, Form, Tooltip } from 'antd';


import Button from 'components/uielements/button';
import FormGroup from 'components/uielements/formGroup';
import Label from 'components/uielements/label';

import * as walletActions from 'redux/wallet/actions';

import { Maybe, Nothing, FixmeType } from 'types/bepswap';

import { asgardexBncClient } from '../../env';
import { ContentWrapper, KeystoreTitle } from './ConnectView.style';

type Props = {
  saveWallet: typeof walletActions.saveWallet;
};

const Keystore: React.FC<Props> = (props: Props): JSX.Element => {
  const { saveWallet } = props;

  const [keystore, setKeystore] = useState<Maybe<FixmeType>>(Nothing);
  const [password, setPassword] = useState<string>('');
  const [invalideStatus, setInvalideStatus] = useState(false);
  const [keystoreError, setKeystoreError] = useState<Maybe<string>>(Nothing);
  const [processing, setProcessing] = useState(false);

  const history = useHistory();

  const onChangeFile = useCallback((file: Blob) => {
    const reader = new FileReader();
    const onLoadHandler = () => {
      try {
        const key = JSON.parse(reader.result as string);
        if (!('version' in key) || !('crypto' in key)) {
          setKeystoreError('Not a valid keystore file');
        } else {
          setKeystoreError(Nothing);
          setKeystore(key);
        }
      } catch {
        setKeystoreError('Not a valid json file');
      }
    };
    reader.addEventListener('load', onLoadHandler);
    reader.readAsText(file);
    return () => {
      reader.removeEventListener('load', onLoadHandler);
    };
  }, []);

  const onErrorFile = useCallback((error: Error) => {
    setKeystoreError(`Selecting a key file failed: ${error}`);
  }, []);

  const onPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setInvalideStatus(false);
    },
    [],
  );

  const unlock = useCallback(async () => {
    setProcessing(true);
    // Short delay to render processing message`
    await delay(200);
    try {
      const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
      const address = crypto.getAddressFromPrivateKey(
        privateKey,
        asgardexBncClient.getPrefix(),
      );

      saveWallet({
        type: 'keystore',
        wallet: address,
        keystore,
      });

      // clean up
      setPassword('');
      setKeystore(Nothing);

      // redirect to pool view page
      history.push('/pools');
    } catch (error) {
      setInvalideStatus(true);
      console.error(error);
    }
    setProcessing(false);
  }, [history, keystore, password, saveWallet]);

  const ready = (password || '').length > 0 && !keystoreError && !processing;

  const title = (
    <KeystoreTitle>
      <Label>Decryption password </Label>
      <Tooltip
        title="This is the password used to decrypt your encrypted keystore file"
        placement="bottomRight"
      >
        <QuestionCircleOutlined />
      </Tooltip>
    </KeystoreTitle>
  );

  return (
    <ContentWrapper>
      <div className="keystore-connect-wrapper">
        <Label weight="bold" color="normal">
          Select Keystore File
        </Label>
        <FilePicker onChange={onChangeFile} onError={onErrorFile}>
          <div className="file-upload-wrapper">
            <Button color="primary" typevalue="outline">
              {keystore && !keystoreError && (
                <CheckCircleTwoTone
                  className="keystore-upload-icon"
                  twoToneColor="#50E3C2"
                />
              )}
              {(!keystore || keystoreError) && <UploadOutlined />}
              Choose File to Upload
            </Button>
          </div>
        </FilePicker>
        {keystoreError && <Label color="error">{keystoreError}</Label>}
        <FormGroup
          className={invalideStatus ? 'has-error' : ''}
          title={title}
          description="This is the password used to decrypt your encrypted keystore file"
        >
          <Form onFinish={unlock}>
            <Input.Password
              data-test="keystore-password"
              onChange={onPasswordChange}
              placeholder="password"
              allowClear
              disabled={!keystore}
            />
            {invalideStatus && (
              <div className="ant-form-explain">
                <Label color="error">Password is wrong!</Label>
              </div>
            )}
          </Form>
        </FormGroup>
        <Row className="keystore-footer">
          <div>
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
            {processing && (
              <Label color="input" size="small" weight="bold">
                Unlocking wallet ...
              </Label>
            )}
          </div>
        </Row>
      </div>
    </ContentWrapper>
  );
};

export default Keystore;
