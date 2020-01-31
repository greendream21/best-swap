import React from 'react';
import { Form, Icon } from 'antd';

import Input from '../../uielements/input';
import { StyledModal } from './privateModal.style';

interface Props {
  visible: boolean;
  invalidPassword: boolean;
  validatingPassword: boolean;
  password: string;
  onChangePassword?: () => void;
  onOk?: () => void;
  onCancel?: () => void;
}

const PrivateModal: React.FC<Props> = (props): JSX.Element => {
  const {
    visible,
    invalidPassword,
    validatingPassword,
    password,
    onChangePassword,
    onOk,
    onCancel,
  } = props;

  return (
    <StyledModal
      title="PASSWORD CONFIRMATION"
      visible={visible}
      onOk={!validatingPassword ? onOk : undefined}
      onCancel={onCancel}
      maskClosable={false}
      closable={false}
      okText="CONFIRM"
      cancelText="CANCEL"
    >
      <Form onSubmit={onOk} autoComplete="off">
        <Form.Item
          className={invalidPassword ? 'has-error' : ''}
          extra={validatingPassword ? 'Validating password ...' : ''}
        >
          <Input
            data-test="password-confirmation-input"
            type="password"
            typevalue="ghost"
            sizevalue="big"
            value={password}
            onChange={onChangePassword}
            prefix={<Icon type="lock" />}
            autoComplete="off"
          />
          {invalidPassword && (
            <div className="ant-form-explain">Password is wrong!</div>
          )}
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

export default PrivateModal;
