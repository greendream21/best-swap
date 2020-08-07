import {
  getTickerFormat,
  getPair,
  getSymbolPair,
  compareShallowStr,
} from './stringHelper';
import { Pair } from '../types/bepswap';

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

  // getPair

  describe('getPair', () => {
    it('returns a valid value pair for "-" separated strings', () => {
      const result: Pair = getPair('HELLO-WORLD');
      expect(result).toEqual({ source: 'hello', target: 'world' });
    });
    it('returns a valid source value for non "-" separated strings', () => {
      const result: Pair = getPair('HELLO');
      expect(result.source).toEqual('hello');
      expect(result.target).toBeNothing();
    });
    it('returns a null value pair if no value entered', () => {
      const result: Pair = getPair();
      expect(result.source).toBeNothing();
      expect(result.target).toBeNothing();
    });
  });

  describe('getSymbolPair', () => {
    it('returns source and target symbols for ":" separated symbol pair', () => {
      const result: Pair = getSymbolPair('RUNE-67C:BNB');
      expect(result).toEqual({ source: 'rune-67c', target: 'bnb' });
    });
    it('returns a valid source value for non ":" separated strings', () => {
      const result: Pair = getSymbolPair('RUNE-67C');
      expect(result.source).toEqual('rune-67c');
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
});
