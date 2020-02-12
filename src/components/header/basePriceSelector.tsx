import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Menu, Dropdown, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';

import AssetInfo from '../uielements/tokens/assetInfo';
import Label from '../uielements/label';
import { getTickerFormat } from '../../helpers/stringHelper';
import { BitcoinIcon } from '../icons';

import * as midgardActions from '../../redux/midgard/actions';
import { getAssetFromString } from '../../redux/midgard/utils';
import { RootState } from '../../redux/store';

const style: React.CSSProperties = {
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 10px',
};

const UNKNOWN_ASSET = 'UNKNOWN-ASSET';

type ComponentProps = {};
type ConnectedProps = {
  basePriceAsset: string;
  pools: string[];
  setBasePriceAsset: typeof midgardActions.setBasePriceAsset;
};

type Props = ComponentProps & ConnectedProps;

type State = {};

class BasePriceSelector extends React.Component<Props, State> {
  handleClickItem = ({ key }: ClickParam) => {
    const { setBasePriceAsset } = this.props;

    setBasePriceAsset(key);
  };

  renderMenu = () => {
    const { basePriceAsset, pools } = this.props;
    const baseAsset = getTickerFormat(basePriceAsset).toUpperCase();
    const selectedKeys = [baseAsset];
    const menuItems = pools.map(data => {
      const { symbol } = getAssetFromString(data);
      const asset = getTickerFormat(symbol)?.toUpperCase() ?? UNKNOWN_ASSET;

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
        {menuItems.map(({ asset, key }) =>
          asset !== UNKNOWN_ASSET ? (
            <Menu.Item style={itemStyle} key={key}>
              <AssetInfo asset={asset} />
            </Menu.Item>
          ) : (
            <></>
          ),
        )}
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
