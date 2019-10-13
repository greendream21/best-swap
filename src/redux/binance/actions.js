const actions = {
  GET_BINANCE_TOKENS: 'GET_BINANCE_TOKENS',
  GET_BINANCE_TOKENS_SUCCESS: 'GET_BINANCE_TOKENS_SUCCESS',
  GET_BINANCE_TOKENS_FAILED: 'GET_BINANCE_TOKENS_FAILED',

  getBinanceTokens: payload => ({ type: actions.GET_BINANCE_TOKENS, payload }),
  getBinanceTokensSuccess: payload => ({
    type: actions.GET_BINANCE_TOKENS_SUCCESS,
    payload,
  }),
  getBinanceTokensFailed: payload => ({
    type: actions.GET_BINANCE_TOKENS_FAILED,
    payload,
  }),

  GET_BINANCE_MARKETS: 'GET_BINANCE_MARKETS',
  GET_BINANCE_MARKETS_SUCCESS: 'GET_BINANCE_MARKETS_SUCCESS',
  GET_BINANCE_MARKETS_FAILED: 'GET_BINANCE_MARKETS_FAILED',

  getBinanceMarkets: payload => ({
    type: actions.GET_BINANCE_MARKETS,
    payload,
  }),
  getBinanceMarketsSuccess: payload => ({
    type: actions.GET_BINANCE_MARKETS_SUCCESS,
    payload,
  }),
  getBinanceMarketsFailed: payload => ({
    type: actions.GET_BINANCE_MARKETS_FAILED,
    payload,
  }),

  GET_BINANCE_TICKER: 'GET_BINANCE_TICKER',
  GET_BINANCE_TICKER_SUCCESS: 'GET_BINANCE_TICKER_SUCCESS',
  GET_BINANCE_TICKER_FAILED: 'GET_BINANCE_TICKER_FAILED',

  getBinanceTicker: payload => ({
    type: actions.GET_BINANCE_TICKER,
    payload,
  }),
  getBinanceTickerSuccess: payload => ({
    type: actions.GET_BINANCE_TICKER_SUCCESS,
    payload,
  }),
  getBinanceTickerFailed: payload => ({
    type: actions.GET_BINANCE_TICKER_FAILED,
    payload,
  }),

  GET_BINANCE_ACCOUNT: 'GET_BINANCE_ACCOUNT',
  GET_BINANCE_ACCOUNT_SUCCESS: 'GET_BINANCE_ACCOUNT_SUCCESS',
  GET_BINANCE_ACCOUNT_FAILED: 'GET_BINANCE_ACCOUNT_FAILED',

  getBinanceAccount: payload => ({
    type: actions.GET_BINANCE_ACCOUNT,
    payload,
  }),
  getBinanceAccountSuccess: payload => ({
    type: actions.GET_BINANCE_ACCOUNT_SUCCESS,
    payload,
  }),
  getBinanceAccountFailed: payload => ({
    type: actions.GET_BINANCE_ACCOUNT_FAILED,
    payload,
  }),

  GET_BINANCE_TRANSACTIONS: 'GET_BINANCE_TRANSACTIONS',
  GET_BINANCE_TRANSACTIONS_SUCCESS: 'GET_BINANCE_TRANSACTIONS_SUCCESS',
  GET_BINANCE_TRANSACTIONS_FAILED: 'GET_BINANCE_TRANSACTIONS_FAILED',

  getBinanceTransactions: payload => ({
    type: actions.GET_BINANCE_TRANSACTIONS,
    payload,
  }),
  getBinanceTransactionsSuccess: payload => ({
    type: actions.GET_BINANCE_TRANSACTIONS_SUCCESS,
    payload,
  }),
  getBinanceTransactionsFailed: payload => ({
    type: actions.GET_BINANCE_TRANSACTIONS_FAILED,
    payload,
  }),

  GET_BINANCE_OPEN_ORDERS: 'GET_BINANCE_OPEN_ORDERS',
  GET_BINANCE_OPEN_ORDERS_SUCCESS: 'GET_BINANCE_OPEN_ORDERS_SUCCESS',
  GET_BINANCE_OPEN_ORDERS_FAILED: 'GET_BINANCE_OPEN_ORDERS_FAILED',

  getBinanceOpenOrders: payload => ({
    type: actions.GET_BINANCE_OPEN_ORDERS,
    payload,
  }),
  getBinanceOpenOrdersSuccess: payload => ({
    type: actions.GET_BINANCE_OPEN_ORDERS_SUCCESS,
    payload,
  }),
  getBinanceOpenOrdersFailed: payload => ({
    type: actions.GET_BINANCE_OPEN_ORDERS_FAILED,
    payload,
  }),

  GET_BINANCE_DEPTH: 'GET_BINANCE_DEPTH',
  GET_BINANCE_DEPTH_SUCCESS: 'GET_BINANCE_DEPTH_SUCCESS',
  GET_BINANCE_DEPTH_FAILED: 'GET_BINANCE_DEPTH_FAILED',

  getBinanceDepth: payload => ({
    type: actions.GET_BINANCE_DEPTH,
    payload,
  }),
  getBinanceDepthSuccess: payload => ({
    type: actions.GET_BINANCE_DEPTH_SUCCESS,
    payload,
  }),
  getBinanceDepthFailed: payload => ({
    type: actions.GET_BINANCE_DEPTH_FAILED,
    payload,
  }),
};

export default actions;
