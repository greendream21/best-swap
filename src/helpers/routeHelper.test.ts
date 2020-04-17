import {
  isPoolPage,
  matchSwapDetailPair,
  matchPoolSymbol,
} from './routerHelper';

describe('routeHelper', () => {
  describe('isPoolPage', () => {
    it('should parse an url of a pool page', () => {
      const result = isPoolPage('/pool');
      expect(result).toBeTruthy();
    });
    it('should parse an url pool page and symbol', () => {
      const result = isPoolPage('/pool/TCAN-014');
      expect(result).toBeTruthy();
    });
    it('should not parse url pools page', () => {
      const result = isPoolPage('/swap');
      expect(result).toBeFalsy();
    });
  });

  describe('matchSwapDetailPair', () => {
    it('should match swap detail pair', () => {
      const result = matchSwapDetailPair('/swap/detail/fsn-rune');
      expect(result?.source).toEqual('fsn');
      expect(result?.target).toEqual('rune');
    });
    it('should not match a pair at an swap detail page', () => {
      const result = matchSwapDetailPair('/swap/detail');
      expect(result).toBeNothing();
    });
    it('should not match a pair at pool page', () => {
      const result = matchSwapDetailPair('/pool');
      expect(result).toBeNothing();
    });
  });

  describe('matchPoolSymbol', () => {
    it('should match symbol of current pool', () => {
      const result = matchPoolSymbol('/pool/fsn-rune');
      expect(result).toEqual('fsn-rune');
    });
    it('should not match a pool symbol at other pages', () => {
      const result = matchPoolSymbol('/swap');
      expect(result).toBeNothing();
    });
  });
});
