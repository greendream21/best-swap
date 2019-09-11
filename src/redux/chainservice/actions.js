const actions = {
  GET_USER_DATA_REQUEST: 'GET_USER_DATA_REQUEST',
  GET_USER_DATA_SUCCESS: 'GET_USER_DATA_SUCCESS',
  GET_USER_DATA_FAILED: 'GET_USER_DATA_FAILED',

  getUserData: payload => ({ type: actions.GET_USER_DATA_REQUEST, payload }),
  getUserDataSuccess: payload => ({
    type: actions.GET_USER_DATA_SUCCESS,
    payload,
  }),
  getUserDataFailed: payload => ({
    type: actions.GET_USER_DATA_FAILED,
    payload,
  }),

  GET_TOKENS_REQUEST: 'GET_TOKENS_REQUEST',
  GET_TOKENS_SUCCESS: 'GET_TOKENS_SUCCESS',
  GET_TOKENS_FAILED: 'GET_TOKENS_FAILED',

  getTokens: payload => ({ type: actions.GET_TOKENS_REQUEST, payload }),
  getTokensSuccess: payload => ({ type: actions.GET_TOKENS_SUCCESS, payload }),
  getTokensFailed: payload => ({ type: actions.GET_TOKENS_FAILED, payload }),

  GET_TOKEN_INFO_REQUEST: 'GET_TOKEN_INFO_REQUEST',
  GET_TOKEN_INFO_SUCCESS: 'GET_TOKEN_INFO_SUCCESS',
  GET_TOKEN_INFO_FAILED: 'GET_TOKEN_INFO_FAILED',

  getTokenInfo: payload => ({ type: actions.GET_TOKEN_INFO_REQUEST, payload }),
  getTokenInfoSuccess: payload => ({
    type: actions.GET_TOKEN_INFO_SUCCESS,
    payload,
  }),
  getTokenInfoFailed: payload => ({
    type: actions.GET_TOKEN_INFO_FAILED,
    payload,
  }),

  GET_TOKENDATA_REQUEST: 'GET_TOKENDATA_REQUEST',
  GET_TOKENDATA_SUCCESS: 'GET_TOKENDATA_SUCCESS',
  GET_TOKENDATA_FAILED: 'GET_TOKENDATA_FAILED',

  getTokenData: payload => ({ type: actions.GET_TOKENDATA_REQUEST, payload }),
  getTokenDataSuccess: payload => ({
    type: actions.GET_TOKENDATA_SUCCESS,
    payload,
  }),
  getTokenDataFailed: payload => ({
    type: actions.GET_TOKENDATA_FAILED,
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

  GET_SWAP_TX_REQUEST: 'GET_SWAP_TX_REQUEST',
  GET_SWAP_TX_SUCCESS: 'GET_SWAP_TX_SUCCESS',
  GET_SWAP_TX_FAILED: 'GET_SWAP_TX_FAILED',

  getSwapTx: payload => ({ type: actions.GET_SWAP_TX_REQUEST, payload }),
  getSwapTxSuccess: payload => ({ type: actions.GET_SWAP_TX_SUCCESS, payload }),
  getSwapTxFailed: payload => ({ type: actions.GET_SWAP_TX_FAILED, payload }),

  GET_STAKE_DATA_REQUEST: 'GET_STAKE_DATA_REQUEST',
  GET_STAKE_DATA_SUCCESS: 'GET_STAKE_DATA_SUCCESS',
  GET_STAKE_DATA_FAILED: 'GET_STAKE_DATA_FAILED',

  getStakeData: payload => ({ type: actions.GET_STAKE_DATA_REQUEST, payload }),
  getStakeDataSuccess: payload => ({
    type: actions.GET_STAKE_DATA_SUCCESS,
    payload,
  }),
  getStakeDataFailed: payload => ({
    type: actions.GET_STAKE_DATA_FAILED,
    payload,
  }),

  GET_STAKE_TX_REQUEST: 'GET_STAKE_TX_REQUEST',
  GET_STAKE_TX_SUCCESS: 'GET_STAKE_TX_SUCCESS',
  GET_STAKE_TX_FAILED: 'GET_STAKE_TX_FAILED',

  getStakeTx: payload => ({ type: actions.GET_STAKE_TX_REQUEST, payload }),
  getStakeTxSuccess: payload => ({
    type: actions.GET_STAKE_TX_SUCCESS,
    payload,
  }),
  getStakeTxFailed: payload => ({ type: actions.GET_STAKE_TX_FAILED, payload }),

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
