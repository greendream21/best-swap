import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinWrapper, CoinsWrapper } from './coin.style';
import { coinGroup } from '../../../../settings';
import CoinIcon from '../coinIcon';
import DynamicCoin from '../dynamicCoin';

class Coin extends Component {
  render() {
    const { type, size, over, className, ...props } = this.props;
    const isDynamicIcon = !coinGroup.includes(type.toLowerCase());

    if (over) {
      const isDynamicIconOver = !coinGroup.includes(over.toLowerCase());

      return (
        <CoinsWrapper
          type={type}
          size={size}
          className={`coin-wrapper ${className}`}
          {...props}
        >
          {isDynamicIcon && (
            <DynamicCoin className="dynamic-bottom" type={type} size={size} />
          )}
          {!isDynamicIcon && (
            <div className="coin-bottom">
              <CoinIcon type={type} size={size} />
            </div>
          )}
          {isDynamicIconOver && (
            <DynamicCoin className="dynamic-over" type={over} size={size} />
          )}
          {!isDynamicIconOver && (
            <div className="coin-over">
              <CoinIcon type={over} size={size} />
            </div>
          )}
        </CoinsWrapper>
      );
    }
    if (isDynamicIcon) {
      return <DynamicCoin type={type} size={size} />;
    }
    return (
      <CoinWrapper
        type={type}
        size={size}
        className={`coin-wrapper ${className}`}
        {...props}
      >
        <CoinIcon type={type} size={size} />
      </CoinWrapper>
    );
  }
}

Coin.propTypes = {
  type: PropTypes.string,
  over: PropTypes.string,
  size: PropTypes.oneOf(['small', 'big']),
  className: PropTypes.string,
};

Coin.defaultProps = {
  type: 'bnb',
  over: '',
  size: 'big',
  className: '',
};

export default Coin;
