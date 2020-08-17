import React, { useMemo } from 'react';
import { get as _get } from 'lodash';

import { bn, formatBN } from '@thorchain/asgardex-util';
import FilterMenu from '../../filterMenu';
import TokenData from '../tokenData';

import { getTickerFormat } from '../../../../helpers/stringHelper';
import { AssetPair } from '../../../../types/bepswap';
import { PriceDataIndex } from '../../../../redux/midgard/types';

const filterFunction = (item: AssetPair, searchTerm: string): boolean => {
  const tokenName = getTickerFormat(item.asset);
  return tokenName.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0;
};

type Props = {
  asset: string;
  priceIndex: PriceDataIndex;
  assetData: AssetPair[];
  searchDisable: string[];
  withSearch?: boolean;
  onSelect?: (asset: string) => void;
};

const TokenMenu: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    assetData,
    asset,
    priceIndex,
    withSearch,
    searchDisable,
    onSelect,
    ...otherProps // (Chris) need to pass props for antd to provide box shadow
  } = props;

  const filteredData = useMemo(
    () =>
      assetData.filter((item: AssetPair) => {
        const tokenName = getTickerFormat(item.asset);
        return asset && tokenName.toLowerCase() !== asset.toLowerCase();
      }),
    [asset, assetData],
  );

  const cellRenderer = (data: AssetPair) => {
    const { asset: key } = data;
    const tokenName = getTickerFormat(key);
    const dataTest = `token-menu-item-${tokenName}`;

    // TODO: currently disable price in the token menu
    const price = bn(0);

    const node = (
      <TokenData
        asset={tokenName}
        priceValue={formatBN(price)}
        size="small"
        data-test={dataTest}
      />
    );

    return { key, node } as { key: string; node: JSX.Element };
  };

  return (
    <FilterMenu
      {...otherProps}
      selectedKeys={[asset]}
      searchEnabled={withSearch}
      filterFunction={filterFunction}
      cellRenderer={cellRenderer}
      disableItemFilter={item => {
        const tokenName = getTickerFormat(item.asset).toLowerCase();
        return searchDisable.indexOf(tokenName) > -1;
      }}
      onSelect={onSelect}
      data={filteredData}
    />
  );
};

export default TokenMenu;
