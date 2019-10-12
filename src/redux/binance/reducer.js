import actions from './actions';

const initState = {
  tokenList: [],
  marketList: [],
  ticker: [],
  error: null,
  loadingToken: false,
  loadingMarket: false,
  loadingTicker: false,
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.GET_BINANCE_TOKENS:
      return {
        ...state,
        loadingToken: true,
        error: null,
      };
    case actions.GET_BINANCE_TOKENS_SUCCESS:
      return {
        ...state,
        tokenList: payload,
        loadingToken: false,
      };
    case actions.GET_BINANCE_TOKENS_FAILED:
      return {
        ...state,
        loadingToken: false,
        error: payload,
      };
    case actions.GET_BINANCE_MARKETS:
      return {
        ...state,
        loadingMarket: true,
        error: null,
      };
    case actions.GET_BINANCE_MARKETS_SUCCESS:
      return {
        ...state,
        marketList: payload,
        loadingMarket: false,
      };
    case actions.GET_BINANCE_MARKETS_FAILED:
      return {
        ...state,
        loadingMarket: false,
        error: payload,
      };
    case actions.GET_BINANCE_TICKER:
      return {
        ...state,
        loadingTicker: true,
        error: null,
      };
    case actions.GET_BINANCE_TICKER_SUCCESS:
      return {
        ...state,
        ticker: payload[0] || {},
        loadingTicker: false,
      };
    case actions.GET_BINANCE_TICKER_FAILED:
      return {
        ...state,
        loadingTicker: false,
        error: payload,
      };
    default:
      return state;
  }
}
