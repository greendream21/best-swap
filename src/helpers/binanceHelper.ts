import { baseAmount } from '@thorchain/asgardex-token';
import { isTestnet } from 'env';

import {
  Fees,
  TransferFees,
  DexFees,
  Fee,
  TransferFee,
} from 'redux/binance/types';

import { Maybe, Nothing } from 'types/bepswap';

import { bncClient } from '../env';


/**
 * Type guard for runtime checks of `Fee`
 */
export const isFee = (v: Fee | TransferFee | DexFees): v is Fee =>
  !!(v as Fee)?.msg_type &&
  (v as Fee)?.fee !== undefined &&
  (v as Fee)?.fee_for !== undefined;

/**
 * Type guard for `TransferFee`
 */
export const isTransferFee = (
  v: Fee | TransferFee | DexFees,
): v is TransferFee =>
  isFee((v as TransferFee)?.fixed_fee_params) &&
  !!(v as TransferFee)?.multi_transfer_fee;

/**
 * Type guard for `DexFees`
 */
export const isDexFees = (v: Fee | TransferFee | DexFees): v is DexFees =>
  (v as DexFees)?.dex_fee_fields?.length > 0;

export const getTransferFeeds = (fees: Fees): Maybe<TransferFees> =>
  fees.reduce((acc: Maybe<TransferFees>, dataItem) => {
    if (!acc && isTransferFee(dataItem)) {
      const single = dataItem.fixed_fee_params.fee;
      const multi = dataItem.multi_transfer_fee;
      if (single && multi) {
        return {
          single: baseAmount(single),
          multi: baseAmount(multi),
        } as TransferFees;
      }
      return Nothing;
    }
    return acc;
  }, Nothing);

export const getPrefix = () => {
  return isTestnet ? 'tbnb' : 'bnb';
};

export const isValidAddress = (address: string) => {
  return bncClient.checkAddress(address, getPrefix());
};

export const isAddress = (value: string) => {
  if (isTestnet && value.substr(0, 4) === 'tbnb') {
    return true;
  }

  if (!isTestnet && value.substr(0, 3) === 'bnb') {
    return true;
  }

  return false;
};
