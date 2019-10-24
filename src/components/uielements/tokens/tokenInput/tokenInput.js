import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TokenInputWrapper } from './tokenInput.style';
import CoinInputAdvanced from '../../coins/coinInputAdvanced';

class TokenInput extends Component {
  static propTypes = {
    title: PropTypes.string,
    status: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    value: '',
    status: '',
    label: '',
    className: '',
  };

  onChange = e => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { title, value, status, label, className, ...props } = this.props;

    return (
      <TokenInputWrapper
        className={`tokenInput-wrapper ${className}`}
        {...props}
      >
        <div className="token-input-header">
          <p className="token-input-title">{title}</p>
          <p className="token-input-header-label">{status}</p>
        </div>
        <div className="token-input-content">
          <CoinInputAdvanced
            className="token-amount-input"
            size="normal"
            value={value}
            onChange={this.onChange}
          />
          <p className="token-amount-label">{label}</p>
        </div>
      </TokenInputWrapper>
    );
  }
}

export default TokenInput;
