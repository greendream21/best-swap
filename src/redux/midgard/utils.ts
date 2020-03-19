import { getFixedNumber } from '../../helpers/stringHelper';
import { Nothing, Maybe } from '../../types/bepswap';
import { PriceDataIndex, AssetDetailMap } from './types';
import {
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
  assets: AssetDetail[],
  baseTokenTicker: string,
): PriceDataIndex => {
  let baseTokenPrice = 1;
  if (baseTokenTicker.toLowerCase() === 'rune') {
    baseTokenPrice = 1;
  }

  const baseTokenInfo = assets.find(assetInfo => {
    const { asset = '' } = assetInfo;
    const { ticker } = getAssetFromString(asset);
    return ticker === baseTokenTicker.toUpperCase();
  });
  baseTokenPrice = Number(baseTokenInfo?.priceRune ?? 1);

  let priceDataIndex: PriceDataIndex = {
    RUNE: 1 / baseTokenPrice,
  };

  assets.forEach(assetInfo => {
    const { asset = '', priceRune } = assetInfo;

    let price = 0;
    if (priceRune && baseTokenPrice) {
      price = getFixedNumber((1 / baseTokenPrice) * Number(priceRune));
    }

    const { ticker } = getAssetFromString(asset);
    if (ticker) {
      priceDataIndex = { ...priceDataIndex, [ticker]: price };
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
    chain = data[0];
    const ss = data[1];
    if (ss) {
      symbol = ss;
      // grab `ticker` from string or reference to `symbol` as `ticker`
      ticker = ss.split('-')[0];
    }
  }
  return { chain, symbol, ticker };
};
