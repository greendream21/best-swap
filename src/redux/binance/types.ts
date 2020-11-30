import { RemoteData } from '@devexperts/remote-data-ts';
import {
  Token,
  TickerStatistics,
  Account,
  TxPage,
  OrderList,
  Market,
  WS,
} from '@thorchain/asgardex-binance';
import { BaseAmount } from '@thorchain/asgardex-token';

import { Maybe } from 'types/bepswap';

export type TransferEventRD = RemoteData<Error, WS.TransferEvent>;

export type State = {
  tokenList: Token[];
  marketList: Market[];
  ticker: Maybe<TickerStatistics>;
  account: Maybe<Account>;
  accountSequence: Maybe<number>;
  transactions: Maybe<TxPage>;
  openOrders: Maybe<OrderList>;
  transferFees: TransferFeesRD;
  error: Maybe<Error>;
  loadingToken: boolean;
  loadingMarket: boolean;
  loadingTicker: boolean;
  wsError: Maybe<Error>;
  wsTransferEvent: TransferEventRD;
};

// TODO (@Veado) Extract all following "fee" types into `asgardex-binance`
// All based on https://docs.binance.org/trading-spec.html#fees

export type FeeType =
  | 'submit_proposal'
  | 'deposit'
  | 'vote'
  | 'create_validator'
  | 'remove_validator'
  | 'dexList'
  | 'orderNew'
  | 'orderCancel'
  | 'issueMsg'
  | 'mintMsg'
  | 'tokensBurn'
  | 'tokensFreeze'
  | 'send'
  | 'timeLock'
  | 'timeUnlock'
  | 'timeRelock'
  | 'setAccountFlags'
  | 'HTLT'
  | 'depositHTLT'
  | 'claimHTLT'
  | 'refundHTLT';

export type Fee = {
  msg_type: FeeType;
  fee: number;
  fee_for: number;
};

export type TransferFee = {
  fixed_fee_params: Fee;
  multi_transfer_fee: number;
  lower_limit_as_multi: number;
};

export type DexFeeName =
  | 'ExpireFee'
  | 'ExpireFeeNative'
  | 'CancelFee'
  | 'CancelFeeNative'
  | 'FeeRate'
  | 'FeeRateNative'
  | 'IOCExpireFee'
  | 'IOCExpireFeeNative';

export type DexFee = {
  fee_name: DexFeeName;
  fee_value: number;
};

export type DexFees = {
  dex_fee_fields: DexFee[];
};

export type Fees = Array<Fee | TransferFee | DexFees>;

// #END TODO

/**
 * Fees of Transfers
 * https://docs.binance.org/trading-spec.html#fees
 */
export type TransferFees = {
  /**
   * Fee of a transfer to a single address
   */
  single: BaseAmount;
  /**
   * Multi send fee to muliple addresses
   * If the count of output address is bigger than the threshold, currently it's 2,
   * then the total transaction fee is 0.0003 BNB per token per address.
   * https://docs.binance.org/trading-spec.html#multi-send-fees
   */
  multi: BaseAmount; // multi
};

export type TransferFeesRD = RemoteData<Error, TransferFees>;
