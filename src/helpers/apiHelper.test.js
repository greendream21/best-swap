import {
  Protocol,
  getBinanceMainnetURL,
  getBinanceTestnetURL,
  getHeaders,
  getMidgardBasePathByIP,
  getHostnameFromUrl,
} from './apiHelper';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    request: jest.fn(() => {}),
  })),
}));

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
  describe('getMidgardBasePathByIP', () => {
    it('creates a http base path by default', () => {
      const result = getMidgardBasePathByIP('121.0.0.1');
      expect(result).toEqual('http://121.0.0.1:8080');
    });
  });
  describe('getMidgardBasePathByIP', () => {
    it('creates a http base path ', () => {
      const result = getMidgardBasePathByIP('121.0.0.1', Protocol.HTTP);
      expect(result).toEqual('http://121.0.0.1:8080');
    });
    it('creates a https base path ', () => {
      const result = getMidgardBasePathByIP('121.0.0.3', Protocol.HTTPS);
      expect(result).toEqual('https://121.0.0.3:8080');
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
