import React from 'react';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';

import FilterMenu from '../../filterMenu';
import { getTickerFormat } from '../../../../helpers/stringHelper';
import CoinData from '../coinData';

function getTokenName(asset) {
  return getTickerFormat(asset);
}

function filterFunction(item, searchTerm) {
  const tokenName = getTokenName(item.asset);
  return tokenName.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0;
}

export default function CoinCardMenu({
  assetData,
  asset,
  priceIndex,
  unit,
  withSearch,
  searchDisable,
  onSelect,
  ...props // need to pass props for antd to provide box shadow
}) {
  const filteredData = assetData.filter(item => {
    const tokenName = getTokenName(item.asset);
    return tokenName.toLowerCase() !== asset.toLowerCase();
  });
  const dataTest = props['data-test']; // eslint-disable-line

  const cellRenderer = data => {
    const { asset: key } = data;
    const tokenName = getTokenName(key);

    let price = 0;
    const ticker = getTickerFormat(data.asset).toUpperCase();
    if (ticker === 'RUNE') price = priceIndex.RUNE;
    else price = _get(priceIndex, ticker, 0);

    const node = (
      <CoinData
        data-test={`coincard-menu-item-${tokenName}`}
        asset={tokenName}
        price={price}
        priceUnit={unit}
      />
    );
    return { key, node };
  };

  return (
    <FilterMenu
      {...props}
      data-test={[dataTest, 'coincard-menu'].join('-')}
      searchEnabled={withSearch}
      filterFunction={filterFunction}
      cellRenderer={cellRenderer}
      disableItemFilter={item => {
        const tokenName = getTokenName(item.asset).toLowerCase();
        return searchDisable.indexOf(tokenName) > -1;
      }}
      onSelect={onSelect}
      asset={asset}
      data={filteredData}
    />
  );
}

CoinCardMenu.propTypes = {
  asset: PropTypes.string,
  assetData: PropTypes.array,
  priceIndex: PropTypes.object,
  unit: PropTypes.string.isRequired,
  searchDisable: PropTypes.arrayOf(PropTypes.string),
  withSearch: PropTypes.bool,
  onSelect: PropTypes.func,
};
