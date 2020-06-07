import {
  getBinanceMainnetURL,
  getBinanceTestnetURL,
  getHeaders,
  getHostnameFromUrl,
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
  describe('getHeaders', () => {
    it('should return valid values', () => {
      const result = getHeaders('application/json', 'application/json');
      expect(result).toEqual({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      });
    });
  });
  describe('getHostnameFromUrl', () => {
    it('parses ip from url', () => {
      const result = getHostnameFromUrl('http://121.0.0.1:8080');
      expect(result).toEqual('121.0.0.1');
    });
    it('parses hostname from url', () => {
      const result = getHostnameFromUrl(
        'https://testnet-dex.binance.org/api/v1/tokens',
      );
      expect(result).toEqual('testnet-dex.binance.org');
    });
    it('returns Nothing if parsing failed', () => {
      const result = getHostnameFromUrl('any-invalid-url');
      expect(result).toBeNothing();
    });
  });
});
