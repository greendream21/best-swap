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
};

export default actions;
