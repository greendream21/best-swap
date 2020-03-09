import React, { useMemo, useCallback } from 'react';
import { get as _get } from 'lodash';

import FilterMenu from '../../filterMenu';
import { getTickerFormat } from '../../../../helpers/stringHelper';
import CoinData from '../coinData';
import { PriceDataIndex } from '../../../../redux/midgard/types';
import { AssetPair } from '../../../../types/bepswap';

const filterFunction = (item: AssetPair, searchTerm: string) => {
  const tokenName = getTickerFormat(item.asset);
  return tokenName.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0;
};

type Props = {
  asset: string;
  assetData: AssetPair[];
  priceIndex: PriceDataIndex;
  unit: string;
  searchDisable: string[];
  withSearch: boolean;
  onSelect: (value: string) => void;
  'data-test': string;
};

const CoinCardMenu: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    assetData,
    asset,
    priceIndex,
    unit,
    withSearch,
    searchDisable = [],
    onSelect = () => {},
    'data-test': dataTest = '',
    ...otherProps // (Rudi) need to pass props for antd to provide box shadow
  } = props;

  const filteredData = useMemo(
    () =>
      assetData.filter(item => {
        const tokenName = getTickerFormat(item.asset);
        return tokenName.toLowerCase() !== asset.toLowerCase();
      }),
    [assetData, asset],
  );

  const cellRenderer = useCallback(
    (data: AssetPair) => {
      const { asset } = data;
      const key = asset || 'unknown-key';
      const tokenName = getTickerFormat(asset);

      let price = 0;
      const ticker = getTickerFormat(asset).toUpperCase();
      if (ticker === 'RUNE') price = priceIndex.RUNE;
      else price = priceIndex[ticker] || 0;

      const node = (
        <CoinData
          data-test={`coincard-menu-item-${tokenName}`}
          asset={tokenName}
          price={price}
          priceUnit={unit}
        />
      );
      return { key, node };
    },
    [priceIndex, unit],
  );

  const disableItemFilterHandler = useCallback(
    (item: AssetPair) => {
      const tokenName = getTickerFormat(item.asset).toLowerCase();
      return searchDisable.indexOf(tokenName) > -1;
    },
    [searchDisable],
  );

  return (
    <FilterMenu
      {...otherProps}
      data-test={[dataTest, 'coincard-menu'].join('-')}
      searchEnabled={withSearch}
      filterFunction={filterFunction}
      cellRenderer={cellRenderer}
      disableItemFilter={(a: AssetPair) => disableItemFilterHandler(a)}
      onSelect={onSelect}
      data={filteredData}
    />
  );
};

export default CoinCardMenu;
