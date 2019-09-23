import actions from './actions';

const initState = {
  runePrice: null,
  coinsList: [],
  error: null,
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.GET_RUNE_PRICE_SUCCESS:
      return {
        ...state,
        runePrice: payload,
      };
    case actions.GET_COINS_LIST_SUCCESS:
      return {
        ...state,
        coinsList: payload,
      };
    default:
      return state;
  }
}
