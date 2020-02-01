import {
  getAssetSymbolFromPayload,
  getBNBPoolAddress,
  getPoolAddress,
  getAssetDataIndex,
  getPriceIndex,
} from './utils';
import { AddressData, PoolDataPayload } from './types';

describe('redux/midgard/utils/', () => {
  describe('getAssetSymbolFromPayload', () => {
    it('should return a symbol ', () => {
      const symbol = 'BNB';
      const payload = { asset: { symbol } };
      const result = getAssetSymbolFromPayload(payload);
      expect(result).toEqual(symbol);
    });
    it('should return Nothing if asset is not defined ', () => {
      const payload = {};
      const result = getAssetSymbolFromPayload(payload);
      expect(result).toBeNothing;
    });
  });

  describe('getBNBPoolAddress', () => {
    it('should return BNB based data ', () => {
      const bnbData: AddressData = { chain: 'BNB', address: '0xbnb' };
      const payload = {
        current: [
          bnbData,
          { chain: 'AAA', address: '0xaaa' },
          { chain: 'bbb', address: '0xbbb' },
        ] as Array<AddressData>,
      };
      const result = getBNBPoolAddress(payload);
      expect(result).toEqual(bnbData);
    });
    it('should return Nothing if currrent is not defined', () => {
      const payload = {};
      const result = getBNBPoolAddress(payload);
      expect(result).toBeNothing;
    });
  });

  describe('getPoolAddress', () => {
    it('should return pool address ', () => {
      const bnbData: AddressData = { chain: 'BNB', address: '0xbnb' };
      const payload = {
        current: [
          bnbData,
          { chain: 'AAA', address: '0xaaa' },
          { chain: 'bbb', address: '0xbbb' },
        ] as Array<AddressData>,
      };
      const result = getPoolAddress(payload);
      expect(result).toEqual('0xbnb');
    });
    it('should return Nothing if currrent is not defined', () => {
      const payload = {};
      const result = getPoolAddress(payload);
      expect(result).toBeNothing;
    });
  });

  describe('getAssetDataIndex', () => {
    const emptyAsset: PoolDataPayload = {};
    const emptyAssetSymbol: PoolDataPayload = { asset: {} };

    it('should return non empty assetDataIndex ', () => {
      const bnbData: AddressData = { chain: 'BNB', address: '0xbnb' };
      const assetA: PoolDataPayload = { asset: { symbol: 'AAA' } };
      const assetB: PoolDataPayload = { asset: { symbol: 'BBB' } };
      const data = [
        bnbData,
        assetA,
        assetB,
        emptyAsset,
        emptyAssetSymbol,
      ] as Array<PoolDataPayload>;
      const result = getAssetDataIndex(data);
      const expected = {
        AAA: assetA,
        BBB: assetB,
      };
      expect(result).toEqual(expected);
    });
    it('should return an emtpy {} if no asset or symbols in list', () => {
      const data = [
        emptyAsset,
        emptyAssetSymbol,
        emptyAssetSymbol,
        emptyAssetSymbol,
        emptyAsset,
      ] as Array<PoolDataPayload>;
      const result = getAssetDataIndex(data);
      expect(result).toBeNothing;
    });
  });

  describe('getPriceIndex', () => {
    it('should return prices indexes based on RUNE price', () => {
      const result = getPriceIndex(
       [{ asset: { ticker: 'RUNE' }, priceRune: 10 },
       { asset: { ticker: 'AAA' }, priceRune: 1 }],
        'RUNE',
      );
      expect(result).toEqual({ RUNE: 1, AAA: 0.1 });
    });
    it('should return a prices indexes based on BBB price', () => {
      const result = getPriceIndex(
       [{ asset: { ticker: 'RUNE' }, priceRune: 1 },
       { asset: { ticker: 'AAA' }, priceRune: 3 },
       { asset: { ticker: 'BBB' }, priceRune: 10 }],
        'BBB',
      );
      expect(result).toEqual({ RUNE: 0.1, AAA: 0.3, BBB: 1 });
    });
  });
});
