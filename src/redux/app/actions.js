const actions = {
  SET_TX_TIMER_TYPE: 'SET_TX_TIMER_TYPE',
  SET_TX_TIMER_MODAL: 'SET_TX_TIMER_MODAL',
  SET_TX_TIMER_STATUS: 'SET_TX_TIMER_STATUS',
  SET_TX_TIMER_VALUE: 'SET_TX_TIMER_VALUE',
  RESET_TX_STATUS: 'RESET_TX_STATUS',

  setTxTimerType: payload => ({ type: actions.SET_TX_TIMER_TYPE, payload }),
  setTxTimerModal: payload => ({ type: actions.SET_TX_TIMER_MODAL, payload }),
  setTxTimerStatus: payload => ({ type: actions.SET_TX_TIMER_STATUS, payload }),
  setTxTimerValue: payload => ({ type: actions.SET_TX_TIMER_VALUE, payload }),
  resetTxStatus: () => ({ type: actions.RESET_TX_STATUS }),
};

export default actions;
