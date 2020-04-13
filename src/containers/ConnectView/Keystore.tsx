import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { crypto } from '@binance-chain/javascript-sdk';
import { FilePicker } from 'react-file-picker';
import { Row, Icon, Input, Form, Tooltip } from 'antd';

import { binance, util } from 'asgardex-common';
import { ContentWrapper } from './ConnectView.style';

import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import FormGroup from '../../components/uielements/formGroup';

import * as walletActions from '../../redux/wallet/actions';
import { Maybe, Nothing, FixmeType } from '../../types/bepswap';
import { BINANCE_NET } from '../../env';

type ConnectedProps = {
  saveWallet: typeof walletActions.saveWallet;
};

type ComponentProps = {};

type Props = ComponentProps & ConnectedProps;

const Keystore: React.FC<Props> = (props: Props): JSX.Element => {
  const { saveWallet } = props;

  const [keystore, setKeystore] = useState<Maybe<FixmeType>>(Nothing);
  const [password, setPassword] = useState<Maybe<string>>(Nothing);
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
    await util.delay(200);
    try {
      const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
      const address = crypto.getAddressFromPrivateKey(
        privateKey,
        binance.getPrefix(BINANCE_NET),
      );

      saveWallet({
        wallet: address,
        keystore,
      });

      // clean up
      setPassword(Nothing);
      setKeystore(Nothing);

      // redirect to previous page
      history.goBack();
    } catch (error) {
      setInvalideStatus(true);
      console.error(error);
    }
    setProcessing(false);
  }, [history, keystore, password, saveWallet]);

  const ready = (password || '').length > 0 && !keystoreError && !processing;

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
        <FilePicker onChange={onChangeFile} onError={onErrorFile}>
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
              disabled={!keystore}
            />
            {invalideStatus && (
              <div className="ant-form-explain">Password is wrong!</div>
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

export default connect(null, {
  saveWallet: walletActions.saveWallet,
})(Keystore);
