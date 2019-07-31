import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';

import { CoinInputWrapper } from './coinInput.style';
import { coinGroup } from '../../../../settings';
import CoinButton from '../coinButton';
import Label from '../../label';

class CoinInput extends Component {
  static propTypes = {
    title: PropTypes.string,
    asset: PropTypes.oneOf(coinGroup),
    amount: PropTypes.number,
    price: PropTypes.number,
    className: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    asset: 'bnb',
    amount: 0,
    price: 1,
    className: '',
  };

  render() {
    const { title, asset, amount, price, className, ...props } = this.props;

    const totalPrice = amount * price;
    const priceLabel = `$${totalPrice} (USD)`;

    return (
      <CoinInputWrapper className={`CoinInput-wrapper ${className}`} {...props}>
        <Label className="title-label" weight="bold">
          {title}
        </Label>
        <CoinButton className="coin-button" cointype={asset} />
        <Label className="amount-label" weight="bold">
          Set amount:
        </Label>
        <div className="amount-wrapper">
          <InputNumber
            className="asset-amount-input"
            value={amount}
            min={0}
            placeholder="100000"
          />
          <Label className="asset-name-label" color="gray" weight="bold">
            {asset}
          </Label>
        </div>
        <Label className="asset-price-label" color="gray">
          {priceLabel}
        </Label>
      </CoinInputWrapper>
    );
  }
}

export default CoinInput;
