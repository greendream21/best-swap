import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TokenSelectWrapper } from './tokenSelect.style';

class TokenSelect extends Component {
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
      <TokenSelectWrapper
        className={`tokenSelect-wrapper ${className}`}
        {...props}
      >
        sample
      </TokenSelectWrapper>
    );
  }
}

export default TokenSelect;
