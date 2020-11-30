import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { TokenInputWrapper } from './tokenInput.style';

class Status extends Component {
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

Status.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
};

Status.defaultProps = {
  title: '',
  value: '',
  className: '',
};

export default Status;
