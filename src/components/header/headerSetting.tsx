import React, { useState, useMemo } from 'react';
import { Menu, Dropdown, Icon, Row } from 'antd';

import { ClickParam } from 'antd/lib/menu';
import { keyBy } from 'lodash';
import { getBinanceUrl } from '@thorchain/asgardex-binance';
import ConnectionStatus from '../uielements/connectionStatus';

import { BINANCE_NET, isDevnet } from '../../env';
import { Maybe } from '../../types/bepswap';
import { getHostnameFromUrl, MIDGARD_DEV_API_DEV_IP } from '../../helpers/apiHelper';

type MenuItem = {
  key: string;
  label: string;
  url: Maybe<string>;
  status: string;
};

type Props = {
  midgardBasePath: Maybe<string>;
};

const HeaderSetting: React.FC<Props> = (props: Props): JSX.Element => {
  const { midgardBasePath } = props;
  const [currentItem, setCurrentItem] = useState<string>('');

  // Midgard IP on devnet OR on test|mainnet
  const midgardUrl = isDevnet ? MIDGARD_DEV_API_DEV_IP : (midgardBasePath && getHostnameFromUrl(midgardBasePath));

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        key: 'binance_chain',
        label: 'binance chain',
        url: getHostnameFromUrl(getBinanceUrl(BINANCE_NET)),
        status: 'green',
      },
      {
        key: 'midgard_api',
        label: 'midgard api',
        url: midgardUrl,
        status: 'green',
      },
    ],
    [midgardUrl],
  );
  const items = keyBy(menuItems, 'key');
  const { status = 'green' } = items[currentItem] || {};

  const handleClickItem = ({ key }: ClickParam) => {
    setCurrentItem(key);
  };

  const menu = useMemo(
    () => (
      <Menu
        onClick={handleClickItem}
        style={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
        className="connection-menu-items"
      >
        {menuItems.map(item => {
          const { label, key, status, url } = item;
          return (
            <Menu.Item
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 10px',
              }}
              key={key}
            >
              <ConnectionStatus color={status} />
              <div>
                <Row>
                  <span style={{ paddingLeft: '10px', fontWeight: 'bold' }}>
                    {label}
                  </span>
                </Row>
                <Row>
                  <span
                    style={{
                      paddingLeft: '10px',
                      color: '#808080',
                      textTransform: 'lowercase',
                    }}
                  >
                    {url || 'unknown'}
                  </span>
                </Row>
              </div>
            </Menu.Item>
          );
        })}
      </Menu>
    ),
    [menuItems],
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="ant-dropdown-link" href="/">
        <ConnectionStatus color={status} />
        <Icon type="down" />
      </a>
    </Dropdown>
  );
};

export default HeaderSetting;
