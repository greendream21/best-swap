import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';

import { TokenSelectWrapper } from './tokenSelect.style';

import TokenMenu from './tokenMenu';
import TokenData from '../tokenData';

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
      <TokenSelectWrapper
        className={`tokenSelect-wrapper ${className}`}
        {...props}
      >
        <Dropdown overlay={this.renderMenu()} trigger={[]} visible>
          <div>
            <TokenData asset={asset} price={price} />
          </div>
        </Dropdown>
      </TokenSelectWrapper>
    );
  }
}

export default TokenSelect;
