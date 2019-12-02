import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ModalWrapper } from './modal.style';

class Modal extends Component {
  static propTypes = {
    value: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    value: '',
    className: '',
  };

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

export default Modal;
