import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Input } from 'antd';

import { coinGroup } from '../../../../settings';
import Coin from '../coin';
import Label from '../../label';
import Selection from '../../selection';
import { dropdownIcon } from '../../../icons';

import { CoinCardWrapper } from './coinCard.style';

class CoinCard extends Component {
  static propTypes = {
    asset: PropTypes.oneOf(coinGroup),
    amount: PropTypes.number,
    price: PropTypes.number,
    slip: PropTypes.number,
    title: PropTypes.string,
    withSelection: PropTypes.bool,
    onSelect: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    asset: 'bnb',
    amount: 0,
    price: 0,
    slip: undefined,
    title: '',
    withSelection: false,
    onSelect: () => {},
    className: '',
  };

  render() {
    const {
      asset,
      amount,
      price,
      slip,
      title,
      withSelection,
      onSelect,
      className,
      ...props
    } = this.props;

    return (
      <CoinCardWrapper className={`coinCard-wrapper ${className}`} {...props}>
        {title && <Label className="title-label">{title}</Label>}
        <div className="card-wrapper">
          <Coin type={asset} size="small" />
          <div className="asset-data">
            <Label className="asset-name-label" size="small" weight="bold">
              {asset}
            </Label>
            <Input className="asset-amount-label" value={amount} />
            <Divider />
            <div className="asset-card-footer">
              <Label size="small" color="gray" weight="bold">
                {`$USD ${price}`}
              </Label>
              {slip !== undefined && (
                <Label
                  className="asset-slip-label"
                  size="small"
                  color="gray"
                  weight="bold"
                >
                  SLIP: {slip.toFixed(0)} %
                </Label>
              )}
            </div>
          </div>
          <img src={dropdownIcon} alt="dropdown-icon" />
        </div>
        {withSelection && <Selection onSelect={onSelect} />}
      </CoinCardWrapper>
    );
  }
}

export default CoinCard;
