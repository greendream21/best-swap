import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonWrapper } from './button.style';

class Button extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['small', 'normal', 'big']),
    color: PropTypes.oneOf(['primary', 'success', 'warning', 'error']),
    weight: PropTypes.string,
    type: PropTypes.oneOf(['default', 'outline', 'ghost']),
  };

  static defaultProps = {
    size: 'normal',
    color: 'primary',
    weight: 'bold',
    type: 'default',
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
