const actions = {
  CHECK_USER: 'CHECK_USER',

  SAVE_WALLET: 'SAVE_WALLET',

  checkUser: () => ({ type: actions.CHECK_USER }),

  saveWallet: payload => ({
    type: actions.SAVE_WALLET,
    payload,
  }),
};

export default actions;
