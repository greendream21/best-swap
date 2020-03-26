import { binance } from 'asgardex-common';

export const GET_BINANCE_TOKENS = 'GET_BINANCE_TOKENS';
export interface GetBinanceTokens {
  type: typeof GET_BINANCE_TOKENS;
}
export const getBinanceTokens = () => ({
  type: GET_BINANCE_TOKENS,
});

export const GET_BINANCE_TOKENS_SUCCESS = 'GET_BINANCE_TOKENS_SUCCESS';
export interface GetBinanceTokensSuccess {
  type: typeof GET_BINANCE_TOKENS_SUCCESS;
  payload: binance.Token[];
}
export const getBinanceTokensSuccess = (payload: binance.Token[]) => ({
  type: GET_BINANCE_TOKENS_SUCCESS,
  payload,
});

export const GET_BINANCE_TOKENS_FAILED = 'GET_BINANCE_TOKENS_FAILED';
export interface GetBinanceTokensFailed {
  type: typeof GET_BINANCE_TOKENS_FAILED;
  payload: Error;
}
export const getBinanceTokensFailed = (payload: Error) => ({
  type: GET_BINANCE_TOKENS_FAILED,
  payload,
});

export const GET_BINANCE_MARKETS = 'GET_BINANCE_MARKETS';
export interface GetBinanceMarkets {
  type: typeof GET_BINANCE_MARKETS;
}
export const getBinanceMarkets = () => ({
  type: GET_BINANCE_MARKETS,
});

export const GET_BINANCE_MARKETS_SUCCESS = 'GET_BINANCE_MARKETS_SUCCESS';
export interface GetBinanceMarketsSuccess {
  type: typeof GET_BINANCE_MARKETS_SUCCESS;
  payload: binance.Market[];
}
export const getBinanceMarketsSuccess = (payload: binance.Market[]) => ({
  type: GET_BINANCE_MARKETS_SUCCESS,
  payload,
});
export const GET_BINANCE_MARKETS_FAILED = 'GET_BINANCE_MARKETS_FAILED';
export interface GetBinanceMarketsFailed {
  type: typeof GET_BINANCE_MARKETS_FAILED;
  payload: Error;
}
export const getBinanceMarketsFailed = (payload: Error) => ({
  type: GET_BINANCE_MARKETS_FAILED,
  payload,
});

export const GET_BINANCE_TICKER = 'GET_BINANCE_TICKER';
export interface GetBinanceTicker {
  type: typeof GET_BINANCE_TICKER;
  payload: string;
}
export const getBinanceTicker = (payload: string) => ({
  type: GET_BINANCE_TICKER,
  payload,
});

export const GET_BINANCE_TICKER_SUCCESS = 'GET_BINANCE_TICKER_SUCCESS';
export interface GetBinanceTickerSuccess {
  type: typeof GET_BINANCE_TICKER_SUCCESS;
  payload: binance.TickerStatistics[];
}
export const getBinanceTickerSuccess = (payload: binance.TickerStatistics[]) => ({
  type: GET_BINANCE_TICKER_SUCCESS,
  payload,
});

export const GET_BINANCE_TICKER_FAILED = 'GET_BINANCE_TICKER_FAILED';
export interface GetBinanceTickerFailed {
  type: typeof GET_BINANCE_TICKER_FAILED;
  payload: Error;
}
export const getBinanceTickerFailed = (payload: Error) => ({
  type: GET_BINANCE_TICKER_FAILED,
  payload,
});

export const GET_BINANCE_ACCOUNT = 'GET_BINANCE_ACCOUNT';
export interface GetBinanceAccount {
  type: typeof GET_BINANCE_ACCOUNT;
  payload: string;
}
export const getBinanceAccount = (payload: string) => ({
  type: GET_BINANCE_ACCOUNT,
  payload,
});

export const GET_BINANCE_ACCOUNT_SUCCESS = 'GET_BINANCE_ACCOUNT_SUCCESS';
export interface GetBinanceAccountSuccess {
  type: typeof GET_BINANCE_ACCOUNT_SUCCESS;
  payload: binance.Account;
}
export const getBinanceAccountSuccess = (payload: binance.Account) => ({
  type: GET_BINANCE_ACCOUNT_SUCCESS,
  payload,
});

export const GET_BINANCE_ACCOUNT_FAILED = 'GET_BINANCE_ACCOUNT_FAILED';
export interface GetBinanceAccountFailed {
  type: typeof GET_BINANCE_ACCOUNT_FAILED;
  payload: Error;
}
export const getBinanceAccountFailed = (payload: Error) => ({
  type: GET_BINANCE_ACCOUNT_FAILED,
  payload,
});

export const GET_BINANCE_TRANSACTIONS = 'GET_BINANCE_TRANSACTIONS';
export type GetBinanceTransactionsPayload = {
  address: string;
  symbol: string;
  startTime: number;
  endTime: number;
  limit: number;
};
export interface GetBinanceTransactions {
  type: typeof GET_BINANCE_TRANSACTIONS;
  payload: GetBinanceTransactionsPayload;
}
export const getBinanceTransactions = (
  payload: GetBinanceTransactionsPayload,
) => ({
  type: GET_BINANCE_TRANSACTIONS,
  payload,
});

export const GET_BINANCE_TRANSACTIONS_SUCCESS =
  'GET_BINANCE_TRANSACTIONS_SUCCESS';
export interface GetBinanceTransactionsSuccess {
  type: typeof GET_BINANCE_TRANSACTIONS_SUCCESS;
  payload: binance.TxPage;
}
export const getBinanceTransactionsSuccess = (payload: binance.TxPage) => ({
  type: GET_BINANCE_TRANSACTIONS_SUCCESS,
  payload,
});

export const GET_BINANCE_TRANSACTIONS_FAILED =
  'GET_BINANCE_TRANSACTIONS_FAILED';
export interface GetBinanceTransactionsFailed {
  type: typeof GET_BINANCE_TRANSACTIONS_FAILED;
  payload: Error;
}
export const getBinanceTransactionsFailed = (payload: Error) => ({
  type: GET_BINANCE_TRANSACTIONS_FAILED,
  payload,
});

export const GET_BINANCE_OPEN_ORDERS = 'GET_BINANCE_OPEN_ORDERS';
export type GetBinanceOpenOrdersPayload = {
  address: string;
  symbol: string;
};
export interface GetBinanceOpenOrders {
  type: typeof GET_BINANCE_OPEN_ORDERS;
  payload: GetBinanceOpenOrdersPayload;
}
export const getBinanceOpenOrders = (payload: GetBinanceOpenOrdersPayload) => ({
  type: GET_BINANCE_OPEN_ORDERS,
  payload,
});

export const GET_BINANCE_OPEN_ORDERS_SUCCESS =
  'GET_BINANCE_OPEN_ORDERS_SUCCESS';
export interface GetBinanceOpenOrdersSuccess {
  type: typeof GET_BINANCE_OPEN_ORDERS_SUCCESS;
  payload: binance.OrderList;
}
export const getBinanceOpenOrdersSuccess = (payload: binance.OrderList) => ({
  type: GET_BINANCE_OPEN_ORDERS_SUCCESS,
  payload,
});

export const GET_BINANCE_OPEN_ORDERS_FAILED = 'GET_BINANCE_OPEN_ORDERS_FAILED';
export interface GetBinanceOpenOrdersFailed {
  type: typeof GET_BINANCE_OPEN_ORDERS_FAILED;
  payload: Error;
}
export const getBinanceOpenOrdersFailed = (payload: Error) => ({
  type: GET_BINANCE_OPEN_ORDERS_FAILED,
  payload,
});

export type BinanceActionTypes =
  | GetBinanceTokens
  | GetBinanceTokensSuccess
  | GetBinanceTokensFailed
  | GetBinanceTicker
  | GetBinanceTickerSuccess
  | GetBinanceTickerFailed
  | GetBinanceAccount
  | GetBinanceAccountSuccess
  | GetBinanceAccountFailed
  | GetBinanceTransactions
  | GetBinanceTransactionsFailed
  | GetBinanceTransactionsSuccess
  | GetBinanceMarkets
  | GetBinanceMarketsSuccess
  | GetBinanceMarketsFailed
  | GetBinanceOpenOrders
  | GetBinanceOpenOrdersSuccess
  | GetBinanceOpenOrdersFailed;
