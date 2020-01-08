const actions = {
  GET_HEALTH_REQUEST: 'GET_HEALTH_REQUEST',
  GET_HEALTH_SUCCESS: 'GET_HEALTH_SUCCESS',
  GET_HEALTH_FAILED: 'GET_HEALTH_FAILED',

  getHealth: payload => ({ type: actions.GET_HEALTH_REQUEST, payload }),
  getHealthSuccess: payload => ({
    type: actions.GET_HEALTH_SUCCESS,
    payload,
  }),
  getHealthFailed: payload => ({
    type: actions.GET_HEALTH_FAILED,
    payload,
  }),

  GET_TRANSACTION_REQUEST: 'GET_TRANSACTION_REQUEST',
  GET_TRANSACTION_SUCCESS: 'GET_TRANSACTION_SUCCESS',
  GET_TRANSACTION_FAILED: 'GET_TRANSACTION_FAILED',

  getTransaction: payload => ({
    type: actions.GET_TRANSACTION_REQUEST,
    payload,
  }),
  getTransactionSuccess: payload => ({
    type: actions.GET_TRANSACTION_SUCCESS,
    payload,
  }),
  getTransactionFailed: payload => ({
    type: actions.GET_TRANSACTION_FAILED,
    payload,
  }),

  GET_STATS_REQUEST: 'GET_STATS_REQUEST',
  GET_STATS_SUCCESS: 'GET_STATS_SUCCESS',
  GET_STATS_FAILED: 'GET_STATS_FAILED',

  getStats: payload => ({ type: actions.GET_STATS_REQUEST, payload }),
  getStatsSuccess: payload => ({
    type: actions.GET_STATS_SUCCESS,
    payload,
  }),
  getStatsFailed: payload => ({
    type: actions.GET_STATS_FAILED,
    payload,
  }),

  GET_ASSET_INFO_REQUEST: 'GET_ASSET_INFO_REQUEST',
  GET_ASSET_INFO_SUCCESS: 'GET_ASSET_INFO_SUCCESS',
  GET_ASSET_INFO_FAILED: 'GET_ASSET_INFO_FAILED',

  getAssetInfo: payload => ({ type: actions.GET_ASSET_INFO_REQUEST, payload }),
  getAssetInfoSuccess: payload => ({
    type: actions.GET_ASSET_INFO_SUCCESS,
    payload,
  }),
  getAssetInfoFailed: payload => ({
    type: actions.GET_ASSET_INFO_FAILED,
    payload,
  }),

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

  GET_STAKERS_REQUEST: 'GET_STAKERS_REQUEST',
  GET_STAKERS_SUCCESS: 'GET_STAKERS_SUCCESS',
  GET_STAKERS_FAILED: 'GET_STAKERS_FAILED',

  getStakers: payload => ({ type: actions.GET_STAKERS_REQUEST, payload }),
  getStakersSuccess: payload => ({
    type: actions.GET_STAKERS_SUCCESS,
    payload,
  }),
  getStakersFailed: payload => ({
    type: actions.GET_STAKERS_FAILED,
    payload,
  }),

  GET_STAKER_DATA_REQUEST: 'GET_STAKER_DATA_REQUEST',
  GET_STAKER_DATA_SUCCESS: 'GET_STAKER_DATA_SUCCESS',
  GET_STAKER_DATA_FAILED: 'GET_STAKER_DATA_FAILED',

  getStakerData: payload => ({
    type: actions.GET_STAKER_DATA_REQUEST,
    payload,
  }),
  getStakerDataSuccess: payload => ({
    type: actions.GET_STAKER_DATA_SUCCESS,
    payload,
  }),
  getStakerDataFailed: payload => ({
    type: actions.GET_STAKER_DATA_FAILED,
    payload,
  }),

  GET_STAKER_POOL_DATA_REQUEST: 'GET_STAKER_POOL_DATA_REQUEST',
  GET_STAKER_POOL_DATA_SUCCESS: 'GET_STAKER_POOL_DATA_SUCCESS',
  GET_STAKER_POOL_DATA_FAILED: 'GET_STAKER_POOL_DATA_FAILED',

  getStakerPoolData: payload => ({
    type: actions.GET_STAKER_POOL_DATA_REQUEST,
    payload,
  }),
  getStakerPoolDataSuccess: payload => ({
    type: actions.GET_STAKER_POOL_DATA_SUCCESS,
    payload,
  }),
  getStakerPoolDataFailed: payload => ({
    type: actions.GET_STAKER_POOL_DATA_FAILED,
    payload,
  }),

  GET_POOL_ADDRESSES_REQUEST: 'GET_POOL_ADDRESSES_REQUEST',
  GET_POOL_ADDRESSES_SUCCESS: 'GET_POOL_ADDRESSES_SUCCESS',
  GET_POOL_ADDRESSES_FAILED: 'GET_POOL_ADDRESSES_FAILED',

  getPoolAddress: payload => ({
    type: actions.GET_POOL_ADDRESSES_REQUEST,
    payload,
  }),
  getPoolAddressSuccess: payload => ({
    type: actions.GET_POOL_ADDRESSES_SUCCESS,
    payload,
  }),
  getPoolAddressFailed: payload => ({
    type: actions.GET_POOL_ADDRESSES_FAILED,
    payload,
  }),

  GET_RUNE_PRICE_REQUEST: 'GET_RUNE_PRICE_REQUEST',

  getRunePrice: () => ({ type: actions.GET_RUNE_PRICE_REQUEST }),

  SET_BASE_PRICE_ASSET: 'SET_BASE_PRICE_ASSET',

  setBasePriceAsset: payload => ({
    type: actions.SET_BASE_PRICE_ASSET,
    payload,
  }),

  SET_PRICE_INDEX: 'SET_PRICE_INDEX',

  setPriceIndex: payload => ({
    type: actions.SET_PRICE_INDEX,
    payload,
  }),
};

export default actions;
