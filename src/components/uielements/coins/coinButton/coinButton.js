import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinButtonWrapper } from './coinButton.style';
import CoinIcon from '../coinIcon';
import { coinGroup } from '../../../../settings';

class CoinButton extends Component {
  static propTypes = {
    cointype: PropTypes.oneOf(coinGroup),
    typevalue: PropTypes.string,
    reversed: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    cointype: 'bnb',
    typevalue: 'ghost',
    reversed: false,
    className: '',
  };

  render() {
    const { cointype, reversed, className, ...props } = this.props;

    return (
      <CoinButtonWrapper
        className={`coinButton-wrapper ${className}`}
        sizevalue="big"
        reversed={reversed}
        {...props}
      >
        <CoinIcon type={cointype} />
        {cointype}
      </CoinButtonWrapper>
    );
  }
}

export default CoinButton;
