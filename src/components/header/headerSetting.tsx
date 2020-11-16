import React, { useMemo } from 'react';
import { Dropdown, Row } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Menu from '../uielements/menu';
import ConnectionStatus from '../uielements/connectionStatus';

import useNetwork from '../../hooks/useNetwork';
import { asgardexBncClient } from '../../env';
import { Maybe } from '../../types/bepswap';
import { getHostnameFromUrl } from '../../helpers/apiHelper';

import { ConnectionMenuItem } from './header.style';

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

  const {
    statusColor: status,
    outboundQueueLevel,
  } = useNetwork();

  // Midgard IP on devnet OR on test|chaos|mainnet
  const midgardUrl =
    (midgardBasePath && getHostnameFromUrl(midgardBasePath)) || '';

  const statusColor = useMemo(() => {
    if (status === 'primary') return 'green';
    if (status === 'warning') return 'yellow';
    return 'red';
  }, [status]);
  const queueLevelStr = useMemo(() => {
    return `OUTBOUND Queue: ${outboundQueueLevel}`;
  }, [outboundQueueLevel]);

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        key: 'binance_chain',
        label: 'binance chain',
        url: getHostnameFromUrl(asgardexBncClient.getClientUrl()),
        status: 'green',
      },
      {
        key: 'midgard_api',
        label: 'midgard api',
        url: midgardUrl,
        status: 'green',
      },
      {
        key: 'thornode',
        label: 'THORNODE',
        url: queueLevelStr,
        status: statusColor,
      },
    ],
    [midgardUrl, statusColor, queueLevelStr],
  );

  const menu = useMemo(
    () => (
      <Menu
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
              <ConnectionMenuItem>
                <Row>
                  <span className="connection-server-label">{label}</span>
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
              </ConnectionMenuItem>
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
        <ConnectionStatus color={statusColor} />
        <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default HeaderSetting;
