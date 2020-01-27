import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinDataWrapper } from './coinData.style';
import Coin from '../coin';
import Label from '../../label';

import { getFixedNumber } from '../../../../helpers/stringHelper';

class CoinData extends Component {
  render() {
    const {
      asset,
      assetValue,
      target,
      targetValue,
      price,
      priceUnit,
      size,
      type,
      className,
      ...props
    } = this.props;

    const priceValue = getFixedNumber(price);
    const priceLabel = `${priceUnit.toUpperCase()} ${priceValue}`;

    return (
      <CoinDataWrapper
        size={size}
        target={target}
        assetValue={assetValue}
        type={type}
        className={`coinData-wrapper ${className}`}
        {...props}
      >
        <Coin
          className="coinData-coin-avatar"
          type={asset}
          over={target}
          size={size}
        />
        <div className="coinData-asset-info" data-test="coin-data-asset-info">
          <Label
            className="coinData-asset-label"
            data-test="coin-data-asset-label"
            type="normal"
            weight="600"
          >
            {`${asset} ${target && ':'}${type !== 'normal' ? '/ ' : ''}`}
          </Label>
          {assetValue && (
            <Label
              className="coinData-asset-value"
              data-test="coin-data-asset-value"
              type="normal"
              weight="600"
            >
              {Number(Number(assetValue).toFixed(2)).toLocaleString()}
            </Label>
          )}
        </div>
        {target && (
          <div className="coinData-target-info">
            <Label className="coinData-target-label" type="normal" weight="600">
              {target}
            </Label>
            {targetValue && (
              <Label
                className="coinData-target-value"
                type="normal"
                weight="600"
              >
                {targetValue}
              </Label>
            )}
          </div>
        )}
        <div className="asset-price-info">
          <Label size="small" color="gray" weight="bold">
            {priceLabel}
          </Label>
        </div>
      </CoinDataWrapper>
    );
  }
}

CoinData.propTypes = {
  asset: PropTypes.string,
  assetValue: PropTypes.number,
  target: PropTypes.string,
  targetValue: PropTypes.number,
  price: PropTypes.number,
  priceUnit: PropTypes.string,
  size: PropTypes.oneOf(['small', 'big']),
  className: PropTypes.string,
  type: PropTypes.string,
};

CoinData.defaultProps = {
  asset: 'bnb',
  assetValue: null,
  target: '',
  targetValue: null,
  price: 0,
  priceUnit: 'RUNE',
  size: 'small',
  className: '',
  type: 'normal',
};

export default CoinData;
