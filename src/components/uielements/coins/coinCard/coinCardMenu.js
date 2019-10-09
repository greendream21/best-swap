import React from 'react';
import PropTypes from 'prop-types';
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

function cellRenderer(data) {
  const { asset: key, price } = data;
  const tokenName = getTokenName(key);
  const node = (
    <CoinData
      data-test={`coincard-menu-item-${tokenName}`}
      asset={tokenName}
      price={price}
    />
  );
  return { key, node };
}

export default function CoinCardMenu({
  assetData,
  asset,
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
  searchDisable: PropTypes.arrayOf(PropTypes.string),
  withSearch: PropTypes.bool,
  onSelect: PropTypes.func,
};
