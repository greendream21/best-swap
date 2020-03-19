import { Reducer } from 'redux';
import { initial, success, pending, failure } from '@devexperts/remote-data-ts';

import {
  getBNBPoolAddress,
  getPoolAddress,
  getPriceIndex,
  getAssetSymbolFromPayload,
} from './utils';
import { getBasePriceAsset } from '../../helpers/webStorageHelper';
import { State, PoolDataMap, StakerPoolData } from './types';
import {
  SET_BASE_PRICE_ASSET,
  SET_PRICE_INDEX,
  GET_RUNE_PRICE_REQUEST,
  SET_ASSETS,
  GET_POOLS_REQUEST,
  GET_POOLS_SUCCESS,
  GET_POOLS_FAILED,
  GET_POOL_DATA_SUCCESS,
  GET_POOL_DATA_FAILED,
  GET_POOL_DATA_REQUEST,
  MidgardActionTypes,
  GET_STAKER_POOL_DATA_SUCCESS,
  GET_STAKER_POOL_DATA_REQUEST,
  GET_STAKER_POOL_DATA_FAILED,
  GET_POOL_ADDRESSES_SUCCESS,
  GET_POOL_ADDRESSES_REQUEST,
  GET_POOL_ADDRESSES_FAILED,
  GET_TX_BY_ADDRESS,
  GET_TX_BY_ADDRESS_SUCCESS,
  GET_TX_BY_ADDRESS_FAILED,
  GET_TX_BY_ADDRESS_TXID,
  GET_TX_BY_ADDRESS_TXID_SUCCESS,
  GET_TX_BY_ADDRESS_TXID_FAILED,
  GET_TX_BY_ADDRESS_ASSET,
  GET_TX_BY_ADDRESS_ASSET_SUCCESS,
  GET_TX_BY_ADDRESS_ASSET_FAILED,
  GET_TX_BY_ASSET,
  GET_TX_BY_ASSET_SUCCESS,
  GET_TX_BY_ASSET_FAILED,
} from './actions';
import { Nothing } from '../../types/bepswap';
import { PoolDetail, StakersAssetData } from '../../types/generated/midgard';

const basePriceAsset = getBasePriceAsset() || 'RUNE';

const initState: State = {
  assets: {},
  assetArray: [],
  pools: [],
  poolAddressData: Nothing,
  bnbPoolAddress: Nothing,
  poolAddress: Nothing,
  poolData: {},
  stakerPoolData: {},
  runePrice: 0,
  basePriceAsset, // set base price asset as a RUNE
  priceIndex: {
    RUNE: 1,
  },
  error: null,
  poolLoading: false,
  stakerPoolDataLoading: false,
  txData: initial,
};

const reducer: Reducer<State, MidgardActionTypes> = (
  state = initState,
  action,
) => {
  switch (action.type) {
    case SET_BASE_PRICE_ASSET: {
      const { payload } = action;
      return {
        ...state,
        basePriceAsset: payload,
        priceIndex: getPriceIndex(state.assetArray, payload),
      };
    }
    case SET_PRICE_INDEX:
      return {
        ...state,
        priceIndex: action.payload,
      };
    case GET_RUNE_PRICE_REQUEST:
      return {
        ...state,
        runePrice: 0,
        error: Nothing,
      };
    case SET_ASSETS: {
      const { payload } = action;
      return {
        ...state,
        assets: payload.assetDetailIndex,
        assetArray: payload.assetDetails,
      };
    }
    case GET_POOLS_REQUEST:
      return {
        ...state,
        poolLoading: true,
        error: Nothing,
      };
    case GET_POOLS_SUCCESS:
      return {
        ...state,
        poolLoading: false,
        pools: action.payload,
      };
    case GET_POOLS_FAILED:
      return {
        ...state,
        poolLoading: false,
        error: action.payload,
      };
    case GET_POOL_DATA_REQUEST:
      return {
        ...state,
        poolLoading: true,
        error: Nothing,
      };
    case GET_POOL_DATA_SUCCESS: {
      const { payload } = action;
      const { poolDetails = [], overrideAllPoolData = true } = payload;
      // Transform `PoolDetail[]` into `PoolDataMap` before storing data into state
      const newPoolData = poolDetails.reduce(
        (acc: PoolDataMap, poolDetail: PoolDetail) => {
          const symbol = getAssetSymbolFromPayload(poolDetail);
          return symbol
            ? {
                ...acc,
                [symbol]: poolDetail,
              }
            : acc;
        },
        {} as PoolDataMap,
      );
      // Check whether to override all state.poolData or just with latest result
      const poolData = overrideAllPoolData
        ? newPoolData
        : {
            ...state.poolData,
            newPoolData,
          };
      return {
        ...state,
        poolData,
        poolLoading: false,
      };
    }
    case GET_POOL_DATA_FAILED:
      return {
        ...state,
        poolLoading: false,
        error: action.payload,
      };
    case GET_STAKER_POOL_DATA_REQUEST:
      return {
        ...state,
        stakerPoolDataLoading: true,
        error: Nothing,
      };
    case GET_STAKER_POOL_DATA_SUCCESS: {
      const { payload } = action;
      // Transform `StakersAssetData[]` into `StakerPoolData`
      // before storing data into state
      const newStakerPoolData = payload.reduce(
        (acc: StakerPoolData, data: StakersAssetData) => {
          const symbol = getAssetSymbolFromPayload(data);
          return symbol ? { ...acc, [symbol]: data } : acc;
        },
        {} as StakerPoolData,
      );

      return {
        ...state,
        stakerPoolData: { ...state.stakerPoolData, ...newStakerPoolData },
        stakerPoolDataLoading: false,
      };
    }
    case GET_STAKER_POOL_DATA_FAILED:
      return {
        ...state,
        stakerPoolData: {},
        stakerPoolDataLoading: false,
        error: action.payload,
      };
    case GET_POOL_ADDRESSES_REQUEST:
      return {
        ...state,
        error: Nothing,
      };
    case GET_POOL_ADDRESSES_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        poolAddressData: payload,
        bnbPoolAddress: getBNBPoolAddress(payload),
        poolAddress: getPoolAddress(payload),
      };
    }
    case GET_POOL_ADDRESSES_FAILED:
      return {
        ...state,
        poolAddressData: Nothing,
        bnbPoolAddress: {},
        poolAddress: Nothing,
        error: action.payload,
      };
    case GET_TX_BY_ADDRESS:
      return {
        ...state,
        txData: pending,
      };
    case GET_TX_BY_ADDRESS_SUCCESS:
      return {
        ...state,
        txData: success(action.payload),
      };
    case GET_TX_BY_ADDRESS_FAILED:
      return {
        ...state,
        txData: failure(action.payload),
      };
    case GET_TX_BY_ADDRESS_ASSET:
      return {
        ...state,
        txData: pending,
      };
    case GET_TX_BY_ADDRESS_ASSET_SUCCESS:
      return {
        ...state,
        txData: success(action.payload),
      };
    case GET_TX_BY_ADDRESS_ASSET_FAILED:
      return {
        ...state,
        txData: failure(action.payload),
      };

    case GET_TX_BY_ADDRESS_TXID:
      return {
        ...state,
        txData: pending,
      };
    case GET_TX_BY_ADDRESS_TXID_SUCCESS:
      return {
        ...state,
        txData: success(action.payload),
      };
    case GET_TX_BY_ADDRESS_TXID_FAILED:
      return {
        ...state,
        txData: failure(action.payload),
      };
    case GET_TX_BY_ASSET:
      return {
        ...state,
        txData: pending,
      };
    case GET_TX_BY_ASSET_SUCCESS:
      return {
        ...state,
        txData: success(action.payload),
      };
    case GET_TX_BY_ASSET_FAILED:
      return {
        ...state,
        txData: failure(action.payload),
      };
    default:
      return state;
  }
};
export default reducer;
