import { keyBy } from 'lodash';

export const menuItems = [
  {
    key: 'wallet',
    label: 'wallet',
    status: 'yellow',
  },
  {
    key: 'binance_chain',
    label: 'binance chain',
    status: 'green',
  },
  {
    key: 'chain_service',
    label: 'chain service',
    status: 'green',
  },
  {
    key: 'statechain',
    label: 'statechain',
    status: 'green',
  },
];

export const items = keyBy(menuItems, 'key');
