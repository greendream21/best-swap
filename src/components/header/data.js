import { keyBy } from 'lodash';

var getLocation = function(href) {
  var l = document.createElement('a');
  l.href = href;
  return l;
};

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
