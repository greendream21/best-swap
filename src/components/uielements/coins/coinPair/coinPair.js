import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { CoinPairWrapper } from './coinPair.style';
import CoinIcon from '../coinIcon';
import Label from '../../label';

class CoinPair extends Component {
  static propTypes = {
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'big']),
    className: PropTypes.string,
  };

  static defaultProps = {
    size: 'big',
    className: '',
  };

  render() {
    const { from, to, className, ...props } = this.props;

    return (
      <CoinPairWrapper className={`coinPair-wrapper ${className}`} {...props}>
        <div className="coin-data">
          <CoinIcon type={from} />
          <Label>{from.toUpperCase()}</Label>
        </div>
        <Icon className="arrow-icon" type="caret-right" />
        <div className="coin-data">
          <CoinIcon type={to} />
          <Label>{to.toUpperCase()}</Label>
        </div>
      </CoinPairWrapper>
    );
  }
}

export default CoinPair;
