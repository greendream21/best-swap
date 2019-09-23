const actions = {
  GET_RUNE_PRICE: 'GET_RUNE_PRICE',
  GET_RUNE_PRICE_SUCCESS: 'GET_RUNE_PRICE_SUCCESS',
  GET_RUNE_PRICE_FAILED: 'GET_RUNE_PRICE_FAILED',

  getRunePrice: payload => ({ type: actions.GET_RUNE_PRICE, payload }),
  getRunePriceSuccess: payload => ({
    type: actions.GET_RUNE_PRICE_SUCCESS,
    payload,
  }),
  getRunePriceFailed: payload => ({
    type: actions.GET_RUNE_PRICE_FAILED,
    payload,
  }),

  GET_COINS_LIST: 'GET_COINS_LIST',
  GET_COINS_LIST_SUCCESS: 'GET_COINS_LIST_SUCCESS',
  GET_COINS_LIST_FAILED: 'GET_COINS_LIST_FAILED',

  getCoinsList: payload => ({ type: actions.GET_COINS_LIST, payload }),
  getCoinsListSuccess: payload => ({
    type: actions.GET_COINS_LIST_SUCCESS,
    payload,
  }),
  getCoinsListFailed: payload => ({
    type: actions.GET_COINS_LIST_FAILED,
    payload,
  }),
};

export default actions;
