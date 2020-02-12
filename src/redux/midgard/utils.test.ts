import {
  getAssetSymbolFromPayload,
  getBNBPoolAddress,
  getPoolAddress,
  getAssetDataIndex,
  getPriceIndex,
  getAssetFromString,
} from './utils';
import { ThorchainEndpoint, ThorchainEndpoints } from '../../types/generated/midgard';

type PoolDataMock = { asset?: string };

describe('redux/midgard/utils/', () => {
  describe('getAssetSymbolFromPayload', () => {
    it('should return a symbol ', () => {
      const payload = { asset: 'AAA.BBB-CCC' };
      const result = getAssetSymbolFromPayload(payload);
      expect(result).toEqual('BBB-CCC');
    });
    it('should return Nothing if asset is not defined ', () => {
      const payload = {};
      const result = getAssetSymbolFromPayload(payload);
      expect(result).toBeNothing;
    });
  });

  describe('getBNBPoolAddress', () => {
    it('should return BNB based data ', () => {
      const bnbData: ThorchainEndpoint = { chain: 'BNB', address: '0xbnb' };
      const payload: ThorchainEndpoints = {
        current: [
          bnbData,
          { chain: 'AAA', address: '0xaaa' },
          { chain: 'bbb', address: '0xbbb' },
        ],
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
      const bnbData: ThorchainEndpoint = { chain: 'BNB', address: '0xbnb' };
      const payload: ThorchainEndpoints = {
        current: [
          bnbData,
          { chain: 'AAA', address: '0xaaa' },
          { chain: 'bbb', address: '0xbbb' },
        ],
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
    const emptyAsset = {};
    const emptyAssetSymbol: PoolDataMock = { asset: 'AAA' };

    it('should return non empty assetDataIndex ', () => {
      const bnbData: ThorchainEndpoint = { chain: 'BNB', address: '0xbnb' };
      const asset1: PoolDataMock = { asset: 'A.B-C' };
      const asset2: PoolDataMock = { asset: 'AA.BB-CC' };
      const data = [
        bnbData,
        asset1,
        asset2,
        emptyAsset,
        emptyAssetSymbol,
      ] as Array<PoolDataMock>;
      const result = getAssetDataIndex(data);
      result;
      const expected = {
        'B-C': asset1,
        'BB-CC': asset2,
      };
      result;
      expect(result).toEqual(expected);
    });
    it('should return an emtpy {} if no asset or symbols in list', () => {
      const data = [
        emptyAsset,
        emptyAssetSymbol,
        emptyAssetSymbol,
        emptyAssetSymbol,
        emptyAsset,
      ] as Array<PoolDataMock>;
      const result = getAssetDataIndex(data);
      result;
      expect(result).toStrictEqual({});
    });
  });

  describe('getPriceIndex', () => {
    it('should return prices indexes based on RUNE price', () => {
      const result = getPriceIndex(
        [
          { asset: 'BNB.AAA-AAA', priceRune: 10 },
          { asset: 'BNB.BBB-BBB', priceRune: 1 },
        ],
        'AAA',
      );
      result;
      expect(result).toEqual({ RUNE: 0.1, AAA: 1, BBB: 0.1 });
    });
    it('should return a prices indexes based on BBB price', () => {
      const result = getPriceIndex(
        [
          { asset: 'AAA.AAA-AAA', priceRune: 4 },
          { asset: 'BBB.BBB-BBB', priceRune: 2 },
          { asset: 'CCC.CCC-CCC', priceRune: 10 },
        ],
        'BBB',
      );
      result;
      expect(result).toEqual({ RUNE: 0.5, AAA: 2, BBB: 1, CCC: 5 });
    });
  });

  describe('getAssetFromString', () => {
    it('should return an asset with all values', () => {
      const result = getAssetFromString('BNB.RUNE-B1A');
      expect(result).toEqual({ chain: 'BNB', symbol: 'RUNE-B1A', ticker: 'RUNE' });
    });
    it('should return an asset with values for chain and symbol only', () => {
      const result = getAssetFromString('BNB.RUNE');
      expect(result).toEqual({ chain: 'BNB', symbol: 'RUNE' });
    });
    it('should return an asset with a value for chain only', () => {
      const result = getAssetFromString('BNB');
      expect(result).toEqual({ chain: 'BNB' });
    });
    it('returns an asset without any values if the passing value is an empty string', () => {
      const result = getAssetFromString('');
      expect(result).toEqual({});
    });
    it('returns an asset without any values if the passing value is undefined', () => {
      const result = getAssetFromString();
      expect(result).toEqual({});
    });
  });
});
