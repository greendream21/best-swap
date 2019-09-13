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

  GET_POOL_INFO_REQUEST: 'GET_POOL_INFO_REQUEST',
  GET_POOL_INFO_SUCCESS: 'GET_POOL_INFO_SUCCESS',
  GET_POOL_INFO_FAILED: 'GET_POOL_INFO_FAILED',

  getPoolInfo: payload => ({ type: actions.GET_POOL_INFO_REQUEST, payload }),
  getPoolInfoSuccess: payload => ({
    type: actions.GET_POOL_INFO_SUCCESS,
    payload,
  }),
  getPoolInfoFailed: payload => ({
    type: actions.GET_POOL_INFO_FAILED,
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

  GET_SWAP_DATA_REQUEST: 'GET_SWAP_DATA_REQUEST',
  GET_SWAP_DATA_SUCCESS: 'GET_SWAP_DATA_SUCCESS',
  GET_SWAP_DATA_FAILED: 'GET_SWAP_DATA_FAILED',

  getSwapData: payload => ({ type: actions.GET_SWAP_DATA_REQUEST, payload }),
  getSwapDataSuccess: payload => ({
    type: actions.GET_SWAP_DATA_SUCCESS,
    payload,
  }),
  getSwapDataFailed: payload => ({
    type: actions.GET_SWAP_DATA_FAILED,
    payload,
  }),
};

export default actions;
