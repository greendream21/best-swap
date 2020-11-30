import {
  OrderList,
  TxPage,
  Account,
  TickerStatistics,
  Market,
  Token,
  WS,
} from '@thorchain/asgardex-binance';

import { NET } from '../../env';
import { TransferFeesRD } from './types';

/* /////////////////////////////////////////////////////////////
// api
///////////////////////////////////////////////////////////// */
export const getBinanceData = () => ({ type: 'GET_BINANCE_DATA' } as const);

export const getBinanceTokens = () => ({ type: 'GET_BINANCE_TOKENS' } as const);

export const getBinanceTokensSuccess = (payload: Token[]) =>
  ({ type: 'GET_BINANCE_TOKENS_SUCCESS', payload } as const);

export const getBinanceTokensFailed = (payload: Error) =>
  ({ type: 'GET_BINANCE_TOKENS_FAILED', payload } as const);

export const getBinanceMarkets = () =>
  ({ type: 'GET_BINANCE_MARKETS' } as const);

export const getBinanceMarketsSuccess = (payload: Market[]) =>
  ({ type: 'GET_BINANCE_MARKETS_SUCCESS', payload } as const);

export const getBinanceMarketsFailed = (payload: Error) =>
  ({ type: 'GET_BINANCE_MARKETS_FAILED', payload } as const);

export const getBinanceTicker = (payload: string) =>
  ({ type: 'GET_BINANCE_TICKER', payload } as const);

export const getBinanceTickerSuccess = (payload: TickerStatistics[]) =>
  ({ type: 'GET_BINANCE_TICKER_SUCCESS', payload } as const);

export const getBinanceTickerFailed = (payload: Error) =>
  ({ type: 'GET_BINANCE_TICKER_FAILED', payload } as const);

export const getBinanceAccount = (payload: string) =>
  ({ type: 'GET_BINANCE_ACCOUNT', payload } as const);

export const getBinanceAccountSuccess = (payload: Account) =>
  ({ type: 'GET_BINANCE_ACCOUNT_SUCCESS', payload } as const);

export const getBinanceAccountFailed = (payload: Error) =>
  ({ type: 'GET_BINANCE_ACCOUNT_FAILED', payload } as const);

export type GetBinanceTransactionsPayload = {
  address: string;
  symbol: string;
  startTime: number;
  endTime: number;
  limit: number;
};
export const getBinanceTransactions = (
  payload: GetBinanceTransactionsPayload,
) => ({ type: 'GET_BINANCE_TRANSACTIONS', payload } as const);

export const getBinanceTransactionsSuccess = (payload: TxPage) =>
  ({ type: 'GET_BINANCE_TRANSACTIONS_SUCCESS', payload } as const);

export const getBinanceTransactionsFailed = (payload: Error) =>
  ({ type: 'GET_BINANCE_TRANSACTIONS_FAILED', payload } as const);

export type GetBinanceOpenOrdersPayload = {
  address: string;
  symbol: string;
};
export const getBinanceOpenOrders = (payload: GetBinanceOpenOrdersPayload) =>
  ({ type: 'GET_BINANCE_OPEN_ORDERS', payload } as const);

export const getBinanceOpenOrdersSuccess = (payload: OrderList) =>
  ({ type: 'GET_BINANCE_OPEN_ORDERS_SUCCESS', payload } as const);

export const getBinanceOpenOrdersFailed = (payload: Error) =>
  ({ type: 'GET_BINANCE_OPEN_ORDERS_FAILED', payload } as const);

export const getBinanceFees = (net: NET) =>
  ({ type: 'GET_BINANCE_FEES', net } as const);

export const getBinanceTransferFeesResult = (result: TransferFeesRD) =>
  ({ type: 'GET_BINANCE_TRANSFER_FEES_RESULT', result } as const);

/* /////////////////////////////////////////////////////////////
// ws
///////////////////////////////////////////////////////////// */

export const wsBinanceError = (payload: Error) =>
  ({ type: 'WS_BINANCE_ERROR', payload } as const);

export type SubscribeBinanceTransfersPayload = {
  address: string;
  net: NET;
};
export const subscribeBinanceTransfers = (
  payload: SubscribeBinanceTransfersPayload,
) => ({ type: 'SUBSCRIBE_BINANCE_TRANSFERS', payload } as const);

export const subscribeBinanceTransfersFailed = (error: Error) =>
  ({ type: 'SUBSCRIBE_BINANCE_TRANSFERS_FAILED', error } as const);

export const unSubscribeBinanceTransfers = () =>
  ({ type: 'UNSUBSCRIBE_BINANCE_TRANSFERS' } as const);

export const binanceTransfersMessageReceived = (event: WS.TransferEvent) =>
  ({ type: 'BINANCE_TRANSFERS_MESSAGE_RECEIVED', event } as const);

export type BinanceActionTypes = ReturnType<
  | typeof getBinanceData
  | typeof getBinanceTokens
  | typeof getBinanceTokensSuccess
  | typeof getBinanceTokensFailed
  | typeof getBinanceTicker
  | typeof getBinanceTickerSuccess
  | typeof getBinanceTickerFailed
  | typeof getBinanceAccount
  | typeof getBinanceAccountSuccess
  | typeof getBinanceAccountFailed
  | typeof getBinanceTransactions
  | typeof getBinanceTransactionsFailed
  | typeof getBinanceTransactionsSuccess
  | typeof getBinanceMarkets
  | typeof getBinanceMarketsSuccess
  | typeof getBinanceMarketsFailed
  | typeof getBinanceOpenOrders
  | typeof getBinanceOpenOrdersSuccess
  | typeof getBinanceOpenOrdersFailed
  | typeof getBinanceFees
  | typeof getBinanceTransferFeesResult
  | typeof wsBinanceError
  | typeof subscribeBinanceTransfers
  | typeof subscribeBinanceTransfersFailed
  | typeof unSubscribeBinanceTransfers
  | typeof binanceTransfersMessageReceived
>;
