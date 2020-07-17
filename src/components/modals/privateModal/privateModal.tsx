import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Form } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { delay } from '@thorchain/asgardex-util';
import { client as binanceClient } from '@thorchain/asgardex-binance';

import Input from '../../uielements/input';
import Label from '../../uielements/label';

import { StyledModal, ModalContent } from './privateModal.style';
import { RootState } from '../../../redux/store';
import { verifyPrivateKey } from '../../../helpers/utils/walletUtils';

import { BINANCE_NET } from '../../../env';
import { FixmeType } from '../../../types/bepswap';

type Props = {
  visible: boolean;
  onOk?: () => void;
  onCancel?: () => void;
};

const PrivateModal: React.FC<Props> = (props): JSX.Element => {
  const { visible, onOk, onCancel } = props;

  const history = useHistory();

  const [password, setPassword] = useState('');
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [validating, setValidating] = useState(false);

  const user = useSelector((state: RootState) => state.Wallet.user);
  const walletType = user?.type ?? 'disconnected';

  useEffect(() => {
    // ask to verify ledger
    if (walletType === 'ledger') {
      setValidating(true);
      verifyLedger();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletType]);

  const handleLedgerVerifySuccess = () => {
    setValidating(false);
  };

  const handleLedgerVerifyFailed = () => {
    console.log('ledger verify failed');
  };

  const verifyLedger = async () => {
    const ledger = user?.ledger;
    const hdPath = user?.hdPath;

    if (!ledger || !hdPath) {
      return;
    }

    // TODO: Update asgardex binance
    const bncClient: FixmeType = await binanceClient(BINANCE_NET);

    bncClient.useLedgerSigningDelegate(
      ledger,
      null,
      handleLedgerVerifySuccess,
      handleLedgerVerifyFailed,
      hdPath,
    );
  };

  const onChangePasswordHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setInvalidPassword(false);
    },
    [setPassword, setInvalidPassword],
  );

  const handleOK = useCallback(async () => {
    const address = user?.wallet;

    // prevent confirm if wallet is disconnected
    if (!address || !onOk) {
      return;
    }

    // confirm if ledger is verified
    if (walletType === 'ledger' && !validating) {
      onOk();
      return;
    }

    // verify password if wallet type is keystore
    if (walletType === 'keystore' && user?.keystore) {
      setValidating(true);
      // Short delay to render latest state changes of `validating`
      await delay(200);
      // verify private key
      const result = await verifyPrivateKey(user?.keystore, password);

      if (result.error) {
        setInvalidPassword(true);
      } else if (result.address === address) {
        // confirm if decoded address is matched to the user's wallet address
        onOk();
      }
      setValidating(false);
      return;
    }

    // if trustwallet is connected, check if session is valid
    if (walletType === 'walletconnect' && user?.walletConnector) {
      onOk();
    }

    // if wallet is disconnected, go to wallet connect page
    if (walletType === 'disconnected') {
      history.push('/connect');
    }
  }, [user, walletType, validating, history, password, onOk]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      setPassword('');
      setInvalidPassword(false);
      setValidating(false);
      onCancel();
    }
  }, [onCancel]);

  const modalTitle = useMemo(() => {
    if (walletType === 'keystore') return 'PASSWORD CONFIRMATION';
    if (walletType === 'ledger') return 'LEDGER CONFIRMATION';
    if (walletType === 'walletconnect') return 'TRANSACTION CONFIRMATION';

    return 'CONNECT WALLET';
  }, [walletType]);

  const renderModalContent = () => {
    if (walletType === 'keystore') {
      return (
        <Form onFinish={handleOK} autoComplete="off">
          <Form.Item
            className={invalidPassword ? 'has-error' : ''}
            extra={validating ? 'Validating password ...' : ''}
          >
            <Input
              data-test="password-confirmation-input"
              type="password"
              typevalue="ghost"
              sizevalue="big"
              value={password}
              onChange={onChangePasswordHandler}
              prefix={<LockOutlined />}
              autoComplete="off"
            />
            {invalidPassword && (
              <div className="ant-form-explain">Password is wrong!</div>
            )}
          </Form.Item>
        </Form>
      );
    }

    if (walletType === 'ledger') {
      if (validating) {
        return (
          <ModalContent>
            <Label>Verifying Ledger...</Label>
          </ModalContent>
        );
      }

      return (
        <ModalContent>
          <Label>Ledger Verified!</Label>
        </ModalContent>
      );
    }

    if (walletType === 'walletconnect') {
      return (
        <ModalContent>
          <Label>Please confirm the transaction!</Label>
        </ModalContent>
      );
    }

    // if wallet is not connected
    return (
      <ModalContent>
        <Label>Wallet is not connected!</Label>
      </ModalContent>
    );
  };

  const confirmBtnText = walletType === 'disconnected' ? 'CONNECT' : 'CONFIRM';

  return (
    <StyledModal
      title={modalTitle}
      visible={visible}
      onOk={handleOK}
      onCancel={handleCancel}
      maskClosable={false}
      closable={false}
      okText={confirmBtnText}
      cancelText="CANCEL"
    >
      {renderModalContent()}
    </StyledModal>
  );
};

export default PrivateModal;
