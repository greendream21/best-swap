import { tokenToBase, BaseAmount, baseAmount } from '@thorchain/asgardex-token';

import { AssetData } from 'redux/wallet/types';

import { Nothing, Maybe } from 'types/bepswap';

import { asgardexBncClient } from '../env';

/**
 * return asset data from the user's balance
 * @param assetData asset data in the user's wallet balance
 * @param symbol symbol in the balance to retrieve the data
 */
export const getAssetDataFromBalance = (
  assetData: AssetData[],
  symbol: Maybe<string>,
): Maybe<AssetData> => {
  if (!symbol) {
    return Nothing;
  }

  return (
    assetData.find(data => data.asset.toLowerCase() === symbol.toLowerCase()) ||
    Nothing
  );
};

/**
 * Returns BNB amount within AssetData
 * If no BNB is available, Nothing will be returned
 */
export const bnbBaseAmount = (assetData: AssetData[]): BaseAmount => {
  const bnbAsset = getAssetDataFromBalance(assetData, 'BNB');
  const amount = bnbAsset?.assetValue;
  return amount ? tokenToBase(amount) : baseAmount(0);
};

export const isValidRecipient = async (address: string) => {
  return asgardexBncClient.validateAddress(address);
};
