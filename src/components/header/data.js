import { keyBy } from 'lodash';

export const menuItems = [
  {
    key: 'binance_chain',
    label: 'binance chain',
    url: 'dex.binance.org',
    status: 'green',
  },
  {
    key: 'chain_service',
    label: 'chain service',
    url: new URL(process.env.REACT_APP_CHAINSERVICE_API_URL).hostname,
    status: 'green',
  },
  {
    key: 'statechain',
    label: 'statechain',
    url: new URL(process.env.REACT_APP_STATECHAIN_API_URL).hostname,
    status: 'green',
  },
];

export const items = keyBy(menuItems, 'key');
