const actions = {
  CHECK_USER: 'CHECK_USER',

  SAVE_WALLET: 'SAVE_WALLET',
  FORGET_WALLET: 'FORGET_WALLET',

  REFRESH_BALANCE: 'REFRESH_BALANCE',
  REFRESH_BALANCE_SUCCESS: 'REFRESH_BALANCE_SUCCESS',
  REFRESH_BALANCE_FAILED: 'REFRESH_BALANCE_FAILED',

  REFRESH_STAKES: 'REFRESH_STAKES',
  REFRESH_STAKES_SUCCESS: 'REFRESH_STAKES_SUCCESS',
  REFRESH_STAKES_FAILED: 'REFRESH_STAKES_FAILED',

  SET_ASSET_DATA: 'SET_ASSET_DATA',
  SET_STAKE_DATA: 'SET_STAKE_DATA',

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

  checkUser: () => ({ type: actions.CHECK_USER }),

  saveWallet: payload => ({ type: actions.SAVE_WALLET, payload }),
  forgetWallet: payload => ({ type: actions.FORGET_WALLET, payload }),

  refreshBalance: payload => ({ type: actions.REFRESH_BALANCE, payload }),
  refreshBalanceSuccess: payload => ({
    type: actions.REFRESH_BALANCE_SUCCESS,
    payload,
  }),
  refreshBalanceFailed: payload => ({
    type: actions.REFRESH_BALANCE_FAILED,
    payload,
  }),

  refreshStake: payload => ({ type: actions.REFRESH_STAKES, payload }),
  refreshStakeSuccess: payload => ({
    type: actions.REFRESH_STAKES_SUCCESS,
    payload,
  }),
  refreshStakeFailed: payload => ({
    type: actions.REFRESH_STAKES_FAILED,
    payload,
  }),

  setAssetData: payload => ({ type: actions.SET_ASSET_DATA, payload }),
  setStakeData: payload => ({ type: actions.SET_STAKE_DATA, payload }),
};

export default actions;
