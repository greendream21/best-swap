/* eslint-disable react/jsx-one-expression-per-line */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';

import Label from '../../label';
import Selection from '../../selection';
import CoinInputAdvanced from '../coinInputAdvanced';
import CoinCardMenu from './coinCardMenu';
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

class CoinCard extends Component {
  static propTypes = {
    asset: PropTypes.string,
    assetData: PropTypes.array,
    amount: PropTypes.number,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priceIndex: PropTypes.object.isRequired,
    unit: PropTypes.string,
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
    dataTestWrapper: PropTypes.string,
    dataTestInput: PropTypes.string,
    children: PropTypes.node,
    inputProps: PropTypes.shape({
      disabled: PropTypes.bool,
      'data-test': PropTypes.string,
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

  state = {
    openDropdown: false,
    percentButtonSelected: 0,
  };

  onChange = e => {
    this.props.onChange(e.target.value);
  };

  onKeyDown = () => {
    this.handleResetPercentButtons();
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
    const {
      assetData,
      asset,
      priceIndex,
      unit,
      withSearch,
      searchDisable,
    } = this.props;
    const dataTest = this.props['data-test']; // eslint-disable-line
    return (
      <CoinCardMenu
        data-test={dataTest}
        assetData={assetData}
        asset={asset}
        priceIndex={priceIndex}
        unit={unit}
        withSearch={withSearch}
        searchDisable={searchDisable}
        onSelect={this.handleChangeAsset}
      />
    );
  }

  renderDropDownButton() {
    const { assetData, asset } = this.props;
    const { openDropdown: open } = this.state;
    const disabled = assetData.length === 0;
    return (
      <CoinDropdownButton
        data-test="coin-dropdown-button"
        disabled={disabled}
        onClick={this.handleDropdownButtonClicked}
      >
        <CoinDropdownCoin type={asset} size="big" />
        {!disabled ? (
          <CoinDropdownVerticalColumn>
            <DropdownCarret className="caret-down" open={open} />
          </CoinDropdownVerticalColumn>
        ) : null}
      </CoinDropdownButton>
    );
  }

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
    const { openDropdown, percentButtonSelected } = this.state;

    // TODO: render dropown menu as bottom fixed sheet for mobile
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
          <CardBorderWrapper>
            <AssetNameLabel>{asset}</AssetNameLabel>
            <HorizontalDivider />
            <CardTopRow>
              <AssetData>
                <CoinInputAdvanced
                  className="asset-amount-label"
                  size="large"
                  value={amount}
                  onChange={this.onChange}
                  onKeyDown={this.onKeyDown}
                  {...inputProps}
                />
                <HorizontalDivider color="primary" />
                <AssetCardFooter>
                  <FooterLabel>
                    {`${unit} ${Number(
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
