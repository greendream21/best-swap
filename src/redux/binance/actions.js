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
};

export default actions;
