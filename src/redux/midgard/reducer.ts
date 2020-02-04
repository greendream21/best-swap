import {
  getAssetSymbolFromPayload,
  getBNBPoolAddress,
  getPoolAddress,
  getPriceIndex,
} from './utils';
import { getBasePriceAsset } from '../../helpers/webStorageHelper';
import { State } from './types';
import {
  SET_BASE_PRICE_ASSET,
  SET_PRICE_INDEX,
  GET_RUNE_PRICE_REQUEST,
  GET_ASSET_INFO_SUCCESS,
  GET_ASSET_INFO_FAILED,
  GET_POOLS_REQUEST,
  GET_POOLS_SUCCESS,
  GET_POOLS_FAILED,
  GET_POOL_DATA_SUCCESS,
  GET_POOL_DATA_FAILED,
  GET_POOL_DATA_REQUEST,
  GET_ASSET_INFO_REQUEST,
  MidgardActionTypes,
  GET_STAKER_POOL_DATA_SUCCESS,
  GET_STAKER_POOL_DATA_REQUEST,
  GET_STAKER_POOL_DATA_FAILED,
  GET_POOL_ADDRESSES_SUCCESS,
  GET_POOL_ADDRESSES_REQUEST,
  GET_POOL_ADDRESSES_FAILED,
} from './actions';
import { Nothing } from '../../types/bepswap';

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
};

export default function apiReducer(
  state: State = initState,
  action: MidgardActionTypes,
) {
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
    case GET_ASSET_INFO_REQUEST:
      return {
        ...state,
        error: Nothing,
      };
    case GET_ASSET_INFO_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        assets: payload.assetDataIndex,
        assetArray: payload.assetResponse,
      };
    }
    case GET_ASSET_INFO_FAILED:
      return {
        ...state,
        assets: {},
        assetArray: [],
        error: action.payload,
      };
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
      const symbol = getAssetSymbolFromPayload(payload);
      if (symbol) {
        return {
          ...state,
          poolData: {
            ...state.poolData,
            [symbol]: payload,
          },
          poolLoading: false,
        };
      }
      return {
        ...state,
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
      const symbol = getAssetSymbolFromPayload(payload);
      if (symbol) {
        return {
          ...state,
          stakerPoolData: {
            ...state.stakerPoolData,
            [symbol]: payload,
          },
          stakerPoolDataLoading: false,
        };
      }
      return {
        ...state,
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
    default:
      return state;
  }
}
