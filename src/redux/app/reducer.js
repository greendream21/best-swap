import actions from './actions';

const initState = {
  txStatus: {
    type: null,
    modal: false,
    value: null,
    status: false,
  },
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.SET_TX_TIMER_TYPE:
      return {
        ...state,
        txStatus: {
          ...state.txStatus,
          type: payload,
        },
      };
    case actions.SET_TX_TIMER_MODAL:
      return {
        ...state,
        txStatus: {
          ...state.txStatus,
          modal: payload,
        },
      };
    case actions.SET_TX_TIMER_STATUS:
      return {
        ...state,
        txStatus: {
          ...state.txStatus,
          status: payload,
        },
      };
    case actions.SET_TX_TIMER_VALUE:
      return {
        ...state,
        txStatus: {
          ...state.txStatus,
          value: payload,
        },
      };
    case actions.RESET_TX_STATUS:
      return {
        ...state,
        txStatus: initState.txStatus,
      };
    default:
      return state;
  }
}
