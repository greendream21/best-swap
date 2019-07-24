import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonWrapper } from './button.style';

class Button extends Component {
  static propTypes = {
    sizeType: PropTypes.oneOf(['small', 'normal', 'big']),
    color: PropTypes.oneOf(['primary', 'success', 'warning', 'error']),
    weight: PropTypes.string,
    viewType: PropTypes.oneOf(['default', 'outline', 'ghost']),
  };

  static defaultProps = {
    sizeType: 'normal',
    color: 'primary',
    weight: 'bold',
    viewType: 'default',
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
