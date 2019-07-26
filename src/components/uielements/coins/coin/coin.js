import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinWrapper, CoinsWrapper } from './coin.style';
import { coinGroup } from '../../../../settings';
import CoinIcon from '../coinIcon';

class Coin extends Component {
  static propTypes = {
    type: PropTypes.oneOf(coinGroup),
    over: PropTypes.oneOf(coinGroup),
    size: PropTypes.oneOf(['small', 'big']),
    className: PropTypes.string,
  };

  static defaultProps = {
    type: 'bnb',
    over: '',
    size: 'big',
    className: '',
  };

  render() {
    const { type, size, over, className, ...props } = this.props;

    if (over) {
      return (
        <CoinsWrapper
          type={type}
          size={size}
          className={`coin-wrapper ${className}`}
          {...props}
        >
          <div className="coin-bottom">
            <CoinIcon type={type} size={size} />
          </div>
          <div className="coin-over">
            <CoinIcon type={over} size={size} />
          </div>
        </CoinsWrapper>
      );
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

export default Coin;
