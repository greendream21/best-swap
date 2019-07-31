import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinInputWrapper } from './coinInput.style';
import { coinGroup } from '../../../../settings';
import CoinButton from '../coinButton';
import InputNumber from '../../inputNumber';
import Label from '../../label';

class CoinInput extends Component {
  static propTypes = {
    title: PropTypes.string,
    asset: PropTypes.oneOf(coinGroup),
    amount: PropTypes.number,
    price: PropTypes.number,
    slip: PropTypes.number,
    reverse: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    asset: 'bnb',
    amount: 0,
    price: 1,
    slip: null,
    reverse: false,
    className: '',
  };

  render() {
    const {
      title,
      asset,
      amount,
      price,
      slip,
      className,
      ...props
    } = this.props;

    const totalPrice = amount * price;
    const priceLabel = `$${totalPrice} (USD)`;

    return (
      <CoinInputWrapper className={`CoinInput-wrapper ${className}`} {...props}>
        <Label className="title-label" color="light" weight="bold">
          {title}
        </Label>
        <div className="coin-button-wrapper">
          <CoinButton className="coin-button" cointype={asset} />
        </div>
        <Label className="amount-label" color="light" weight="bold">
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
        {slip && (
          <Label className="asset-price-label" color="gray">
            SLIP: {slip} %
          </Label>
        )}
      </CoinInputWrapper>
    );
  }
}

export default CoinInput;
