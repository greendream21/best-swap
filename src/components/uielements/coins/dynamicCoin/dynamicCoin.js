import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { rainbowStop, getIntFromName } from 'helpers/colorHelper';

import { DynamicCoinWrapper } from './dynamicCoin.style';

class DynamicCoin extends Component {
  render() {
    const { type, className, ...props } = this.props;

    const numbers = getIntFromName(type);
    const startCol = rainbowStop(numbers[0]);
    const stopCol = rainbowStop(numbers[1]);

    const coinName = type.length > 4 ? type.substr(0, 4) : type;

    return (
      <DynamicCoinWrapper
        type={type}
        className={`dynamicCoin-wrapper coinData-coin-avatar ${className}`}
        startCol={startCol}
        stopCol={stopCol}
        {...props}
      >
        <span>{coinName}</span>
      </DynamicCoinWrapper>
    );
  }
}

DynamicCoin.propTypes = {
  type: PropTypes.string,
  size: PropTypes.oneOf(['small', 'normal', 'big']),
  className: PropTypes.string,
};

DynamicCoin.defaultProps = {
  type: 'bnb',
  size: 'big',
  className: '',
};

export default DynamicCoin;
