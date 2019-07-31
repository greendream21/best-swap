import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinButtonWrapper } from './coinButton.style';
import CoinIcon from '../coinIcon';
import { coinGroup } from '../../../../settings';

class CoinButton extends Component {
  static propTypes = {
    cointype: PropTypes.oneOf(coinGroup),
    typevalue: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    cointype: 'bnb',
    typevalue: 'ghost',
    className: '',
  };

  render() {
    const { cointype, className, ...props } = this.props;

    return (
      <CoinButtonWrapper
        className={`coinButton-wrapper ${className}`}
        sizevalue="big"
        {...props}
      >
        <CoinIcon type={cointype} />
        {cointype}
      </CoinButtonWrapper>
    );
  }
}

export default CoinButton;
