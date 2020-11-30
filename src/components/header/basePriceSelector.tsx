import React from 'react';

import { connect } from 'react-redux';

import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import { compose } from 'redux';


import * as midgardActions from 'redux/midgard/actions';
import { getAssetFromString } from 'redux/midgard/utils';
import { RootState } from 'redux/store';

import { getTickerFormat } from 'helpers/stringHelper';

import { RUNE_SYMBOL } from 'settings/assetData';

import Label from '../uielements/label';
import Menu from '../uielements/menu';
import AssetInfo from '../uielements/tokens/assetInfo';

const style: React.CSSProperties = {
  width: '160px',
  maxHeight: '500px',
  overflow: 'auto',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 10px',
};

type ComponentProps = Record<string, never>;
type ConnectedProps = {
  basePriceAsset: string;
  pools: string[];
  setBasePriceAsset: typeof midgardActions.setBasePriceAsset;
};

type Props = ComponentProps & ConnectedProps;

type State = Record<string, never>;

const priceIndexWhiteList = ['RUNE', 'BUSD', 'BNB', 'BTCB', 'ETH'];

class BasePriceSelector extends React.Component<Props, State> {
  handleClickItem = ({ key }: ClickParam) => {
    const { setBasePriceAsset } = this.props;

    setBasePriceAsset(key);
  };

  renderMenu = () => {
    const { basePriceAsset, pools } = this.props;
    let selectedKeys: string[] = [];

    if (
      !pools.find(pool => getAssetFromString(pool)?.ticker === basePriceAsset)
    ) {
      selectedKeys = ['RUNE'];
    } else {
      selectedKeys = [basePriceAsset];
    }

    const menuItems = [];
    pools.forEach(data => {
      const { symbol, ticker = '' } = getAssetFromString(data);

      if (symbol && priceIndexWhiteList.includes(ticker.toUpperCase())) {
        menuItems.push({
          asset: symbol,
          key: symbol,
        });
      }
    });

    menuItems.push({
      asset: RUNE_SYMBOL,
      key: RUNE_SYMBOL,
    });

    const menu = (
      <Menu
        className="connection-menu-items"
        onClick={this.handleClickItem}
        style={style}
        selectedKeys={selectedKeys}
      >
        {menuItems.map(({ asset, key }) => (
          <Menu.Item style={itemStyle} key={key}>
            <AssetInfo asset={asset} />
          </Menu.Item>
        ))}
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
          <Label>{baseAsset}</Label>
          <DownOutlined />
        </a>
      </Dropdown>
    );
  }
}

export default compose(
  connect(
    (state: RootState) => ({
      basePriceAsset: state.Midgard.basePriceAsset,
      pools: state.Midgard.pools,
    }),
    {
      setBasePriceAsset: midgardActions.setBasePriceAsset,
    },
  ),
)(BasePriceSelector);
