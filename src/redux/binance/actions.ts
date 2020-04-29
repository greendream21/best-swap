import {
  OrderList,
  TxPage,
  Account,
  TickerStatistics,
  Market,
  Token,
} from '@thorchain/asgardex-binance';

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

export type BinanceActionTypes = ReturnType<
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
>;
