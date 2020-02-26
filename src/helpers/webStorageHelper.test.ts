/* eslint-disable no-underscore-dangle */
import {
  saveWalletAddress,
  getWalletAddress,
  clearWalletAddress,
  isUserExist,
  saveKeystore,
  getKeystore,
  clearKeystore,
  getBasePriceAsset,
  saveBasePriceAsset,
  WALLET_ADDRESS,
  KEY_STORE,
  BASE_PRICE_ASSET,
} from './webStorageHelper';

describe('helpers/webStorageHelper/', () => {
  describe('saveWalletAddress', () => {
    it('should save wallet address to session storage', () => {
      const ADDRESS = 'address';
      saveWalletAddress(ADDRESS);
      expect(sessionStorage.__STORE__[WALLET_ADDRESS]).toEqual(ADDRESS);
    });
  });
  describe('getWalletAddress', () => {
    it('should return empty wallet address', () => {
      clearWalletAddress();
      const result = getWalletAddress();
      expect(result).toEqual(null);
    });
    it('should return saved wallet address', () => {
      const ADDRESS = 'address';
      saveWalletAddress(ADDRESS);
      expect(sessionStorage.__STORE__[WALLET_ADDRESS]).toEqual(ADDRESS);
      const result = getWalletAddress();
      expect(result).toEqual(ADDRESS);
    });
  });
  describe('clearWalletAddress', () => {
    it('should clear wallet address in the session storage', () => {
      const ADDRESS = 'address';
      saveWalletAddress(ADDRESS);
      expect(sessionStorage.__STORE__[WALLET_ADDRESS]).toEqual(ADDRESS);

      clearWalletAddress();
      expect(sessionStorage.__STORE__[WALLET_ADDRESS]).toEqual(undefined);
    });
  });
  describe('isUserExist', () => {
    it('should return false if user does not exist', () => {
      const result = isUserExist();
      expect(result).toEqual(false);
    });
    it('should return true if user exists', () => {
      const ADDRESS = 'address';
      saveWalletAddress(ADDRESS);
      expect(sessionStorage.__STORE__[WALLET_ADDRESS]).toEqual(ADDRESS);

      const result = isUserExist();
      expect(result).toEqual(true);
    });
  });
  describe('saveKeystore', () => {
    it('should save keystore object', () => {
      const KEYSTORE = { data: 'some keystore data' };
      saveKeystore(KEYSTORE);

      expect(sessionStorage.__STORE__[KEY_STORE]).toEqual(
        JSON.stringify(KEYSTORE),
      );
    });
  });
  describe('getKeystore', () => {
    it('should return keystore if does not exist', () => {
      clearKeystore();
      const value = getKeystore();

      expect(value).toEqual({});
    });

    it('should return keystore if exists', () => {
      const KEYSTORE = { data: 'some keystore data' };
      saveKeystore(KEYSTORE);

      expect(sessionStorage.__STORE__[KEY_STORE]).toEqual(
        JSON.stringify(KEYSTORE),
      );

      const value = getKeystore();

      expect(value).toEqual(KEYSTORE);
    });
  });
  describe('clearKeystore', () => {
    it('should clear keystore in the session storage', () => {
      const KEYSTORE = { data: 'some keystore data' };
      saveKeystore(KEYSTORE);

      expect(sessionStorage.__STORE__[KEY_STORE]).toEqual(
        JSON.stringify(KEYSTORE),
      );

      clearKeystore();

      expect(sessionStorage.__STORE__[KEY_STORE]).toEqual(undefined);
    });
  });
  describe('getBasePriceAsset', () => {
    it('should return undefined basePriceAsset if not exist', () => {
      const result = getBasePriceAsset();
      expect(result).toEqual(null);
    });
    it('should return saved wallet address', () => {
      const ASSET = 'RUNE';
      saveBasePriceAsset(ASSET);
      expect(sessionStorage.__STORE__[BASE_PRICE_ASSET]).toEqual(ASSET);
      const result = getBasePriceAsset();
      expect(result).toEqual(ASSET);
    });
  });
  describe('saveBasePriceAsset', () => {
    it('should save wallet address to session storage', () => {
      const ASSET = 'RUNE';
      saveBasePriceAsset(ASSET);
      expect(sessionStorage.__STORE__[BASE_PRICE_ASSET]).toEqual(ASSET);
    });
  });
});
