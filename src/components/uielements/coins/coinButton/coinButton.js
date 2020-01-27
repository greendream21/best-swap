import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinButtonWrapper } from './coinButton.style';
import CoinIcon from '../coinIcon';
import Label from '../../label';

import { getFixedNumber } from '../../../../helpers/stringHelper';

class CoinButton extends Component {
  render() {
    const {
      cointype,
      reversed,
      price,
      priceUnit,
      className,
      ...props
    } = this.props;
    const priceValue = getFixedNumber(price);
    const priceLabel = `${priceUnit.toUpperCase()} ${priceValue}`;

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
            <Label color="input">{priceLabel}</Label>
          </div>
        </div>
      </CoinButtonWrapper>
    );
  }
}

CoinButton.propTypes = {
  cointype: PropTypes.string,
  typevalue: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  priceUnit: PropTypes.string,
  reversed: PropTypes.bool,
  className: PropTypes.string,
};

CoinButton.defaultProps = {
  cointype: 'bnb',
  typevalue: 'normal',
  price: '0',
  priceUnit: 'RUNE',
  reversed: false,
  className: '',
};

export default CoinButton;
