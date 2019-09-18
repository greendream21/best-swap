/* eslint-disable react/jsx-one-expression-per-line */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Input, Icon, Dropdown } from 'antd';

import Coin from '../coin';
import Label from '../../label';
import Selection from '../../selection';
import FilterMenu from './filterMenu';
import CoinData from '../coinData';

import { CoinCardWrapper } from './coinCard.style';

function getTokenName(asset) {
  return asset.split('-')[0];
}

function filterFunction(item, searchTerm) {
  const tokenName = getTokenName(item.asset);
  return tokenName.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0;
}

function cellRenderer(data) {
  const { asset: key, price } = data;
  const tokenName = getTokenName(key);
  const node = <CoinData asset={tokenName} price={price} />;
  return { key, node };
}

class CoinCard extends Component {
  static propTypes = {
    asset: PropTypes.string,
    assetData: PropTypes.array,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    slip: PropTypes.number,
    title: PropTypes.string,
    searchDisable: PropTypes.arrayOf(PropTypes.string),
    withSelection: PropTypes.bool,
    withSearch: PropTypes.bool,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    onChangeAsset: PropTypes.func,
    className: PropTypes.string,
    max: PropTypes.number,
  };

  static defaultProps = {
    asset: 'bnb',
    assetData: [],
    amount: 0,
    price: 0,
    slip: undefined,
    title: '',
    withSelection: false,
    withSearch: false,
    searchDisable: [],
    onSelect: () => {},
    onChange: () => {},
    onChangeAsset: () => {},
    className: '',
    max: 1000000,
  };

  state = {
    openDropdown: false,
    percentButtonSelected: 0,
  };

  onChange = e => {
    this.setState({ percentButtonSelected: 0 });

    this.props.onChange(e.target.value);
  };

  handleVisibleChange = openDropdown => {
    this.setState({
      openDropdown,
    });
  };

  handleDropdownButtonClicked = () => {
    const { openDropdown } = this.state;
    this.handleVisibleChange(!openDropdown);
  };

  handleSelected = percentButtonSelected => {
    const { onSelect } = this.props;
    this.setState({ percentButtonSelected });
    onSelect(percentButtonSelected);
  };

  handleChangeAsset = asset => {
    const { onChangeAsset } = this.props;

    this.setState({ openDropdown: false });

    // HACK: Wait for the dropdown to close
    setTimeout(() => {
      onChangeAsset(asset.key);
    }, 500);
  };

  renderMenu() {
    const { assetData, asset, withSearch, searchDisable } = this.props;
    const filteredData = assetData.filter(item => {
      const tokenName = getTokenName(item.asset);
      return tokenName.toLowerCase() !== asset.toLowerCase();
    });

    return (
      <FilterMenu
        searchEnabled={withSearch}
        filterFunction={filterFunction}
        cellRenderer={cellRenderer}
        disableItemFilter={item => {
          const tokenName = getTokenName(item.asset).toLowerCase();
          return searchDisable.indexOf(tokenName) > -1;
        }}
        onChangeAsset={this.handleChangeAsset}
        asset={asset}
        data={filteredData}
      />
    );
  }

  renderDropDownButton() {
    const { assetData } = this.props;
    const { openDropdown } = this.state;

    const iconType = openDropdown ? 'caret-up' : 'caret-down';

    if (assetData.length) {
      return (
        <Icon
          className="dropdown-icon"
          type={iconType}
          onClick={this.handleDropdownButtonClicked}
        />
      );
    }
    return null;
  }

  render() {
    const {
      asset,
      assetData,
      amount,
      price,
      slip,
      title,
      max,
      withSelection,
      onSelect,
      onChange,
      onChangeAsset,
      className,
      withSearch,
      searchDisable,
      ...props
    } = this.props;
    const { openDropdown, percentButtonSelected } = this.state;

    // TODO: render dropown menu inline for mobile
    return (
      <CoinCardWrapper
        className={`coinCard-wrapper ${className}`}
        onBlur={this.handleBlurCard}
        {...props}
      >
        {title && <Label className="title-label">{title}</Label>}

        <Dropdown
          overlay={this.renderMenu()}
          trigger={[]}
          visible={openDropdown}
        >
          <div className="card-wrapper">
            <Coin type={asset} size="small" />
            <div className="asset-data">
              <Label className="asset-name-label" size="small" weight="bold">
                {asset}
              </Label>
              <Input
                className="asset-amount-label"
                size="large"
                value={amount.toLocaleString()}
                style={{ width: '100%' }}
                onChange={this.onChange}
                {...props}
              />
              <Divider />
              <div className="asset-card-footer">
                <Label size="small" color="gray" weight="bold">
                  {`$USD ${Number(
                    (amount * price).toFixed(2),
                  ).toLocaleString()}`}
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
            {this.renderDropDownButton()}
          </div>
        </Dropdown>
        {withSelection && (
          <Selection
            selected={percentButtonSelected}
            onSelect={this.handleSelected}
          />
        )}
      </CoinCardWrapper>
    );
  }
}

export default CoinCard;
