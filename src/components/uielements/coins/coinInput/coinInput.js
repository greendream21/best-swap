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
    step: PropTypes.number,
    reverse: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    asset: 'bnb',
    amount: 0,
    price: 1,
    step: 1,
    slip: undefined,
    reverse: false,
    className: '',
    onChange: () => {},
  };

  render() {
    const {
      title,
      asset,
      amount,
      price,
      slip,
      step,
      className,
      onChange,
      ...props
    } = this.props;

    const totalPrice = (amount * price).toFixed(2);
    const priceLabel = `$${totalPrice} (USD)`;

    return (
      <CoinInputWrapper className={`coinInput-wrapper ${className}`} {...props}>
        <Label className="title-label" color="light" weight="bold">
          {title}
        </Label>
        <div className="coin-button-wrapper">
          <CoinButton
            className="coin-button"
            cointype={asset}
            reversed={this.props.reverse}
            focused
          />
        </div>
        <Label className="amount-label" color="light" weight="bold">
          Set amount:
        </Label>
        <div className="amount-wrapper">
          <InputNumber
            className="asset-amount-input"
            value={amount}
            onChange={onChange}
            min={0}
            step={step}
            placeholder="100000"
          />
          <Label className="asset-name-label" color="gray" weight="bold">
            {asset}
          </Label>
        </div>
        <Label className="asset-price-label" color="gray">
          {priceLabel}
        </Label>
        {slip !== undefined && (
          <Label className="asset-price-label" color="gray">
            SLIP: {slip.toFixed(2)} %
          </Label>
        )}
      </CoinInputWrapper>
    );
  }
}

export default CoinInput;
