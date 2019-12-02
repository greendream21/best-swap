import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFixedNumber } from '../../../../helpers/stringHelper';

import { TokenDataWrapper } from './tokenData.style';

import Coin from '../../coins/coin';

class TokenData extends Component {
  static propTypes = {
    asset: PropTypes.string,
    assetValue: PropTypes.number,
    price: PropTypes.number,
    size: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    asset: 'bnb',
    assetValue: null,
    price: 0,
    size: 'big',
    className: '',
  };

  render() {
    const { asset, assetValue, price, size, className, ...props } = this.props;
    const priceValue = `$${getFixedNumber(price)}`;

    return (
      <TokenDataWrapper
        assetValue={assetValue}
        className={`tokenData-wrapper ${className}`}
        {...props}
      >
        <Coin className="coinData-coin-avatar" type={asset} size={size} />
        <div className="coinData-asset-label">{asset}</div>
        <div className="asset-price-info">{priceValue}</div>
      </TokenDataWrapper>
    );
  }
}

export default TokenData;
