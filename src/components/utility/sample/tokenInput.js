import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TokenInputWrapper } from './tokenInput.style';

class Status extends Component {
  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    value: '',
    className: '',
  };

  render() {
    const { title, value, className, ...props } = this.props;

    return (
      <TokenInputWrapper
        className={`tokenInput-wrapper ${className}`}
        {...props}
      >
        sample
      </TokenInputWrapper>
    );
  }
}

export default Status;
