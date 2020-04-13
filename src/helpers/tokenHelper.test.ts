// import BigNumber from 'bignumber.js';
import { bn } from '@thorchain/asgardex-util';
import {
  tokenAmount,
  baseAmount,
  isTokenAmount,
  isBaseAmount,
  baseToToken,
  tokenToBase,
  formatTokenAmount,
  formatBaseAsTokenAmount,
  formatTokenAmountCurrency,
} from './tokenHelper';
import { Denomination } from '../types/token';

describe('tokenHelper', () => {
  describe('token', () => {
    it('should create amount for token by given value', () => {
      const r = tokenAmount(10);
      expect(r.type).toEqual(Denomination.TOKEN);
      expect(r.amount()).toEqual(bn('10'));
    });
  });

  describe('base', () => {
    it('should create base amounts by given value', () => {
      const t = baseAmount(10);
      expect(t.type).toEqual(Denomination.BASE);
      expect(t.amount()).toEqual(bn('10'));
    });
  });

  describe('baseToToken', () => {
    it('should return token by given base amounts', () => {
      const t = baseToToken(baseAmount(123));
      expect(t.type).toEqual(Denomination.TOKEN);
      expect(t.amount()).toEqual(bn('0.00000123'));
    });
  });

  describe('tokenToBase', () => {
    it('should return base amounts by given token amounts', () => {
      const t = tokenToBase(tokenAmount(22));
      expect(t.type).toEqual(Denomination.BASE);
      expect(t.amount()).toEqual(bn('2200000000'));
    });
  });

  describe('isTokenAmount', () => {
    it('should return `true`', () => {
      const t = tokenAmount(10);
      expect(isTokenAmount(t)).toBeTruthy();
    });
    it('should return `false` for any other then TokenAmount', () => {
      const token = baseAmount(0);
      expect(isTokenAmount(token)).toBeFalsy();
    });
  });

  describe('isBaseAmount', () => {
    it('should return `true`', () => {
      const token = baseAmount(10);
      expect(isBaseAmount(token)).toBeTruthy();
    });
    it('should return `false` for any other then BaseAmount', () => {
      const t = tokenAmount(0);
      expect(isBaseAmount(t)).toBeFalsy();
    });
  });

  describe('formatTokenAmount', () => {
    it('formats a token value with 2 decimal', () => {
      const t = tokenAmount(11.0001);
      expect(formatTokenAmount(t)).toEqual('11.00');
    });
    it('formats a token value with 4 decimal', () => {
      const t = tokenAmount(11.0001);
      expect(formatTokenAmount(t, 4)).toEqual('11.0001');
    });
  });

  describe('formatTokenAmountCurrency', () => {
    it('formats a token value ', () => {
      const t = tokenAmount(11.0001);
      expect(formatTokenAmountCurrency(t)).toEqual('$11.00');
    });
    it('formats a token value ', () => {
      const t = tokenAmount(0);
      expect(formatTokenAmountCurrency(t)).toEqual('$0.00');
    });
  });

  describe('formatBaseAsTokenAmount', () => {
    it('formats a base value as token formatted with 2 decimal', () => {
      const result = formatBaseAsTokenAmount(baseAmount(12345));
      expect(result).toEqual('0.00');
    });
    it('formats a base value as token formatted with 4 decimal', () => {
      const result = formatBaseAsTokenAmount(baseAmount(12345), 4);
      expect(result).toEqual('0.0001');
    });
    it('formats a base value as token formatted with 8 decimal', () => {
      const result = formatBaseAsTokenAmount(baseAmount(12345), 8);
      expect(result).toEqual('0.00012345');
    });
  });
});
