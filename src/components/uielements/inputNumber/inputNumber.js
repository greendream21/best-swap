import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumberWrapper } from './inputNumber.style';

class InputNumber extends Component {
  handleParser = string => {
    const num = Number(string);
    if (Number.isNaN(num)) {
      return 0;
    }
    return num;
  };

  render() {
    const { ...props } = this.props;

    return <InputNumberWrapper parser={this.handleParser} {...props} />;
  }
}

InputNumber.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'big']),
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'error']),
};

InputNumber.defaultProps = {
  size: 'small',
  color: 'primary',
};

export default InputNumber;
