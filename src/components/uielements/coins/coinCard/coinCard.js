/* eslint-disable react/jsx-one-expression-per-line */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';

import Label from '../../label';
import Selection from '../../selection';
import FilterMenu from './filterMenu';
import CoinData from '../coinData';
import { CoinCardInput } from './coinCardInput';
import { getTickerFormat } from '../../../../helpers/stringHelper';

import {
  AssetCardFooter,
  AssetData,
  AssetNameLabel,
  CardBorderWrapper,
  CardTopRow,
  CoinCardWrapper,
  CoinDropdownButton,
  CoinDropdownCoin,
  CoinDropdownVerticalColumn,
  DropdownIcon,
  DropdownIconHolder,
  FooterLabel,
  HorizontalDivider,
  VerticalDivider,
} from './coinCard.style';

function DropdownCarret({ open, onClick, className }) {
  return (
    <DropdownIconHolder>
      <DropdownIcon
        open={open}
        className={className}
        type="caret-down"
        onClick={onClick}
      />
    </DropdownIconHolder>
  );
}

DropdownCarret.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

function getTokenName(asset) {
  return getTickerFormat(asset);
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
    amount: PropTypes.number,
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
    disabled: PropTypes.bool,
    children: PropTypes.node,
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
    disabled: false,
    children: null,
  };

  state = {
    openDropdown: false,
    percentButtonSelected: 0,
  };

  onChange = e => {
    this.handleResetPercentButtons();

    this.props.onChange(e.target.value);
  };

  handleVisibleChange = openDropdown => {
    this.setState({
      openDropdown,
    });
  };

  handleResetPercentButtons = () => {
    this.setState({ percentButtonSelected: 0 });
  };

  handleDropdownButtonClicked = () => {
    const { openDropdown } = this.state;
    this.handleVisibleChange(!openDropdown);
  };

  handlePercentSelected = percentButtonSelected => {
    const { onSelect } = this.props;
    this.setState({ percentButtonSelected });
    onSelect(percentButtonSelected);
  };

  handleChangeAsset = asset => {
    const { onChangeAsset } = this.props;

    this.setState({ openDropdown: false });

    // HACK: Wait for the dropdown to close
    setTimeout(() => {
      this.handleResetPercentButtons();
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
    const { assetData, asset } = this.props;
    const { openDropdown: open } = this.state;
    const disabled = assetData.length === 0;
    return (
      <CoinDropdownButton
        disabled={disabled}
        onClick={this.handleDropdownButtonClicked}
      >
        <CoinDropdownCoin type={asset} size="small" />
        <CoinDropdownVerticalColumn>
          {!disabled ? (
            <DropdownCarret className="caret-down" open={open} />
          ) : null}
        </CoinDropdownVerticalColumn>
      </CoinDropdownButton>
    );
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
      children,
      ...props
    } = this.props;
    const { openDropdown, percentButtonSelected } = this.state;

    // TODO: render dropown menu as bottom fixed sheet for mobile
    return (
      <CoinCardWrapper
        className={`coinCard-wrapper ${className}`}
        onBlur={this.handleBlurCard}
      >
        {title && <Label className="title-label">{title}</Label>}

        <Dropdown
          overlay={this.renderMenu()}
          trigger={[]}
          visible={openDropdown}
        >
          <CardBorderWrapper>
            <CardTopRow>
              <AssetData>
                <AssetNameLabel>{asset}</AssetNameLabel>
                <CoinCardInput
                  className="asset-amount-label"
                  size="large"
                  value={amount}
                  onChange={this.onChange}
                  {...props}
                />
                <HorizontalDivider />
                <AssetCardFooter>
                  <FooterLabel>
                    {`$USD ${Number(
                      (amount * price).toFixed(2),
                    ).toLocaleString()}`}
                  </FooterLabel>
                  {slip !== undefined && (
                    <FooterLabel
                      className="asset-slip-label"
                      size="small"
                      color="gray"
                      weight="bold"
                    >
                      SLIP: {slip.toFixed(0)} %
                    </FooterLabel>
                  )}
                </AssetCardFooter>
              </AssetData>

              <VerticalDivider />

              {this.renderDropDownButton()}
            </CardTopRow>
          </CardBorderWrapper>
        </Dropdown>
        {withSelection && (
          <Selection
            selected={percentButtonSelected}
            onSelect={this.handlePercentSelected}
          />
        )}
        {children}
      </CoinCardWrapper>
    );
  }
}

export default CoinCard;
