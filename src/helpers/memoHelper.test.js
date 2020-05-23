import { getSwapMemo, getStakeMemo, getWithdrawMemo } from './memoHelper';

describe('helpers/memoHelper/', () => {
  describe('getSwapMemo', () => {
    it('should create a memo for the swap tx', () => {
      const result = getSwapMemo('RUNE', 'xyz', '2');
      expect(result).toEqual('SWAP:BNB.RUNE:xyz:2');
    });
  });

  describe('getStakeMemo', () => {
    it('should create a memo for the creating pool', () => {
      const address = 'tbnb123456';
      const result = getStakeMemo('TUSDB', address);
      expect(result).toEqual(`STAKE:BNB.TUSDB:${address}`);
    });
  });

  describe('getWithdrawMemo', () => {
    it('should create a memo for the unstake/withdraw tx', () => {
      const result = getWithdrawMemo('FSN', 50);
      expect(result).toEqual('WITHDRAW:BNB.FSN:50');
    });
  });
});
