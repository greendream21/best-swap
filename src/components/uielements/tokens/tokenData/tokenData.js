import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TokenDataWrapper } from './tokenData.style';

import Coin from '../../coins/coin';

class TokenData extends Component {
  static propTypes = {
    asset: PropTypes.string,
    assetValue: PropTypes.number,
    price: PropTypes.number,
    className: PropTypes.string,
  };

  static defaultProps = {
    asset: 'bnb',
    assetValue: null,
    price: 0,
    className: '',
  };

  render() {
    const { asset, assetValue, price, className, ...props } = this.props;

    return (
      <TokenDataWrapper
        assetValue={assetValue}
        className={`coinData-wrapper ${className}`}
        {...props}
      >
        <Coin className="coinData-coin-avatar" type={asset} />
        <div className="coinData-asset-label">{asset}</div>
        <div className="asset-price-info">
          {`$${Number(price.toFixed(2)).toLocaleString()}`}
        </div>
      </TokenDataWrapper>
    );
  }
}

export default TokenData;
