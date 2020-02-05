import { getFixedNumber } from '../../helpers/stringHelper';
import { Nothing, Maybe } from '../../types/bepswap';
import { AddressData, PriceDataIndex, AssetDataIndex } from './types';
import { AssetDetail, Asset } from '../../types/generated/midgard/api';

export const getAssetSymbolFromPayload = (
  payload: Partial<{asset?: Asset}>,
): Maybe<string> => payload.asset?.symbol ?? Nothing;

export const getBNBPoolAddress = (
  payload: Partial<{ current?: Array<AddressData> }>,
): Maybe<AddressData> =>
  payload.current?.find(data => data.chain === 'BNB') ?? Nothing;

export const getPoolAddress = (
  payload: Partial<{ current?: Array<AddressData> }>,
): Maybe<string> => getBNBPoolAddress(payload)?.address ?? Nothing;

export const getAssetDataIndex = (
  assets: AssetDetail[],
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
  assets: AssetDetail[],
  baseTokenTicker: string,
): PriceDataIndex => {
  let baseTokenPrice = 1;
  if (baseTokenTicker.toLowerCase() === 'rune') {
    baseTokenPrice = 1;
  }

  const baseTokenInfo = assets.find(
    assetInfo => assetInfo.asset?.ticker === baseTokenTicker.toUpperCase(),
  );
  baseTokenPrice = baseTokenInfo?.priceRune ?? 1;

  let priceDataIndex: PriceDataIndex = {
    RUNE: 1 / baseTokenPrice,
  };

  assets.forEach(assetInfo => {
    const {
      asset,
      priceRune,
    } = assetInfo;


    let price = 0;
    if (priceRune && baseTokenPrice) {
      price = getFixedNumber((1 / baseTokenPrice) * priceRune);
    }

    const ticker = asset?.ticker;
    if (ticker) {
      priceDataIndex = { ...priceDataIndex, [ticker]: price };
    }
  });

  return priceDataIndex;
};
