import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Button from '../button';

class WalletButton extends Component {
  static propTypes = {
    connected: PropTypes.bool,
    value: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    connected: false,
    className: '',
  };

  getBtnValue = () => {
    const { connected, value } = this.props;

    if (!connected) {
      return (
        <span>
          <Icon
            type="folder-add"
            theme="filled"
            style={{
              display: 'inline',
              marginRight: '6px',
              top: '1px',
              position: 'relative',
            }}
          />
          Add Wallet
        </span>
      );
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
      <Button
        className={`${className} wallet-btn-wrapper`}
        sizevalue="normal"
        color="primary"
        round="true"
        {...props}
      >
        {this.getBtnValue()}
      </Button>
    );
  }
}

export default WalletButton;
