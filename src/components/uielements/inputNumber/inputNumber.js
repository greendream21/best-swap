import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumberWrapper } from './inputNumber.style';

class InputNumber extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['small', 'default', 'big']),
    color: PropTypes.oneOf(['primary', 'success', 'warning', 'error']),
  };

  static defaultProps = {
    size: 'small',
    color: 'primary',
  };

  handleParser = string => {
    const num = Number(string);
    if (isNaN(num)) {
      return 0;
    }
    return num;
  };

  render() {
    const { ...props } = this.props;

    return <InputNumberWrapper parser={this.handleParser} {...props} />;
  }
}

export default InputNumber;
