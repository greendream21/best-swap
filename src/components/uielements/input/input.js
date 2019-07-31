import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InputWrapper } from './input.style';

class Input extends Component {
  static propTypes = {
    sizevalue: PropTypes.oneOf(['small', 'normal', 'big']),
    color: PropTypes.oneOf(['primary', 'success', 'warning', 'error']),
  };

  static defaultProps = {
    sizevalue: 'normal',
    color: 'primary',
  };

  render() {
    return <InputWrapper {...this.props} />;
  }
}

export default Input;
