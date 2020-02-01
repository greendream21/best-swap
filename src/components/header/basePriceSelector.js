import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon } from 'antd';

import AssetInfo from '../uielements/tokens/assetInfo';
import Label from '../uielements/label';
import { getTickerFormat } from '../../helpers/stringHelper';
import { BitcoinIcon } from '../icons';

import * as midgardActions from '../../redux/midgard/actions';

const style = {
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 10px',
};

class BasePriceSelector extends Component {
  handleClickItem = ({ key }) => {
    const { setBasePriceAsset } = this.props;

    setBasePriceAsset(key);
  };

  renderMenu = () => {
    const { basePriceAsset, pools } = this.props;
    const baseAsset = getTickerFormat(basePriceAsset).toUpperCase();
    const selectedKeys = [baseAsset];
    const menuItems = pools.map(data => {
      const { symbol } = data;
      const asset = getTickerFormat(symbol).toUpperCase();

      return {
        asset,
        key: asset,
      };
    });

    menuItems.push({
      asset: 'RUNE',
      key: 'RUNE',
    });

    const menu = (
      <Menu
        className="connection-menu-items"
        onClick={this.handleClickItem}
        style={style}
        selectedKeys={selectedKeys}
      >
        {menuItems.map(item => {
          const { asset, key } = item;

          return (
            <Menu.Item style={itemStyle} key={key}>
              <AssetInfo asset={asset} />
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return menu;
  };

  render() {
    const { basePriceAsset } = this.props;
    const baseAsset = getTickerFormat(basePriceAsset);

    return (
      <Dropdown
        overlay={this.renderMenu()}
        trigger={['click']}
        placement="bottomRight"
      >
        <a className="ant-dropdown-link baseprice-selector" href="/">
          <div className="currency-icon-container">
            <BitcoinIcon />
          </div>
          <Label>{baseAsset}</Label>
          <Icon type="down" />
        </a>
      </Dropdown>
    );
  }
}

BasePriceSelector.propTypes = {
  basePriceAsset: PropTypes.string.isRequired,
  setBasePriceAsset: PropTypes.func.isRequired,
  pools: PropTypes.array.isRequired,
};

export default compose(
  connect(
    state => ({
      basePriceAsset: state.Midgard.basePriceAsset,
      pools: state.Midgard.pools,
    }),
    {
      setBasePriceAsset: midgardActions.setBasePriceAsset,
    },
  ),
)(BasePriceSelector);
