import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinButtonWrapper } from './coinButton.style';
import CoinIcon from '../coinIcon';
import Label from '../../label';

import { getFixedNumber } from '../../../../helpers/stringHelper';

class CoinButton extends Component {
  static propTypes = {
    cointype: PropTypes.string,
    typevalue: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reversed: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    cointype: 'bnb',
    typevalue: 'normal',
    price: '0',
    reversed: false,
    className: '',
  };

  render() {
    const { cointype, reversed, price, className, ...props } = this.props;
    const priceValue = `$${getFixedNumber(price)}`;

    return (
      <CoinButtonWrapper
        className={`coinButton-wrapper ${className}`}
        sizevalue="big"
        reversed={reversed}
        {...props}
      >
        <div className="coinButton-content">
          <CoinIcon type={cointype} />
          <div className="coin-value">
            <Label size="big" weight="bold">
              {cointype}
            </Label>
            <Label color="input">{priceValue}</Label>
          </div>
        </div>
      </CoinButtonWrapper>
    );
  }
}

export default CoinButton;
