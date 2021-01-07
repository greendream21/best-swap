import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { LockOutlined } from '@ant-design/icons';
import { delay } from '@thorchain/asgardex-util';
import { Form } from 'antd';

import * as midgardActions from 'redux/midgard/actions';
import { RootState } from 'redux/store';

import usePrevious from 'hooks/usePrevious';
import useTimeout from 'hooks/useTimeout';

import { verifyPrivateKey } from 'helpers/utils/walletUtils';

import { bncClient } from '../../../env';
import Input from '../../uielements/input';
import Label from '../../uielements/label';
import showNotification from '../../uielements/notification';
import { StyledModal, ModalContent, ModalIcon } from './privateModal.style';

const MODAL_DISMISS_TIME = 15 * 1000; // 15s

type Props = {
  visible: boolean;
  onOk?: () => void;
  onCancel: () => void;
  onPoolAddressLoaded?: () => void;
};

const PrivateModal: React.FC<Props> = (props): JSX.Element => {
  const { visible, onOk, onCancel, onPoolAddressLoaded = () => {} } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [validating, setValidating] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  const user = useSelector((state: RootState) => state.Wallet.user);
  const poolAddressLoading = useSelector(
    (state: RootState) => state.Midgard.poolAddressLoading,
  );
  const walletType = user?.type ?? 'disconnected';

  console.log('visible:', visible);
  console.log('validating:', validating);
  console.log('confirmed:', confirmed);
  console.log('addressLoading:', addressLoading);
  console.log('poolAddressLoading:', poolAddressLoading);

  // dismiss modal after 15s automatically
  useTimeout(() => {
    handleCancel();
  }, MODAL_DISMISS_TIME);

  // load pool address before making transaction
  const prevVisible = usePrevious(visible);
  useEffect(() => {
    // if private modal is open
    if (prevVisible === false && visible === true) {
      dispatch(midgardActions.getPoolAddress());

      // if wallet type is ledger, ask users to verify ledger
      if (walletType === 'ledger') {
        verifyLedger();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // check if pool address is loaded
  const prevPoolAddressLoading = usePrevious(poolAddressLoading);
  useEffect(() => {
    if (
      prevPoolAddressLoading === true &&
      poolAddressLoading === false &&
      visible
    ) {
      setAddressLoading(false);

      // call onPoolAddressLoaded props
      onPoolAddressLoaded();

      // if wallet is verified, confirm
      if (confirmed && onOk) {
        console.log('address loading confirm', confirmed);

        onOk();
      }
    }
  }, [
    poolAddressLoading,
    prevPoolAddressLoading,
    visible,
    confirmed,
    onOk,
    onPoolAddressLoaded,
  ]);

  const handleLedgerVerifyFailed = () => {
    console.log('LEDGER DEBUG: VERIFY FAILED');
    setValidating(false);
    showNotification({
      type: 'error',
      message: 'Ledger Verification Failed',
      description: 'Please verify your ledger again!',
      duration: 10,
    });
  };

  const handleLedgerVerifySuccess = () => {
    console.log('LEDGER DEBUG: VERIFY SUCCESS');
    setValidating(false);
    showNotification({
      type: 'success',
      message: 'Ledger Signing Successful',
      description: 'Transaction was signed successfully.',
      duration: 5,
    });

    // close modal and confirm transaction after signing ledger without clicking confirm button
    handleConfirm();
  };

  const handleLedgerPresign = () => {
    console.log('LEDGER DEBUG: PRESIGN CALLED');
    showNotification({
      type: 'info',
      message: 'Ledger signing requested',
      description: 'Please approve the transaction on your ledger.',
      duration: 5,
    });
  };

  const verifyLedger = async () => {
    const ledger = user?.ledger;
    const hdPath = user?.hdPath;

    if (!ledger || !hdPath) {
      console.log('LEDGER DEBUG: MISSING LEDGER OR HDPATH');
      return;
    }

    try {
      await bncClient.useLedgerSigningDelegate(
        ledger,
        handleLedgerPresign,
        handleLedgerVerifySuccess,
        handleLedgerVerifyFailed,
        hdPath,
      );
    } catch (error) {
      console.log('ledger verify error: ', error);
    }
  };

  const onChangePasswordHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setInvalidPassword(false);
    },
    [setPassword, setInvalidPassword],
  );

  const handleConfirm = useCallback(() => {
    console.log('DEBUG: CONFIRMING');
    if (!onOk) {
      return;
    }

    if (!addressLoading) {
      onOk();
    } else {
      setConfirmed(true);
    }
  }, [addressLoading, onOk]);

  const handleOK = useCallback(async () => {
    console.log('DEBUG: OK');
    const address = user?.wallet;

    // prevent confirm if wallet is disconnected
    if (!address) {
      return;
    }

    // confirm if ledger is verified
    if (walletType === 'ledger' && !validating) {
      await delay(200);

      handleConfirm();
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
        handleConfirm();
      }
      setValidating(false);
      return;
    }

    // if trustwallet is connected, check if session is valid
    if (walletType === 'walletconnect' && user?.walletConnector) {
      handleConfirm();
    }

    // if wallet is disconnected, go to wallet connect page
    if (walletType === 'disconnected') {
      history.push('/connect');
    }
  }, [user, walletType, validating, history, password, handleConfirm]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      setPassword('');
      setInvalidPassword(false);
      setValidating(false);
      setAddressLoading(true);
      setConfirmed(false);
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
    const modalIcon = (
      <ModalIcon>
        <LockOutlined />
      </ModalIcon>
    );

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
              prefix={modalIcon}
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
      return (
        <ModalContent>
          <Label>CLICK CONFIRM TO SIGN WITH LEDGER!</Label>
        </ModalContent>
      );
    }

    if (walletType === 'walletconnect') {
      return (
        <ModalContent>
          <Label>CONFIRM TX USING YOUR TRUSTWALLET!</Label>
        </ModalContent>
      );
    }

    // if wallet is not connected
    return (
      <ModalContent>
        <Label>WALLET IS NOT CONNECTED!</Label>
      </ModalContent>
    );
  };

  const confirmBtnText = walletType === 'disconnected' ? 'CONNECT' : 'CONFIRM';
  const confirmLoading = confirmed && addressLoading;

  // if the type of wallet is "walletconnect", remove footer
  const footer = walletType !== 'walletconnect' ? undefined : null;

  return (
    <StyledModal
      title={modalTitle}
      visible={visible}
      onOk={handleOK}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      maskClosable={false}
      closable={false}
      okText={confirmBtnText}
      cancelText="CANCEL"
      footer={footer}
    >
      {renderModalContent()}
    </StyledModal>
  );
};

export default PrivateModal;
