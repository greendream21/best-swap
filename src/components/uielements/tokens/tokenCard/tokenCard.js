import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TokenCardWrapper } from './tokenCard.style';

import { getFixedNumber } from '../../../../helpers/stringHelper';

import Label from '../../label';
import TokenSelect from '../tokenSelect';
import TokenInput from '../tokenInput';

class TokenCard extends Component {
  static propTypes = {
    asset: PropTypes.string,
    assetData: PropTypes.array,
    amount: PropTypes.number,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priceIndex: PropTypes.object.isRequired,
    unit: PropTypes.string,
    slip: PropTypes.number,
    title: PropTypes.string,
    inputTitle: PropTypes.string,
    searchDisable: PropTypes.arrayOf(PropTypes.string),
    withSelection: PropTypes.bool,
    withSearch: PropTypes.bool,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    onChangeAsset: PropTypes.func,
    className: PropTypes.string,
    max: PropTypes.number,
    disabled: PropTypes.bool,
    dataTestWrapper: PropTypes.string,
    dataTestInput: PropTypes.string,
    children: PropTypes.node,
    inputProps: PropTypes.shape({
      disabled: PropTypes.bool,
    }),
  };

  static defaultProps = {
    asset: 'bnb',
    assetData: [],
    amount: 0,
    price: 0,
    unit: 'RUNE',
    slip: undefined,
    title: '',
    inputTitle: '',
    withSelection: false,
    withSearch: false,
    searchDisable: [],
    onSelect: () => {},
    onChange: () => {},
    onChangeAsset: () => {},
    className: '',
    max: 1000000,
    disabled: false,
    children: null,
    inputProps: {},
  };

  render() {
    const {
      asset,
      assetData,
      amount,
      price,
      priceIndex,
      unit,
      slip,
      title,
      inputTitle,
      max,
      withSelection,
      onSelect,
      onChange,
      onChangeAsset,
      className,
      withSearch,
      searchDisable,
      children,
      inputProps,
      ...props
    } = this.props;

    const slipValue = slip !== undefined ? `slip ${slip}%` : null;
    const priceValue = `${unit} ${getFixedNumber(amount * price)}`;
    const dataTest = this.props['data-test']; // eslint-disable-line
    const tokenSelectDataTest = `${dataTest}-select`;

    return (
      <TokenCardWrapper className={`tokenCard-wrapper ${className}`} {...props}>
        {title && <Label className="title-label">{title}</Label>}
        <div className="token-card-content">
          <TokenInput
            title={inputTitle}
            status={slipValue}
            value={amount}
            onChange={onChange}
            label={priceValue}
            inputProps={inputProps}
          />
          <TokenSelect
            asset={asset}
            price={price}
            priceIndex={priceIndex}
            priceUnit={unit}
            assetData={assetData}
            withSearch={withSearch}
            searchDisable={searchDisable}
            onSelect={onSelect}
            onChangeAsset={onChangeAsset}
            data-test={tokenSelectDataTest}
          />
        </div>
        {children}
      </TokenCardWrapper>
    );
  }
}

export default TokenCard;
