import { getFixedNumber } from '../../helpers/stringHelper';
import { Nothing, Maybe } from '../../types/bepswap';
import { AddressData, PriceDataIndex, AssetDataIndex, PoolData } from './types';

export const getAssetSymbolFromPayload = (
  payload: Partial<{ asset?: { symbol?: string } }>,
): Maybe<string> => payload.asset?.symbol ?? Nothing;

export const getBNBPoolAddress = (
  payload: Partial<{ current?: Array<AddressData> }>,
): Maybe<AddressData> =>
  payload.current?.find(data => data.chain === 'BNB') ?? Nothing;

export const getPoolAddress = (
  payload: Partial<{ current?: Array<AddressData> }>,
): Maybe<string> => getBNBPoolAddress(payload)?.address ?? Nothing;

export const getAssetDataIndex = (
  assets: PoolData[],
): AssetDataIndex | {} => {
  let assetDataIndex = {};

  assets.forEach(assetInfo => {
    const { asset } = assetInfo;

    if (asset && asset.symbol) {
      assetDataIndex = { ...assetDataIndex, [asset.symbol]: assetInfo };
    }
  });

  return assetDataIndex;
};

export const getPriceIndex = (
  assets: { asset: { ticker: string }; priceRune: number }[],
  baseTokenTicker: string,
): PriceDataIndex => {
  let baseTokenPrice = 1;
  if (baseTokenTicker.toLowerCase() === 'rune') {
    baseTokenPrice = 1;
  }

  const baseTokenInfo = assets.find(
    assetInfo => assetInfo.asset.ticker === baseTokenTicker.toUpperCase(),
  );
  baseTokenPrice = baseTokenInfo ? baseTokenInfo.priceRune : 1;

  let priceDataIndex: PriceDataIndex = {
    RUNE: 1 / baseTokenPrice,
  };

  assets.forEach(assetInfo => {
    const {
      asset: { ticker },
      priceRune,
    } = assetInfo;

    let price = 0;
    if (priceRune && baseTokenPrice) {
      price = getFixedNumber((1 / baseTokenPrice) * priceRune);
    }

    if (ticker) {
      priceDataIndex = { ...priceDataIndex, [ticker]: price };
    }
  });

  return priceDataIndex;
};
