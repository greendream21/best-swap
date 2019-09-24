import { keyBy } from 'lodash';
import Binance from '../../clients/binance';

const getLocation = href => {
  const l = document.createElement('a');
  l.href = href;
  return l;
};

export const menuItems = [
  {
    key: 'binance_chain',
    label: 'binance chain',
    url: getLocation(Binance.getBinanceUrl()).hostname,
    status: 'green',
  },
  {
    key: 'chain_service',
    label: 'chain service',
    url: getLocation(process.env.REACT_APP_CHAINSERVICE_API_URL).hostname,
    status: 'green',
  },
  {
    key: 'statechain',
    label: 'statechain',
    url: getLocation(process.env.REACT_APP_STATECHAIN_API_URL).hostname,
    status: 'green',
  },
];

export const items = keyBy(menuItems, 'key');
