import { keyBy } from 'lodash';
import { binance } from 'asgardex-common';
import { NET } from '../../env';

const getLocation = href => {
  const l = document.createElement('a');
  l.href = href;
  return l;
};

export const menuItems = [
  {
    key: 'binance_chain',
    label: 'binance chain',
    url: getLocation(binance.getBinanceUrl(NET)).hostname,
    status: 'green',
  },
  {
    key: 'midgard_api',
    label: 'midgard api',
    url: getLocation(process.env.REACT_APP_MIDGARD_API_URL).hostname,
    status: 'green',
  },
];

export const items = keyBy(menuItems, 'key');
