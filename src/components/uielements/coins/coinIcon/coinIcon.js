import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinIconWrapper } from './coinIcon.style';
import { coinGroup } from '../../../../settings';
import { coinIconGroup } from '../../../icons/coinIcons';

class CoinIcon extends Component {
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
    const { type, className, ...props } = this.props;
    const coinIcon = coinIconGroup[type] || '';

    return (
      <CoinIconWrapper
        type={type}
        className={`coinIcon-wrapper ${className}`}
        {...props}
      >
        <img src={coinIcon} alt={type} />
      </CoinIconWrapper>
    );
  }
}

export default CoinIcon;
