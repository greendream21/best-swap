const actions = {
  GET_POOLS_REQUEST: 'GET_POOLS_REQUEST',
  GET_POOLS_SUCCESS: 'GET_POOLS_SUCCESS',
  GET_POOLS_FAILED: 'GET_POOLS_FAILED',

  getPools: payload => ({ type: actions.GET_POOLS_REQUEST, payload }),
  getPoolsSuccess: payload => ({
    type: actions.GET_POOLS_SUCCESS,
    payload,
  }),
  getPoolsFailed: payload => ({
    type: actions.GET_POOLS_FAILED,
    payload,
  }),

  GET_POOL_DATA_REQUEST: 'GET_POOL_DATA_REQUEST',
  GET_POOL_DATA_SUCCESS: 'GET_POOL_DATA_SUCCESS',
  GET_POOL_DATA_FAILED: 'GET_POOL_DATA_FAILED',

  getPoolData: payload => ({ type: actions.GET_POOL_DATA_REQUEST, payload }),
  getPoolDataSuccess: payload => ({
    type: actions.GET_POOL_DATA_SUCCESS,
    payload,
  }),
  getPoolDataFailed: payload => ({
    type: actions.GET_POOL_DATA_FAILED,
    payload,
  }),
};

export default actions;
