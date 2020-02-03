/* eslint react/prop-types: 0 */

import React, { ReactNode } from 'react';

import { ModalProps } from 'antd/lib/modal';
import { ModalWrapper } from './modal.style';

interface Props extends ModalProps {
  className?: string;
  children?: ReactNode;
}

const Modal: React.FC<Props> = (props): JSX.Element => {
  const { className = '', children, ...others } = props;

  return (
    <ModalWrapper
      className={`modal-wrapper ${className}`}
      okButtonProps={{ className: 'ok-ant-btn' }}
      cancelButtonProps={{ className: 'cancel-ant-btn' }}
      {...others}
    >
      {children}
    </ModalWrapper>
  );
};

export default Modal;
