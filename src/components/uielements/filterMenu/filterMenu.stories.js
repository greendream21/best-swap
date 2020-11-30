import React from 'react';

import { storiesOf } from '@storybook/react';

import { getTickerFormat } from 'helpers/stringHelper';

import CoinData from '../coins/coinData';
import FilterMenu from './filterMenu';

function filterFunction(item, searchTerm) {
  const tokenName = getTickerFormat(item.asset);
  return tokenName.indexOf(searchTerm.toLowerCase()) === 0;
}

function cellRenderer(data) {
  const { asset: key, price } = data;
  const tokenName = getTickerFormat(key);
  const node = <CoinData asset={tokenName} price={price} />;
  return { key, node };
}

storiesOf('Components/FilterMenu', module).add('coins example', () => {
  return (
    <FilterMenu
      searchEnabled
      filterFunction={filterFunction}
      cellRenderer={cellRenderer}
      asset="TOMOB-1E1"
      data={[
        { asset: 'FSN-F1B', assetValue: 99, price: 1 },
        { asset: 'FTM-585', assetValue: 993, price: 1 },
        { asset: 'LOK-3C0', assetValue: 3971, price: 0 },
        { asset: 'TCAN-014', assetValue: 8935, price: 1 },
        { asset: 'TOMOB-1E1', assetValue: 198, price: 1 },
        { asset: 'BNB', assetValue: 200.01, price: 0.00387 },
      ]} // AssetPair[]
    />
  );
});
storiesOf('Components/FilterMenu', module).add('general use', () => {
  return (
    <FilterMenu
      searchEnabled
      filterFunction={filterFunction}
      cellRenderer={({ name }) => ({
        key: `${Math.random()}-name`,
        node: <div>Hello {name}</div>,
      })}
      asset="paul"
      data={[
        { asset: 'John', name: 'John', price: 1 },
        { asset: 'Paul', name: 'Paul', price: 2 },
        { asset: 'George', name: 'George', price: 3 },
        { asset: 'Ringo', name: 'Ringo', price: 4 },
      ]} // AssetPair[]
    />
  );
});
