import { tokenToBase, BaseAmount } from '@thorchain/asgardex-token';
import { getTickerFormat } from './stringHelper';
import { Nothing, Maybe } from '../types/bepswap';
import { AssetData } from '../redux/wallet/types';

export const getAssetFromAssetData = (
  assetData: AssetData[],
  source: Maybe<string>,
): Maybe<AssetData> => {
  if (!source) {
    return Nothing;
  }
  return assetData.reduce((acc, data) => {
    const { asset } = data;
    if (!acc) {
      const tokenName = getTickerFormat(asset);
      const assetName = getTickerFormat(source);
      if (tokenName && tokenName === assetName.toLowerCase()) {
        return data;
      }
    }
    return acc;
  }, Nothing as Maybe<AssetData>);
};

/**
 * Returns BNB amount within AssetData
 * If no BNB is available, Nothing will be returned
*/
export const bnbBaseAmount = (assetData: AssetData[]): Maybe<BaseAmount> => {
  const bnbAsset = getAssetFromAssetData(assetData, 'bnb');
  const amount = bnbAsset?.assetValue;
  return amount ? tokenToBase(amount) : Nothing;
};
