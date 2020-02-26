import {
  getBinanceMainnetURL,
  getBinanceTestnetURL,
  getMidgardURL,
  getHeaders,
} from './apiHelper';

describe('helpers/apiHelper', () => {
  describe('getBinanceTestnetURL', () => {
    it('should return a valid value', () => {
      const result = getBinanceTestnetURL('tokens?limit=100');
      expect(result).toEqual(
        'https://testnet-dex.binance.org/api/v1/tokens?limit=100',
      );
    });
  });
  describe('getBinanceMainnetURL', () => {
    it('should return a valid value', () => {
      const result = getBinanceMainnetURL('tokens?limit=100');
      expect(result).toEqual('https://dex.binance.org/api/v1/tokens?limit=100');
    });
  });
  describe('getMidgardURL', () => {
    it('should return a valid value', () => {
      const result = getMidgardURL('pools/BNB');
      expect(result).toEqual('http://localhost:8080/v1/pools/BNB');
    });
  });
  describe('getHeaders', () => {
    it('should return valid values', () => {
      const result = getHeaders('application/json', 'application/json');
      expect(result).toEqual({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      });
    });
  });
});
