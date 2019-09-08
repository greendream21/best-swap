import actions from './actions';

const initState = {
  userData: {},
  tokens: [],
  tokenData: {},
  swapData: {},
  swapTx: {},
  stakeData: {},
  stakeTx: {},
  error: null,
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.GET_USER_DATA_SUCCESS:
      return {
        ...state,
        userData: payload,
        error: null,
      };
    case actions.GET_TOKENS_SUCCESS:
      return {
        ...state,
        tokens: payload,
        error: null,
      };
    case actions.GET_TOKENDATA_SUCCESS:
      return {
        ...state,
        tokenData: payload,
        error: null,
      };
    case actions.GET_SWAP_DATA_SUCCESS:
      return {
        ...state,
        swapData: payload,
        error: null,
      };
    case actions.GET_SWAP_TX_SUCCESS:
      return {
        ...state,
        swapTx: payload,
        error: null,
      };
    case actions.GET_STAKE_DATA_SUCCESS:
      return {
        ...state,
        stakeData: payload,
        error: null,
      };
    case actions.GET_STAKE_TX_SUCCESS:
      return {
        ...state,
        stakeTx: payload,
        error: null,
      };
    default:
      return state;
  }
}
