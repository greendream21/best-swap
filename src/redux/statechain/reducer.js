import actions from './actions';

const initState = {
  poolData: {},
  pools: [],
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
