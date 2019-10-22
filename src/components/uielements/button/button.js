import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonWrapper } from './button.style';

class Button extends Component {
  static propTypes = {
    sizevalue: PropTypes.oneOf(['small', 'normal', 'big']),
    color: PropTypes.oneOf(['primary', 'success', 'warning', 'error']),
    weight: PropTypes.string,
    typevalue: PropTypes.oneOf(['default', 'outline', 'ghost']),
    focused: PropTypes.bool,
    round: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    sizevalue: 'normal',
    color: 'primary',
    weight: '500',
    typevalue: 'default',
    focused: false,
    round: false,
    className: '',
  };

  render() {
    const { focused, children, className, ...props } = this.props;
    const focusedStyle = focused ? 'focused' : '';

    return (
      <ButtonWrapper
        className={`${className} btn-wrapper ${focusedStyle}`}
        type="primary"
        {...props}
      >
        {children}
      </ButtonWrapper>
    );
  }
}

export default Button;
