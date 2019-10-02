import actions from './actions';

const initState = {
  tokenList: [],
  marketList: [],
  error: null,
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.GET_BINANCE_TOKENS_SUCCESS:
      return {
        ...state,
        tokenList: payload,
      };
    case actions.GET_BINANCE_MARKETS_SUCCESS:
      return {
        ...state,
        marketList: payload,
      };
    default:
      return state;
  }
}
