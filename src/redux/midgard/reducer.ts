import { Reducer } from 'redux';
import { initial, success, pending, failure } from '@devexperts/remote-data-ts';

import { bn } from '@thorchain/asgardex-util';
import {
  getBNBPoolAddress,
  getPoolAddress,
  getPriceIndex,
  getAssetSymbolFromPayload,
} from './utils';
import { getBasePriceAsset } from '../../helpers/webStorageHelper';
import { State, PoolDataMap, StakerPoolData } from './types';
import { MidgardActionTypes } from './actions';
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
  stats: {
    dailyActiveUsers: '0',
    dailyTx: '0',
    monthlyActiveUsers: '0',
    monthlyTx: '0',
    poolCount: '0',
    totalAssetBuys: '0',
    totalAssetSells: '0',
    totalDepth: '0',
    totalEarned: '0',
    totalStakeTx: '0',
    totalStaked: '0',
    totalTx: '0',
    totalUsers: '0',
    totalVolume: '0',
    totalVolume24hr: '0',
    totalWithdrawTx: '0',
  },
  stakerPoolData: Nothing,
  stakerPoolDataLoading: false,
  stakerPoolDataError: Nothing,
  runePrice: 0,
  basePriceAsset, // set base price asset as a RUNE
  priceIndex: {
    RUNE: bn(1),
  },
  error: null,
  poolLoading: false,
  poolDataLoading: false,
  statsLoading: false,
  txData: initial,
  txCurData: {},
  apiBasePath: initial,
  thorchain: {
    constants: {},
    lastBlock: {},
  },
};

const reducer: Reducer<State, MidgardActionTypes> = (
  state = initState,
  action,
) => {
  switch (action.type) {
    case 'SET_BASE_PRICE_ASSET': {
      const { payload } = action;
      return {
        ...state,
        basePriceAsset: payload,
        priceIndex: getPriceIndex(state.assetArray, payload),
      };
    }
    case 'SET_PRICE_INDEX':
      return {
        ...state,
        priceIndex: action.payload,
      };
    case 'GET_RUNE_PRICE_REQUEST':
      return {
        ...state,
        runePrice: 0,
        error: Nothing,
      };
    case 'SET_ASSETS': {
      const { payload } = action;
      return {
        ...state,
        assets: payload.assetDetailIndex,
        assetArray: payload.assetDetails,
      };
    }
    case 'GET_POOLS_REQUEST':
      return {
        ...state,
        poolLoading: true,
        error: Nothing,
      };
    case 'GET_POOLS_SUCCESS':
      return {
        ...state,
        poolLoading: false,
        pools: action.payload,
      };
    case 'GET_POOLS_FAILED':
      return {
        ...state,
        poolLoading: false,
        error: action.payload,
      };
    case 'GET_STATS_REQUEST':
      return {
        ...state,
        statsLoading: true,
        error: Nothing,
      };
    case 'GET_STATS_SUCCESS':
      return {
        ...state,
        statsLoading: false,
        stats: action.payload,
      };
    case 'GET_STATS_FAILED':
      return {
        ...state,
        statsLoading: false,
        error: action.payload,
      };
    case 'GET_POOL_DATA_REQUEST':
      return {
        ...state,
        poolDataLoading: true,
        error: Nothing,
      };
    case 'GET_POOL_DATA_SUCCESS': {
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
        poolDataLoading: false,
      };
    }
    case 'GET_POOL_DATA_FAILED':
      return {
        ...state,
        poolDataLoading: false,
        error: action.payload,
      };
    case 'GET_STAKER_POOL_DATA_REQUEST':
      return {
        ...state,
        stakerPoolDataLoading: true,
        stakerPoolDataError: Nothing,
      };
    case 'GET_STAKER_POOL_DATA_SUCCESS': {
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
        stakerPoolData: state.stakerPoolData
          ? { ...state.stakerPoolData, ...newStakerPoolData }
          : newStakerPoolData,
        stakerPoolDataLoading: false,
      };
    }
    case 'GET_THORCHAIN_DATA_SUCCESS': {
      return {
        ...state,
        thorchain: action.payload,
      };
    }
    case 'GET_STAKER_POOL_DATA_FAILED':
      return {
        ...state,
        stakerPoolData: Nothing,
        stakerPoolDataLoading: false,
        stakerPoolDataError: action.payload,
      };
    case 'GET_POOL_ADDRESSES_REQUEST':
      return {
        ...state,
        error: Nothing,
      };
    case 'GET_POOL_ADDRESSES_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        poolAddressData: payload,
        bnbPoolAddress: getBNBPoolAddress(payload),
        poolAddress: getPoolAddress(payload),
      };
    }
    case 'GET_POOL_ADDRESSES_FAILED':
      return {
        ...state,
        poolAddressData: Nothing,
        bnbPoolAddress: {},
        poolAddress: Nothing,
        error: action.payload,
      };
    case 'GET_TX_BY_ADDRESS':
      return {
        ...state,
        txData: pending,
      };
    case 'GET_TX_BY_ADDRESS_SUCCESS':
      return {
        ...state,
        txData: success(action.payload),
        txCurData: action.payload,
      };
    case 'GET_TX_BY_ADDRESS_FAILED':
      return {
        ...state,
        txData: failure(action.payload),
      };
    case 'GET_TX_BY_ADDRESS_ASSET':
      return {
        ...state,
        txData: pending,
      };
    case 'GET_TX_BY_ADDRESS_ASSET_SUCCESS':
      return {
        ...state,
        txData: success(action.payload),
      };
    case 'GET_TX_BY_ADDRESS_ASSET_FAILED':
      return {
        ...state,
        txData: failure(action.payload),
      };

    case 'GET_TX_BY_ADDRESS_TXID':
      return {
        ...state,
        txData: pending,
      };
    case 'GET_TX_BY_ADDRESS_TXID_SUCCESS':
      return {
        ...state,
        txData: success(action.payload),
      };
    case 'GET_TX_BY_ADDRESS_TXID_FAILED':
      return {
        ...state,
        txData: failure(action.payload),
      };
    case 'GET_TX_BY_ASSET':
      return {
        ...state,
        txData: pending,
      };
    case 'GET_TX_BY_ASSET_SUCCESS':
      return {
        ...state,
        txData: success(action.payload),
      };
    case 'GET_TX_BY_ASSET_FAILED':
      return {
        ...state,
        txData: failure(action.payload),
      };
    case 'GET_API_BASEPATH_PENDING':
      return {
        ...state,
        apiBasePath: pending,
      };
    case 'GET_API_BASEPATH_FAILED':
      return {
        ...state,
        apiBasePath: failure(action.payload),
      };
    case 'GET_API_BASEPATH_SUCCESS':
      return {
        ...state,
        apiBasePath: success(action.payload),
      };
    default:
      return state;
  }
};
export default reducer;
