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

  SET_BASE_PRICE_ASSET: 'SET_BASE_PRICE_ASSET',

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

  GET_USER_STAKE_DATA_REQUEST: 'GET_USER_STAKE_DATA_REQUEST',
  GET_USER_STAKE_DATA_SUCCESS: 'GET_USER_STAKE_DATA_SUCCESS',
  GET_USER_STAKE_DATA_FAILED: 'GET_USER_STAKE_DATA_FAILED',

  getUserStakeData: payload => ({
    type: actions.GET_USER_STAKE_DATA_REQUEST,
    payload,
  }),
  getUserStakeDataSuccess: payload => ({
    type: actions.GET_USER_STAKE_DATA_SUCCESS,
    payload,
  }),
  getUserStakeDataFailed: payload => ({
    type: actions.GET_USER_STAKE_DATA_FAILED,
    payload,
  }),

  setAssetData: payload => ({ type: actions.SET_ASSET_DATA, payload }),
  setStakeData: payload => ({ type: actions.SET_STAKE_DATA, payload }),

  setBasePriceAsset: payload => ({
    type: actions.SET_BASE_PRICE_ASSET,
    payload,
  }),
};

export default actions;
