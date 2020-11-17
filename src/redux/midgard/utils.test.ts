import { bn } from '@thorchain/asgardex-util';
import {
  getAssetSymbolFromPayload,
  getBNBPoolAddress,
  getPoolAddress,
  getAssetDetailIndex,
  getPriceIndex,
  getAssetFromString,
  getEoDTime,
} from './utils';
import {
  ThorchainEndpoint,
  ThorchainEndpoints,
} from '../../types/generated/midgard';
import { PriceDataIndex } from './types';

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
      const result = getAssetDetailIndex(data);
      result;
      const expected = {
        AAA: emptyAssetSymbol,
        'B-C': asset1,
        'BB-CC': asset2,
      };
      expect(result).toEqual(expected);
    });
    it('should return an emtpy {} if no asset or symbols in list', () => {
      const data = [emptyAsset, emptyAsset] as Array<PoolDataMock>;
      const result = getAssetDetailIndex(data);
      result;
      expect(result).toStrictEqual({});
    });
  });

  describe('getPriceIndex', () => {
    it('should return prices indexes based on RUNE price', () => {
      const result = getPriceIndex(
        [
          { asset: 'BNB.TOMOB-1E1', priceRune: '0.3333333333333333' },
          { asset: 'BNB.BNB', priceRune: '2206.896551724138' },
        ],
        'AAA',
      );
      const expected: PriceDataIndex = {
        'RUNE-67C': bn(1),
        'TOMOB-1E1': bn('0.3333333333333333'),
        BNB: bn('2206.896551724138'),
      };
      expect(result).toEqual(expected);
    });
    it('should return a prices indexes based on BBB price', () => {
      const result = getPriceIndex(
        [
          { asset: 'AAA.AAA-AAA', priceRune: '4' },
          { asset: 'BBB.BBB-BBB', priceRune: '2' },
          { asset: 'CCC.CCC-CCC', priceRune: '10' },
        ],
        'BBB-BBB',
      );
      const expected: PriceDataIndex = {
        'RUNE-67C': bn(0.5),
        'AAA-AAA': bn(2),
        'BBB-BBB': bn(1),
        'CCC-CCC': bn(5),
      };
      expect(result).toEqual(expected);
    });
  });

  describe('getAssetFromString', () => {
    it('should return an asset with all values', () => {
      const result = getAssetFromString('BNB.RUNE-B1A');
      expect(result).toEqual({
        chain: 'BNB',
        symbol: 'RUNE-B1A',
        ticker: 'RUNE',
      });
    });
    it('should return an asset with all values, even if chain and symbol are provided only', () => {
      const result = getAssetFromString('BNB.RUNE');
      expect(result).toEqual({ chain: 'BNB', symbol: 'RUNE', ticker: 'RUNE' });
    });
    it('should return symbol and ticker if chain is not provided', () => {
      const result = getAssetFromString('BNB');
      expect(result).toEqual({ symbol: 'BNB', ticker: 'BNB' });
    });
    it('returns an asset without any values if the passing value is an empty string', () => {
      const result = getAssetFromString('');
      expect(result).toEqual({});
    });
    it('returns an asset without any values if the passing value is undefined', () => {
      const result = getAssetFromString(undefined);
      expect(result).toEqual({});
    });
  });

  describe('getEoDTime', () => {
    it('should be always same timestamp for the same day', () => {
      const time1 = getEoDTime();

      const time2 = getEoDTime();

      expect(time2).toBe(time1);
    });
  });
});
