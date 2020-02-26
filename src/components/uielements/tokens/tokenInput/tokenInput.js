import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TokenInputWrapper } from './tokenInput.style';
import CoinInputAdvanced from '../../coins/coinInputAdvanced';

class TokenInput extends Component {
  inputRef = React.createRef();

  onChange = value => {
    this.props.onChange(value);
  };

  handleClickWrapper = () => {
    this.inputRef.current.firstChild.focus();
  };

  render() {
    const {
      title,
      value,
      status,
      label,
      className,
      inputProps,
      ...props
    } = this.props;

    return (
      <TokenInputWrapper
        className={`tokenInput-wrapper ${className}`}
        onClick={this.handleClickWrapper}
        {...props}
      >
        <div className="token-input-header">
          <p className="token-input-title">{title}</p>
          <p className="token-input-header-label">{status}</p>
        </div>
        <div className="token-input-content" ref={this.inputRef}>
          <CoinInputAdvanced
            className="token-amount-input"
            size="default"
            value={value}
            onChangeValue={this.onChange}
            {...inputProps}
          />
          <p className="token-amount-label">{label}</p>
        </div>
      </TokenInputWrapper>
    );
  }
}

TokenInput.propTypes = {
  title: PropTypes.string,
  status: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

TokenInput.defaultProps = {
  title: '',
  value: '',
  status: '',
  label: '',
  inputProps: {},
  className: '',
};

export default TokenInput;
