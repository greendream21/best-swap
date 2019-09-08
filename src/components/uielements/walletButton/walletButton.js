import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonWrapper } from './walletButton.style';

class WalletButton extends Component {
  static propTypes = {
    connected: PropTypes.bool,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    connected: false,
    className: '',
  };

  getBtnValue = () => {
    const { connected, value } = this.props;

    if (!connected) {
      return 'Add Wallet';
    }

    if (connected) {
      if (value && value.length > 9) {
        const first = value.substr(0, 6);
        const last = value.substr(value.length - 4, 3);
        return `${first}...${last}`;
      }
      return value;
    }
  };

  render() {
    const { connected, value, className, ...props } = this.props;

    return (
      <ButtonWrapper
        className={`${className} wallet-btn-wrapper`}
        type="primary"
        {...props}
      >
        {this.getBtnValue()}
      </ButtonWrapper>
    );
  }
}

export default WalletButton;
