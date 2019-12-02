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
    inputProps: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    value: '',
    status: '',
    label: '',
    inputProps: {},
    className: '',
  };

  inputRef = React.createRef();

  onChange = e => {
    this.props.onChange(e.target.value);
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
            size="normal"
            value={value}
            onChange={this.onChange}
            {...inputProps}
          />
          <p className="token-amount-label">{label}</p>
        </div>
      </TokenInputWrapper>
    );
  }
}

export default TokenInput;
