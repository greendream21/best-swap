import React from 'react';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';

import FilterMenu from '../../filterMenu';
import TokenData from '../tokenData';

import { getTickerFormat } from '../../../../helpers/stringHelper';

function filterFunction(item, searchTerm) {
  const tokenName = getTickerFormat(item.asset);
  return tokenName.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0;
}

export default function TokenMenu({
  assetData,
  asset,
  priceUnit,
  priceIndex,
  withSearch,
  searchDisable,
  onSelect,
  ...props // need to pass props for antd to provide box shadow
}) {
  const filteredData = assetData.filter(item => {
    const tokenName = getTickerFormat(item.asset);

    return tokenName.toLowerCase() !== asset.toLowerCase();
  });

  const cellRenderer = data => {
    const { asset: key } = data;
    const tokenName = getTickerFormat(key);
    const dataTest = `token-menu-item-${tokenName}`;

    let price = 0;
    const ticker = getTickerFormat(data.asset).toUpperCase();
    if (ticker === 'RUNE') price = priceIndex.RUNE;
    else price = _get(priceIndex, ticker, 0);

    const node = (
      <TokenData
        asset={tokenName}
        price={price}
        priceUnit={priceUnit}
        size="small"
        data-test={dataTest}
      />
    );

    return { key, node };
  };

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
  priceIndex: PropTypes.object.isRequired,
  priceUnit: PropTypes.string.isRequired,
  assetData: PropTypes.array,
  searchDisable: PropTypes.arrayOf(PropTypes.string),
  withSearch: PropTypes.bool,
  onSelect: PropTypes.func,
};
