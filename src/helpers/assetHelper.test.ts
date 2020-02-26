import { getTokenName } from './assetHelper';

describe('helpers/assetHelper', () => {
  describe('getTokenName for BNB', () => {
    it('should return a token symbol for BNB in the mainnet', () => {
      const result = getTokenName('BNB', true);
      expect(result).toEqual('BNB');
    });
    it('should return a token symbol for BNB in the testnet', () => {
      const result = getTokenName('BNB', false);
      expect(result).toEqual('BNB');
    });
    it('should return null for empty parameters', () => {
      const result = getTokenName();
      expect(result).toEqual(null);
    });
  });
  describe('getTokenName for RUNE', () => {
    it('should return a token symbol for RUNE in the mainnet', () => {
      const result = getTokenName('RUNE', true);
      expect(result).toEqual('RUNE-B1A');
    });
    it('should return a token symbol for RUNE in the testnet', () => {
      const result = getTokenName('RUNE', false);
      expect(result).toEqual('RUNE-A1F');
    });
  });
  describe('getTokenName for LOK', () => {
    it('should return a token symbol for LOK in the mainnet', () => {
      const result = getTokenName('LOK', true);
      expect(result).toEqual('LOKI-6A9');
    });
    it('should return a token symbol for LOK in the testnet', () => {
      const result = getTokenName('LOK', false);
      expect(result).toEqual('LOK-3C0');
    });
  });
  describe('getTokenName for LOKI', () => {
    it('should return a token symbol for LOKI in the mainnet', () => {
      const result = getTokenName('LOKI', true);
      expect(result).toEqual('LOKI-6A9');
    });
    it('should return a token symbol for LOKI in the testnet', () => {
      const result = getTokenName('LOKI', false);
      expect(result).toEqual('LOK-3C0');
    });
  });
  describe('getTokenName for ERD', () => {
    it('should return a token symbol for ERD in the mainnet', () => {
      const result = getTokenName('ERD', true);
      expect(result).toEqual('ERD-D06');
    });
    it('should return a token symbol for ERD in the testnet', () => {
      const result = getTokenName('ERD', false);
      expect(result).toEqual('ERD-D85');
    });
  });
  describe('getTokenName for FSN', () => {
    it('should return a token symbol for FSN in the mainnet', () => {
      const result = getTokenName('FSN', true);
      expect(result).toEqual('FSN-E14');
    });
    it('should return a token symbol for FSN in the testnet', () => {
      const result = getTokenName('FSN', false);
      expect(result).toEqual('FSN-F1B');
    });
  });
  describe('getTokenName for FTM', () => {
    it('should return a token symbol for FTM in the mainnet', () => {
      const result = getTokenName('FTM', true);
      expect(result).toEqual('FTM-A64');
    });
    it('should return a token symbol for FTM in the testnet', () => {
      const result = getTokenName('FTM', false);
      expect(result).toEqual('FTM-585');
    });
  });
  describe('getTokenName for TCAN', () => {
    it('should return a token symbol for TCAN in the mainnet', () => {
      const result = getTokenName('TCAN', true);
      expect(result).toEqual('CAN-677');
    });
    it('should return a token symbol for TCAN in the testnet', () => {
      const result = getTokenName('TCAN', false);
      expect(result).toEqual('TCAN-014');
    });
  });
  describe('getTokenName for CAN', () => {
    it('should return a token symbol for CAN in the mainnet', () => {
      const result = getTokenName('CAN', true);
      expect(result).toEqual('CAN-677');
    });
    it('should return a token symbol for CAN in the testnet', () => {
      const result = getTokenName('CAN', false);
      expect(result).toEqual('TCAN-014');
    });
  });
  describe('getTokenName for TOMOB', () => {
    it('should return a token symbol for TOMOB in the mainnet', () => {
      const result = getTokenName('TOMOB', true);
      expect(result).toEqual('TOMOB-4BC');
    });
    it('should return a token symbol for TOMOB in the testnet', () => {
      const result = getTokenName('TOMOB', false);
      expect(result).toEqual('TOMOB-1E1');
    });
  });
});
