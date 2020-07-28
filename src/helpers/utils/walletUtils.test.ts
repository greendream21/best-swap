import { isBEP8Token } from './walletUtils';

describe('Wallet Utils', () => {
  describe('isBEP8Token', () => {
    it('RUNE-A1F is not mini token', () => {
      expect(isBEP8Token('RUNE-A1F')).toEqual(false);
    });
    it('RUNE-A1FM is mini token', () => {
      expect(isBEP8Token('RUNE-A1FM')).toEqual(true);
    });
    it('BNB is not mini token', () => {
      expect(isBEP8Token('BNB')).toEqual(false);
    });
  });
});
