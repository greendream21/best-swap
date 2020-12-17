import React, { useState, useCallback } from 'react';

import { Form } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import Input from '../../uielements/input';
import Label from '../../uielements/label';
import * as Styled from './verifyModal.style';

export interface Props extends ModalProps {
  description: string;
  verifyLevel: 'normal' | 'high';
  verifyText?: string;
  onConfirm: () => void;
};

const VerifyModal: React.FC<Props> = (props: Props): JSX.Element => {
  const { description, verifyLevel, verifyText = 'CONFIRM', onConfirm, ...otherProps } = props;

  const [confirmTextValue, setConfirmTextValue] = useState('');
  const [invalidText, setInvalidText] = useState(true);

  const handleConfirm = useCallback(() => {
    if (confirmTextValue === verifyText) {
      onConfirm();
    }
  }, [onConfirm, confirmTextValue, verifyText]);

  const handleChangeConfirmText = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    if (text === verifyText) {
      setInvalidText(false);
    } else {
      setInvalidText(true);
    }

    setConfirmTextValue(e.target.value);
  }, [setConfirmTextValue, setInvalidText, verifyText]);

  const renderModalContent = () => {
    if (verifyLevel === 'normal') {
      return (
        <Label>{description}</Label>
      );
    } else {
      const color = invalidText ? 'error' : 'success';

      return (
        <>
          <Label>{description}</Label>
          <Form onFinish={handleConfirm} autoComplete="off">
            <Form.Item
              className={invalidText ? 'has-error' : ''}
            >
              <Input
                typevalue="ghost"
                sizevalue="big"
                value={confirmTextValue}
                onChange={handleChangeConfirmText}
                autoComplete="off"
                color={color}
              />
            </Form.Item>
          </Form>
        </>
      );
    }
  };

  const confirmDisabled = verifyLevel === 'high' && invalidText;

  return (
    <Styled.Modal
      okText="CONFIRM"
      cancelText="CANCEL"
      okButtonProps={{
        className: 'ok-ant-btn',
        disabled: confirmDisabled,
      }}
      onOk={onConfirm}
      {...otherProps}
    >
      <Styled.ModalContent>
        {renderModalContent()}
      </Styled.ModalContent>
    </Styled.Modal>
  );
};

export default VerifyModal;
