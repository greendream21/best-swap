import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { InputWrapper } from './input.style';

class Input extends Component {
  render() {
    return <InputWrapper {...this.props} />;
  }
}

Input.propTypes = {
  typevalue: PropTypes.oneOf(['normal', 'ghost']),
  sizevalue: PropTypes.oneOf(['small', 'normal', 'big']),
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'error']),
};

Input.defaultProps = {
  typevalue: 'normal',
  sizevalue: 'normal',
  color: 'primary',
};

export default Input;
