import { Token } from '@thorchain/asgardex-binance';
import { bn } from '@thorchain/asgardex-util';
import moment from 'moment';

import { RUNE_SYMBOL } from '../../settings/assetData';

import { Nothing, Maybe } from '../../types/bepswap';
import { PriceDataIndex, AssetDetailMap } from './types';
import {
  PoolDetail,
  AssetDetail,
  ThorchainEndpoints,
  ThorchainEndpoint,
  StakersAssetData,
} from '../../types/generated/midgard';
import { Asset } from '../../types/midgard';

export const getAssetSymbolFromPayload = (
  payload: Pick<StakersAssetData, 'asset'>,
): Maybe<string> => {
  const { asset = '' } = payload;
  const { symbol } = getAssetFromString(asset);
  return symbol || Nothing;
};

export const getBNBPoolAddress = (
  endpoints: ThorchainEndpoints,
): Maybe<ThorchainEndpoint> =>
  endpoints.current?.find(
    (endpoint: ThorchainEndpoint) => endpoint.chain === 'BNB',
  ) ?? Nothing;

export const getPoolAddress = (endpoints: ThorchainEndpoints): Maybe<string> =>
  getBNBPoolAddress(endpoints)?.address ?? Nothing;

export const getAssetDetailIndex = (
  assets: AssetDetail[],
): AssetDetailMap | {} => {
  let assetDataIndex = {};

  assets.forEach(assetInfo => {
    const { asset = '' } = assetInfo;
    const { symbol } = getAssetFromString(asset);

    if (symbol) {
      assetDataIndex = { ...assetDataIndex, [symbol]: assetInfo };
    }
  });

  return assetDataIndex;
};

export const getPriceIndex = (
  poolDetails: PoolDetail[],
  baseAssetSymbol: string,
): PriceDataIndex => {
  let baseTokenPrice = bn(0);

  if (baseAssetSymbol === RUNE_SYMBOL) {
    baseTokenPrice = bn(1);
  }

  const baseTokenInfo = poolDetails.find(poolDetail => {
    const { asset = '' } = poolDetail;
    const { symbol } = getAssetFromString(asset);
    return symbol === baseAssetSymbol;
  });

  baseTokenPrice = bn(baseTokenInfo?.price ?? 1);

  let priceDataIndex: PriceDataIndex = {
    // formula: 1 / baseTokenPrice
    [RUNE_SYMBOL]: bn(1).div(baseTokenPrice),
  };

  poolDetails.forEach(poolDetail => {
    const { asset = '', price: priceRune } = poolDetail;

    let price = bn(0);
    if (priceRune && baseTokenPrice) {
      // formula: 1 / baseTokenPrice) * priceRune
      price = bn(1)
        .div(baseTokenPrice)
        .multipliedBy(priceRune);
    }

    const { symbol } = getAssetFromString(asset);
    if (symbol) {
      priceDataIndex = { ...priceDataIndex, [symbol]: price };
    }
  });

  return priceDataIndex;
};

/**
 * Creates an `Asset` by a given string
 *
 * The string has following naming convention:
 * `AAA.BBB-CCC`
 * where
 * chain: `AAA`
 * ticker (optional): `BBB`
 * symbol: `BBB-CCC`
 * or
 * symbol: `CCC` (if no ticker available)
 * */
export const getAssetFromString = (s?: string): Asset => {
  let chain;
  let symbol;
  let ticker;
  // We still use this function in plain JS world,
  // so we have to check the type of s here...
  if (s && typeof s === 'string') {
    const data = s.split('.');
    if (s.includes('.')) {
      chain = data[0];
      symbol = data[1];
    } else {
      symbol = data[0];
    }
    if (symbol) {
      ticker = symbol.split('-')[0];
    }
  }
  return { chain, symbol, ticker };
};

export const getTokenInfo = (
  tokenList: Token[],
  assetInfo?: string,
): Token[] => {
  const asset = getAssetFromString(assetInfo);
  const token = tokenList.find(item => item.symbol === asset.symbol);

  return token ? [token] : [];
};

export const getOrderedPoolString = (pools: string[]) => {
  const sortedPools = pools.sort((a, b) => a.localeCompare(b));

  return sortedPools.join();
};

export const getEoDTime = () => {
  return moment()
    .set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    })
    .unix();
};

export const getWeekAgoTime = () => {
  return moment()
    .subtract(7, 'days')
    .set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    })
    .unix();
};
