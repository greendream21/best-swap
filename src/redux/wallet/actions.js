const actions = {
  CHECK_USER: 'CHECK_USER',

  SAVE_WALLET: 'SAVE_WALLET',
  FORGET_WALLET: 'FORGET_WALLET',

  checkUser: () => ({ type: actions.CHECK_USER }),

  saveWallet: payload => ({
    type: actions.SAVE_WALLET,
    payload,
  }),

  forgetWallet: payload => ({
    type: actions.FORGET_WALLET,
    payload,
  }),

  SET_ASSET_DATA: 'SET_ASSET_DATA',

  setAssetData: payload => ({
    type: actions.SET_ASSET_DATA,
    payload,
  }),

  SET_STAKE_DATA: 'SET_STAKE_DATA',

  setStakeData: payload => ({
    type: actions.SET_STAKE_DATA,
    payload,
  }),
};

export default actions;
