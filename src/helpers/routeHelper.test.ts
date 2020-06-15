import {
  isPoolPage,
  matchSwapDetailPair,
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
});
