import React from 'react';
import PropTypes from 'prop-types';
import FilterMenu from '../../filterMenu';
import TokenData from '../tokenData';

import { getTickerFormat } from '../../../../helpers/stringHelper';

function filterFunction(item, searchTerm) {
  const tokenName = getTickerFormat(item.asset);
  return tokenName.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0;
}

function cellRenderer(data) {
  const { asset: key, price } = data;
  const tokenName = getTickerFormat(key);
  const dataTest = `token-menu-item-${tokenName}`;
  const node = (
    <TokenData asset={tokenName} price={price} data-test={dataTest} />
  );

  return { key, node };
}

export default function TokenMenu({
  assetData,
  asset,
  withSearch,
  searchDisable,
  onSelect,
  ...props // need to pass props for antd to provide box shadow
}) {
  const filteredData = assetData.filter(item => {
    const tokenName = getTickerFormat(item.asset);

    return tokenName.toLowerCase() !== asset.toLowerCase();
  });

  return (
    <FilterMenu
      {...props}
      searchEnabled={withSearch}
      filterFunction={filterFunction}
      cellRenderer={cellRenderer}
      disableItemFilter={item => {
        const tokenName = getTickerFormat(item.asset).toLowerCase();
        return searchDisable.indexOf(tokenName) > -1;
      }}
      onSelect={onSelect}
      asset={asset}
      data={filteredData}
    />
  );
}

TokenMenu.propTypes = {
  asset: PropTypes.string,
  assetData: PropTypes.array,
  searchDisable: PropTypes.arrayOf(PropTypes.string),
  withSearch: PropTypes.bool,
  onSelect: PropTypes.func,
};
