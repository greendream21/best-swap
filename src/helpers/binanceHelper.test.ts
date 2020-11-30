import { tokenAmount } from '@thorchain/asgardex-token';

import { Fees, TransferFee, Fee, DexFees } from 'redux/binance/types';

import {
  getTransferFeeds,
  isFee,
  isTransferFee,
  isDexFees,
} from './binanceHelper';

describe('helpers/binanceHelpers', () => {
  const fee = {
    msg_type: 'submit_proposal',
    fee: 500000000,
    fee_for: 1,
  } as Fee;

  const fee2 = {
    msg_type: 'timeLock',
    fee: 1000000,
    fee_for: 1,
  } as Fee;

  const dexFees = {
    dex_fee_fields: [
      {
        fee_name: 'ExpireFee',
        fee_value: 25000,
      },
    ],
  } as DexFees;

  const transferFee = {
    fixed_fee_params: {
      msg_type: 'send',
      fee: 37500,
      fee_for: 1,
    },
    multi_transfer_fee: 30000,
    lower_limit_as_multi: 2,
  } as TransferFee;

  describe('isFee', () => {
    it('validates Fee', () => {
      expect(isFee(fee)).toBeTruthy();
    });
    it('invalidates a Fee', () => {
      expect(isFee(dexFees)).toBeFalsy();
    });
  });

  describe('isTransferFee', () => {
    it('validates TransferFee', () => {
      expect(isTransferFee(transferFee)).toBeTruthy();
    });
    it('invalidates a TransferFee', () => {
      expect(isTransferFee(fee)).toBeFalsy();
    });
  });

  describe('isDexFees', () => {
    it('validates DexFees', () => {
      expect(isDexFees(dexFees)).toBeTruthy();
    });
    it('invalidates a DexFees', () => {
      expect(isDexFees(fee)).toBeFalsy();
    });
  });

  describe('getTransferFeeds', () => {
    it('returns fees for transfer', () => {
      const fees: Fees = [fee, transferFee, dexFees, fee2];
      const result = getTransferFeeds(fees);
      expect(result?.single.amount()).toEqual(tokenAmount(37500).amount());
      expect(result?.multi.amount()).toEqual(tokenAmount(30000).amount());
    });
    it('returns Nothing for an empty list of fees', () => {
      const result = getTransferFeeds([]);
      expect(result).toBeNothing();
    });
    it('returns Nothing if no fees for transfer are available', () => {
      const result = getTransferFeeds([fee, dexFees]);
      expect(result).toBeNothing();
    });
  });
});
