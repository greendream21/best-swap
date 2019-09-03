import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { rainbowStop, getIntFromName } from '../../../../helpers/colorHelper';

import { DynamicCoinWrapper } from './dynamicCoin.style';

class DynamicCoin extends Component {
  static propTypes = {
    type: PropTypes.string,
    size: PropTypes.oneOf(['small', 'big']),
    className: PropTypes.string,
  };

  static defaultProps = {
    type: 'bnb',
    size: 'big',
    className: '',
  };

  render() {
    const { type, className, ...props } = this.props;

    const numbers = getIntFromName(type);
    const startCol = rainbowStop(numbers[0]);
    const stopCol = rainbowStop(numbers[1]);

    return (
      <DynamicCoinWrapper
        type={type}
        className={`dynamicCoin-wrapper ${className}`}
        startCol={startCol}
        stopCol={stopCol}
        {...props}
      >
        <span>{type}</span>
      </DynamicCoinWrapper>
    );
  }
}

export default DynamicCoin;
