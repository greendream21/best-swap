import { bn } from '@thorchain/asgardex-util';
import { tokenAmount, formatTokenAmount, formatBaseAsTokenAmount } from '@thorchain/asgardex-token';
import { getAssetFromAssetData, bnbBaseAmount } from './walletHelper';
import { AssetData } from '../redux/wallet/types';

describe('walletHelper', () => {
    const tusdb: AssetData = {
      asset: 'BNB.TUSDB-000',
      assetValue: tokenAmount(1),
      price: bn(1),
    };
    const bnb: AssetData = {
      asset: 'BNB.BNB',
      assetValue: tokenAmount(1),
      price: bn(1),
    };
    const lok: AssetData = {
      asset: 'BNB.LOK-3C0',
      assetValue: tokenAmount(1),
      price: bn(1),
    };
  describe('getAssetFromAssetData', () => {
    it('returns source of LOK', () => {
      expect(getAssetFromAssetData([tusdb, bnb, lok], 'LOK')).toEqual(lok);
    });
    it('returns source of BNB', () => {
      expect(getAssetFromAssetData([tusdb, bnb, lok], 'bnb')).toEqual(bnb);
    });
    it('returns Nothing if source is empty', () => {
      expect(getAssetFromAssetData([tusdb, bnb], '')).toBeNothing();
    });
    it('returns Nothing if source is not avaiable in list of assets', () => {
      expect(getAssetFromAssetData([tusdb, bnb], 'LOK-3C0')).toBeNothing();
    });
    it('returns Nothing for an empty list of assets', () => {
      expect(getAssetFromAssetData([], 'LOK-3C0')).toBeNothing();
    });
  });
  describe('bnbAmount', () => {
    it('returns amount of BNB', () => {
      const amount = bnbBaseAmount([tusdb, lok, bnb]);
      const result = amount && formatBaseAsTokenAmount(amount);
      const expected = formatTokenAmount(tokenAmount(1));
      expect(result).toEqual(expected);
    });
    it('returns Nothing if BNB is not avaiable in list of assets', () => {
      const result = bnbBaseAmount([tusdb, lok]);
      expect(result).toBeNothing();
    });
  });
});
