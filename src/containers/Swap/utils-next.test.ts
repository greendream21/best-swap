import { validatePair } from './utils-next';

describe('swap/utils-next/', () => {
  describe('validatePair', () => {
    it('should filter source and target data', () => {
      const pair = { source: 'A', target: 'B' };
      const sources = [{ asset: 'A-B' }, { asset: 'B-C' }, { asset: 'C-D' }];
      const targets = [{ asset: 'A-B' }, { asset: 'B-C' }, { asset: 'C-D' }];
      const result = validatePair(pair, sources, targets);
      const expected = {
        sourceData: [{ asset: 'B-C' }, { asset: 'C-D' }],
        targetData: [{ asset: 'A-B' }, { asset: 'C-D' }],
      };
      expect(result).toEqual(expected);
    });

    it('should not filter anything if pair are unknown', () => {
      const pair = {};
      const sources = [{ asset: 'A-B' }, { asset: 'B-C' }, { asset: 'C-D' }];
      const targets = [{ asset: 'A-B' }, { asset: 'B-C' }, { asset: 'C-D' }];
      const result = validatePair(pair, sources, targets);
      const expected = {
        sourceData: [...sources],
        targetData: [...targets],
      };
      expect(result).toEqual(expected);
    });
});
});
