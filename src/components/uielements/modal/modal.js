import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ModalWrapper } from './modal.style';

class Modal extends Component {
  render() {
    const { value, className, children, ...props } = this.props;

    return (
      <ModalWrapper
        className={`modal-wrapper ${className}`}
        okButtonProps={{ className: 'ok-ant-btn' }}
        cancelButtonProps={{ className: 'cancel-ant-btn' }}
        {...props}
      >
        {children}
      </ModalWrapper>
    );
  }
}

Modal.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Modal.defaultProps = {
  value: '',
  className: '',
};

export default Modal;
