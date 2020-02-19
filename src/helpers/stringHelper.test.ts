import {
  getTickerFormat,
  getBaseNumberFormat,
  getUserFormat,
  getPair,
  getFixedNumber,
  compareShallowStr,
  Pair,
} from './stringHelper';

describe('helpers/stringHelper/', () => {
  // getTickerFormat

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

  // getBaseNumberFormat

  describe('getBaseNumberFormat', () => {
    it('returns a valid value ', () => {
      const result = getBaseNumberFormat(10);
      expect(result).toEqual(1000000000);
    });
    it('returns 0 if we don\'t put something into the func ', () => {
      const result = getBaseNumberFormat();
      expect(result).toEqual(0);
    });
    it('returns 0 if we put a string into the func ', () => {
      const result = getBaseNumberFormat('hello');
      expect(result).toEqual(0);
    });
  });

  // getUserFormat

  describe('getUserFormat', () => {
    it('returns a valid value ', () => {
      const result = getUserFormat(100000000);
      expect(result).toEqual(1);
    });
    it('returns 0 if we don\'t input to function ', () => {
      const result = getUserFormat();
      expect(result).toEqual(0);
    });
    it('returns 0 if a string is input to function ', () => {
      const result = getBaseNumberFormat('hello');
      expect(result).toEqual(0);
    });
  });

  // getPair

  describe('getPair', () => {
    it('returns a valid value pair ', () => {
      const result: Pair = getPair('HELLO-WORLD');
      expect(result).toEqual({ source: 'hello', target: 'world' });
    });
    it('returns an empty array if no value entered', () => {
      const result: Pair = getPair();
      expect(result).toEqual({ source: '', target: '' });
    });
  });

  // getFixedNumber

  describe('getFixedNumber', () => {
    it('returns a valid value', () => {
      const result = getFixedNumber(100.888787, 3);
      expect(result).toEqual(100.889);
    });
    it('returns 0 if a string is input to function', () => {
      const result = getFixedNumber('hello', 4);
      expect(result).toEqual(0);
    });
    it('returns 0 if we don\'t input to function ', () => {
      const result = getFixedNumber();
      expect(result).toEqual(0);
    });
  });

  // compareShallowStr

  describe('compareShallowStr', () => {
    it('returns false if strings do not match', () => {
      const result = compareShallowStr('hello', 'world');
      expect(result).toEqual(false);
    });
    it('returns true if strings match', () => {
      const result = compareShallowStr('hello', 'hello');
      expect(result).toEqual(true);
    });
    it('returns true if numerical strings are input to function', () => {
      const result = compareShallowStr('123', '123');
      expect(result).toEqual(true);
    });
  });
});
