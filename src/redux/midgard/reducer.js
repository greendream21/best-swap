import actions from './actions';

const initState = {
  transaction: {},
  stats: {},
  assets: {},
  pools: [],
  poolData: {},
  stakers: [],
  stakerData: {},
  stakerPoolData: {},
  error: null,
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.GET_TRANSACTION_SUCCESS:
      return {
        ...state,
        transaction: payload,
        error: null,
      };
    case actions.GET_TRANSACTION_FAILED:
      return {
        ...state,
        transaction: null,
        error: payload,
      };
    case actions.GET_STATS_SUCCESS:
      return {
        ...state,
        stats: payload,
        error: null,
      };
    case actions.GET_STATS_FAILED:
      return {
        ...state,
        stats: null,
        error: payload,
      };
    case actions.GET_ASSETS_SUCCESS:
      return {
        ...state,
        assets: payload,
        error: null,
      };
    case actions.GET_ASSETS_FAILED:
      return {
        ...state,
        assets: null,
        error: payload,
      };
    case actions.GET_POOLS_SUCCESS:
      return {
        ...state,
        pools: payload,
        error: null,
      };
    case actions.GET_POOLS_FAILED:
      return {
        ...state,
        pools: null,
        error: payload,
      };
    case actions.GET_POOL_DATA_SUCCESS:
      return {
        ...state,
        poolData: payload,
        error: null,
      };
    case actions.GET_POOL_DATA_FAILED:
      return {
        ...state,
        poolData: null,
        error: payload,
      };
    case actions.GET_STAKERS_SUCCESS:
      return {
        ...state,
        stakers: payload,
        error: null,
      };
    case actions.GET_STAKERS_FAILED:
      return {
        ...state,
        stakers: null,
        error: payload,
      };
    case actions.GET_STAKER_DATA_SUCCESS:
      return {
        ...state,
        stakerData: payload,
        error: null,
      };
    case actions.GET_STAKER_DATA_FAILED:
      return {
        ...state,
        stakerData: null,
        error: payload,
      };
    case actions.GET_STAKER_POOL_DATA_SUCCESS:
      return {
        ...state,
        stakerPoolData: payload,
        error: null,
      };
    case actions.GET_STAKER_POOL_DATA_FAILED:
      return {
        ...state,
        stakerPoolData: null,
        error: payload,
      };
    default:
      return state;
  }
}
