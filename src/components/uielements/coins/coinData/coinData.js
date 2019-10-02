import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinDataWrapper } from './coinData.style';
import Coin from '../coin';
import Label from '../../label';

class CoinData extends Component {
  static propTypes = {
    asset: PropTypes.string,
    assetValue: PropTypes.number,
    target: PropTypes.string,
    targetValue: PropTypes.number,
    price: PropTypes.number,
    size: PropTypes.oneOf(['small', 'big']),
    className: PropTypes.string,
  };

  static defaultProps = {
    asset: 'bnb',
    assetValue: null,
    target: '',
    targetValue: null,
    price: 0,
    size: 'small',
    className: '',
  };

  render() {
    const {
      asset,
      assetValue,
      target,
      targetValue,
      price,
      size,
      className,
      ...props
    } = this.props;

    return (
      <CoinDataWrapper
        size={size}
        target={target}
        assetValue={assetValue}
        className={`coinData-wrapper ${className}`}
        {...props}
      >
        <Coin
          className="coinData-coin-avatar"
          type={asset}
          over={target}
          size={size}
        />
        <div className="coinData-asset-info">
          <Label className="coinData-asset-label" type="normal" weight="bold">
            {`${asset} ${target && ':'}`}
          </Label>
          {assetValue && (
            <Label className="coinData-asset-value" type="normal">
              {Number(Number(assetValue).toFixed(2)).toLocaleString()}
            </Label>
          )}
        </div>
        {target && (
          <div className="coinData-target-info">
            <Label
              className="coinData-target-label"
              type="normal"
              weight="bold"
            >
              {target}
            </Label>
            {targetValue && (
              <Label className="coinData-target-value" type="normal">
                {targetValue}
              </Label>
            )}
          </div>
        )}
        <div className="asset-price-info">
          <Label size="small" color="gray" weight="bold">
            {`$USD ${Number(price.toFixed(2)).toLocaleString()}`}
          </Label>
        </div>
      </CoinDataWrapper>
    );
  }
}

export default CoinData;
