import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ModalWrapper } from './modal.style';

class Modal extends Component {
  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    title: '',
    value: '',
    className: '',
  };

  render() {
    const { title, value, className, children, ...props } = this.props;

    return (
      <ModalWrapper className={`modal-wrapper ${className}`} {...props}>
        {children}
      </ModalWrapper>
    );
  }
}

export default Modal;
