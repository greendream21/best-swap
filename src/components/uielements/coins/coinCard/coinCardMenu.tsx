import React, { useMemo, useCallback } from 'react';
import { get as _get } from 'lodash';

import { bn } from '@thorchain/asgardex-util';
import FilterMenu from '../../filterMenu';
import { getTickerFormat } from '../../../../helpers/stringHelper';
import CoinData from '../coinData';
import { PriceDataIndex } from '../../../../redux/midgard/types';

const filterFunction = (asset: string, searchTerm: string) => {
  const tokenName = getTickerFormat(asset);
  return tokenName.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0;
};

type Props = {
  asset: string;
  assetData: string[];
  priceIndex: PriceDataIndex;
  unit: string;
  searchDisable: string[];
  withSearch: boolean;
  disabled: boolean;
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
      assetData.filter(assetSymbol => {
        const tokenName = getTickerFormat(assetSymbol);
        return tokenName.toLowerCase() !== asset.toLowerCase();
      }),
    [assetData, asset],
  );

  const cellRenderer = useCallback(
    asset => {
      const key = asset || 'unknown-key';
      const tokenName = getTickerFormat(asset);

      // TODO: disable price in the menu
      const price = bn(0);

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
    [unit],
  );

  const disableItemFilterHandler = useCallback(
    asset => {
      const tokenName = getTickerFormat(asset).toLowerCase();
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
      disableItemFilter={(a: string) => disableItemFilterHandler(a)}
      onSelect={onSelect}
      data={filteredData}
    />
  );
};

export default CoinCardMenu;
