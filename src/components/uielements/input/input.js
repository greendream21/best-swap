import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InputWrapper } from './input.style';

class Input extends Component {
  static propTypes = {
    typevalue: PropTypes.oneOf(['normal', 'ghost']),
    sizevalue: PropTypes.oneOf(['small', 'normal', 'big']),
    color: PropTypes.oneOf(['primary', 'success', 'warning', 'error']),
  };

  static defaultProps = {
    typevalue: 'normal',
    sizevalue: 'normal',
    color: 'primary',
  };

  render() {
    return <InputWrapper {...this.props} />;
  }
}

export default Input;
