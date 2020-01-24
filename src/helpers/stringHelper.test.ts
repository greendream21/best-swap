import { getTickerFormat } from './stringHelper';

describe('helpers/stringHelper/', () => {
  describe('getTickerFormat', () => {
    it('should parse a pair ', () => {
      const result = getTickerFormat('STAKE:TUSDB-000');
      expect(result).toEqual('stake:tusdb');
    });

    it('should returns null of no symbol given ', () => {
      const result = getTickerFormat();
      expect(result).toBeNull;
    });

    it('should lowercase ticker only ', () => {
      const result = getTickerFormat('XXX000');
      expect(result).toEqual('xxx000');
    });
  });
});
