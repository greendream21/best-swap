import actions from './actions';

const initState = {
  userData: {},
  tokens: [],
  tokenInfo: {},
  tokenData: {},
  swapData: {},
  swapTx: {},
  stakeData: {},
  stakeTx: {},
  poolData: {},
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
    case actions.GET_TOKEN_INFO_SUCCESS:
      return {
        ...state,
        tokenInfo: {
          ...state.tokenInfo,
          ...payload,
        },
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
        stakeData: {
          ...state.stakeData,
          [payload.asset]: payload.data,
        },
        error: null,
      };
    case actions.GET_STAKE_TX_SUCCESS:
      return {
        ...state,
        stakeTx: payload,
        error: null,
      };
    case actions.GET_POOL_DATA_SUCCESS:
      return {
        ...state,
        poolData: payload,
        error: null,
      };
    default:
      return state;
  }
}
