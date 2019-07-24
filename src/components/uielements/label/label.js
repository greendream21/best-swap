import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LabelWrapper } from './label.style';

class Label extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['tiny', 'small', 'normal', 'big', 'large']),
    color: PropTypes.oneOf([
      'primary',
      'success',
      'warning',
      'error',
      'normal',
      'light',
      'dark',
      'gray',
      'input',
      'white',
    ]),
    weight: PropTypes.string,
  };

  static defaultProps = {
    size: 'normal',
    color: 'normal',
    weight: 'normal',
  };

  render() {
    const { children, ...props } = this.props;
    return <LabelWrapper {...props}>{children}</LabelWrapper>;
  }
}

export default Label;
