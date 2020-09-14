import { abbreviateNumber } from './numberHelper';

describe('helpers/numberHelper/', () => {
  // abbreviateNumber
  describe('abbreviateNumber', () => {
    it('should return short number with K', () => {
      const result = abbreviateNumber(1857);
      expect(result).toEqual('1.857 K');
    });

    it('should return short number with M', () => {
      const result = abbreviateNumber(10938923);
      expect(result).toEqual('10.939 M');
    });

    it('should return short number with B', () => {
      const result = abbreviateNumber(4107932892);
      expect(result).toEqual('4.108 B');
    });

    it('should return short number with t', () => {
      const result = abbreviateNumber(84310979328923);
      expect(result).toEqual('84.311 t');
    });
  });
});
