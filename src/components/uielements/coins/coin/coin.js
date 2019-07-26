import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinWrapper } from './coin.style';
import { coinGroup } from '../../../../settings';
import CoinIcon from '../coinIcon';

class Coin extends Component {
  static propTypes = {
    type: PropTypes.oneOf(coinGroup),
    size: PropTypes.oneOf(['small', 'big']),
    className: PropTypes.string,
  };

  static defaultProps = {
    type: 'bnb',
    size: 'big',
    className: '',
  };

  render() {
    const { type, size, className, ...props } = this.props;

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
