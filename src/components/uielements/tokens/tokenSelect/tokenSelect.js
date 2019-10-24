import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';

import {
  TokenSelectWrapper,
  TokenDropdownButton,
  DropdownIconHolder,
  DropdownIcon,
} from './tokenSelect.style';

import TokenMenu from './tokenMenu';
import TokenData from '../tokenData';

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

class TokenSelect extends Component {
  static propTypes = {
    assetData: PropTypes.array.isRequired,
    asset: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    withSearch: PropTypes.bool,
    searchDisable: PropTypes.array,
    className: PropTypes.string,
  };

  static defaultProps = {
    withSearch: true,
    searchDisable: [],
    className: '',
  };

  state = {
    openDropdown: false,
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

  renderDropDownButton() {
    const { assetData } = this.props;
    const { openDropdown: open } = this.state;
    const disabled = assetData.length === 0;

    return (
      <TokenDropdownButton
        disabled={disabled}
        onClick={this.handleDropdownButtonClicked}
      >
        {!disabled ? (
          <DropdownCarret className="caret-down" open={open} />
        ) : null}
      </TokenDropdownButton>
    );
  }

  renderMenu = () => {
    const { assetData, asset, withSearch, searchDisable } = this.props;

    return (
      <TokenMenu
        assetData={assetData}
        asset={asset}
        withSearch={withSearch}
        searchDisable={searchDisable}
        onSelect={() => {}}
      />
    );
  };

  render() {
    const { asset, price, assetData, className, ...props } = this.props;
    const { openDropdown } = this.state;

    return (
      <Dropdown overlay={this.renderMenu()} trigger={[]} visible={openDropdown}>
        <TokenSelectWrapper
          className={`tokenSelect-wrapper ${className}`}
          {...props}
        >
          <TokenData asset={asset} price={price} />
          {this.renderDropDownButton()}
        </TokenSelectWrapper>
      </Dropdown>
    );
  }
}

export default TokenSelect;
