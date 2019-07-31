import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InputNumberWrapper } from './inputNumber.style';

class InputNumber extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['small', 'default', 'big']),
    color: PropTypes.oneOf(['primary', 'success', 'warning', 'error']),
  };

  static defaultProps = {
    size: 'default',
    color: 'primary',
  };

  render() {
    return <InputNumberWrapper {...this.props} />;
  }
}

export default InputNumber;
