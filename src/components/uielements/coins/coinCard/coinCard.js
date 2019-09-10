import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, InputNumber } from 'antd';

import { coinGroup } from '../../../../settings';
import Coin from '../coin';
import Label from '../../label';
import Selection from '../../selection';
import { dropdownIcon } from '../../../icons';

import { CoinCardWrapper } from './coinCard.style';

class CoinCard extends Component {
  static propTypes = {
    asset: PropTypes.string,
    amount: PropTypes.number,
    price: PropTypes.number,
    slip: PropTypes.number,
    title: PropTypes.string,
    withSelection: PropTypes.bool,
    onSelect: PropTypes.func,
    className: PropTypes.string,
    max: PropTypes.number,
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
    max: 1000000,
  };

  onChange = e => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  render() {
    const {
      asset,
      amount,
      price,
      slip,
      title,
      max,
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
            <InputNumber
              className="asset-amount-label"
              min={0}
              max={max}
              defaultValue={3}
              size="big"
              value={amount}
              style={{ width: '100%' }}
              onChange={this.onChange}
            />
            <Divider />
            <div className="asset-card-footer">
              <Label size="small" color="gray" weight="bold">
                {`$USD ${(amount * price).toFixed(2)}`}
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
