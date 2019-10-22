import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinButtonWrapper } from './coinButton.style';
import CoinIcon from '../coinIcon';
import Label from '../../label';

class CoinButton extends Component {
  static propTypes = {
    cointype: PropTypes.string,
    typevalue: PropTypes.string,
    price: PropTypes.string,
    reversed: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    cointype: 'bnb',
    typevalue: 'normal',
    price: '0',
    reversed: false,
    className: '',
  };

  render() {
    const { cointype, reversed, price, className, ...props } = this.props;
    const priceValue = `$${price}`;

    return (
      <CoinButtonWrapper
        className={`coinButton-wrapper ${className}`}
        sizevalue="big"
        reversed={reversed}
        {...props}
      >
        <div className="coinButton-content">
          <CoinIcon type={cointype} />
          <div className="coin-value">
            <Label size="large" weight="500">
              {cointype}
            </Label>
            <Label color="input">{priceValue}</Label>
          </div>
        </div>
      </CoinButtonWrapper>
    );
  }
}

export default CoinButton;
