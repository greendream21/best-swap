import { get as _get } from 'lodash';
import { tokenNames } from '../settings/assetData';

/**
 * get name of token for testnet or mainnet
 * @param   {String}  ticker  token type
 * @param   {Boolean} type    true: mainnet, false: testnet
 * @return  {String}  tokenName
 */
export const getTokenName = (ticker: string, type = true) => {
  const networkType = type ? 'mainnet' : 'testnet';

  if (ticker) {
    const key = ticker.toUpperCase();

    return tokenNames?.[key]?.[networkType] ?? '';
  }

  return null;
};
