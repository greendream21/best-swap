import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon } from 'antd';

import Coin from '../uielements/coins/coin';
import AssetInfo from '../uielements/tokens/assetInfo';
import { getTickerFormat } from '../../helpers/stringHelper';

import walletActions from '../../redux/wallet/actions';

const { setBasePriceAsset } = walletActions;

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
  static propTypes = {
    assetData: PropTypes.array.isRequired,
    basePriceAsset: PropTypes.string.isRequired,
    setBasePriceAsset: PropTypes.func.isRequired,
  };

  handleClickItem = ({ key }) => {
    const { setBasePriceAsset } = this.props;

    setBasePriceAsset(key);
  };

  renderMenu = () => {
    const { assetData, basePriceAsset } = this.props;
    const baseAsset = getTickerFormat(basePriceAsset);
    const selectedKeys = [baseAsset];
    const menuItems = assetData.map(data => {
      const { asset: symbol } = data;
      const asset = getTickerFormat(symbol);

      return {
        asset,
        key: asset,
      };
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
        <a className="ant-dropdown-link" href="/">
          <Coin className="asset-avatar" type={baseAsset} size="small" />
          <Icon type="down" />
        </a>
      </Dropdown>
    );
  }
}

export default compose(
  connect(
    state => ({
      assetData: state.Wallet.assetData,
      basePriceAsset: state.Wallet.basePriceAsset,
    }),
    {
      setBasePriceAsset,
    },
  ),
)(BasePriceSelector);
