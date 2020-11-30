import { Pair } from 'types/bepswap';

import {
  getTickerFormat,
  getSymbolPair,
  compareShallowStr,
  isShortFormatPossible,
  getShortAmount,
} from './stringHelper';

describe('helpers/stringHelper/', () => {
  // getTickerFormat

  describe('getTickerFormat', () => {
    it('should get a ticker from pool and symbol', () => {
      const result = getTickerFormat('BNB.TUSDB-000');
      expect(result).toEqual('tusdb');
    });
    it('should get a ticker from symbol', () => {
      const result = getTickerFormat('TUSDB-000');
      expect(result).toEqual('tusdb');
    });
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

  describe('getSymbolPair', () => {
    it('returns source and target symbols for ":" separated symbol pair', () => {
      const result: Pair = getSymbolPair('RUNE-67C:BNB');
      expect(result).toEqual({ source: 'RUNE-67C', target: 'BNB' });
    });
    it('returns a valid source value for non ":" separated strings', () => {
      const result: Pair = getSymbolPair('RUNE-67C');
      expect(result.source).toEqual('RUNE-67C');
      expect(result.target).toBeNothing();
    });
    it('returns a null value pair if no value entered', () => {
      const result: Pair = getSymbolPair();
      expect(result.source).toBeNothing();
      expect(result.target).toBeNothing();
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

  // isShortFormatPossible

  describe('isShortFormatPossible', () => {
    it('returns true if the amount is greater than 0.001', () => {
      const amount = 0.03142343;
      expect(isShortFormatPossible(amount)).toEqual(true);
    });
    it('returns false if the amount is less than 0.001', () => {
      const amount = 0.00042412;
      expect(isShortFormatPossible(amount)).toEqual(false);
    });
  });

  // getShortAmount

  describe('getShortAmount', () => {
    it('returns short amount if the amount is greater than 0.001', () => {
      const amount = 0.00354217;
      expect(getShortAmount(amount)).toEqual('0.004');
    });
    it('returns origin amount if the amount is less than 0.001', () => {
      const amount = 0.00003542;
      expect(getShortAmount(amount)).toEqual('0.00003542');
    });
  });
});
