import actions from './actions';

const initState = {
  pools: [],
  poolInfo: {},
  poolData: {},
  swapData: {},
  error: null,
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.GET_POOLS_SUCCESS:
      return {
        ...state,
        pools: payload,
        error: null,
      };
    case actions.GET_POOL_INFO_SUCCESS:
      return {
        ...state,
        poolInfo: payload,
        error: null,
      };
    case actions.GET_POOL_DATA_SUCCESS:
      return {
        ...state,
        poolData: {
          ...state.poolData,
          [payload.asset]: payload.data,
        },
        error: null,
      };
    case actions.GET_SWAP_DATA_SUCCESS:
      return {
        ...state,
        swapData: {
          ...state.swapData,
          [payload.asset]: payload.data,
        },
        error: null,
      };
    default:
      return state;
  }
}
