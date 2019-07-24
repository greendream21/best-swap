import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonWrapper } from './button.style';

class Button extends Component {
  static propTypes = {
    sizevalue: PropTypes.oneOf(['small', 'normal', 'big']),
    color: PropTypes.oneOf(['primary', 'success', 'warning', 'error']),
    weight: PropTypes.string,
    typevalue: PropTypes.oneOf(['default', 'outline', 'ghost']),
  };

  static defaultProps = {
    sizevalue: 'normal',
    color: 'primary',
    weight: 'bold',
    typevalue: 'default',
  };

  render() {
    const { children, ...props } = this.props;

    return (
      <ButtonWrapper type="primary" {...props}>
        {children}
      </ButtonWrapper>
    );
  }
}

export default Button;
