import { initial, success, pending, failure } from '@devexperts/remote-data-ts';
import { bn } from '@thorchain/asgardex-util';
import { uniqWith as _uniqWith, isEqual as _isEqual } from 'lodash';
import { Reducer } from 'redux';

import { getBasePriceAsset } from 'helpers/webStorageHelper';

import { Nothing } from 'types/bepswap';
import { StakersAssetData } from 'types/generated/midgard';

import { MidgardActionTypes } from './actions';
import { State, StakerPoolData } from './types';
import {
  getBNBPoolAddress,
  getPoolAddress,
  getPriceIndex,
  getAssetSymbolFromPayload,
} from './utils';

// set base price asset to BUSD as a default
const basePriceAsset = getBasePriceAsset() || 'BUSD';

const initState: State = {
  assets: {},
  assetArray: [],
  pools: [],
  poolAddressData: Nothing,
  bnbPoolAddress: Nothing,
  poolAddress: Nothing,
  poolAddressLoading: false,
  poolData: {},
  poolDetailedData: {},
  poolEarningDetails: {},
  poolLoading: true,
  poolDataLoading: false,
  poolDetailedDataLoading: true,
  poolEarningDetailsLoading: false,
  rtStats: {
    allTimeData: [],
    weekData: [],
  },
  rtStatsLoading: false,
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
  assetLoading: true,
  statsLoading: false,
  txData: initial,
  txRefreshing: false,
  rtAggregateLoading: false,
  rtAggregate: {
    allTimeData: [],
    weekData: [],
  },
  apiBasePath: initial,
  thorchain: {
    constants: {},
    lastBlock: {},
    mimir: {},
    queue: {
      swap: '0',
      outbound: '0',
    },
  },
  networkInfo: {},
  networkInfoLoading: false,
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
        priceIndex: getPriceIndex(state.poolData, payload),
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
    case 'GET_POOL_ASSETS_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        assets: {
          ...state.assets,
          ...payload.assetDetailIndex,
        },
        assetArray: _uniqWith(
          [...state.assetArray, ...payload.assetDetails],
          _isEqual,
        ),
        assetLoading: false,
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
        pools: _uniqWith([...state.pools, ...action.payload], _isEqual),
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
    case 'GET_RT_STATS_CHANEGS':
      return {
        ...state,
        rtStatsLoading: true,
        error: Nothing,
      };
    case 'GET_RT_STATS_CHANEGS_SUCCESS':
      return {
        ...state,
        rtStatsLoading: false,
        rtStats: action.payload,
      };
    case 'GET_RT_STATS_CHANEGS_FAILED':
      return {
        ...state,
        rtStatsLoading: false,
        error: action.payload,
      };
    case 'GET_POOL_EARNING_DETAILS':
      return {
        ...state,
        poolEarningDetailsLoading: true,
      };
    case 'GET_POOL_EARNING_DETAILS_SUCCESS': {
      const { payload } = action;
      const { symbol, poolEarningDetail } = payload;

      return {
        ...state,
        poolEarningDetails: {
          ...state.poolEarningDetails,
          [symbol]: poolEarningDetail,
        },
        poolEarningDetailsLoading: false,
        error: Nothing,
      };
    }
    case 'GET_POOL_EARNING_DETAILS_FAILED':
      return {
        ...state,
        poolEarningDetailsLoading: false,
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
      const { poolData = {} } = payload;

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
    case 'GET_POOL_DETAIL_BY_ASSET':
      return {
        ...state,
        poolDetailedDataLoading: true,
        error: Nothing,
      };
    case 'GET_POOL_DETAIL_BY_ASSET_SUCCESS': {
      const { payload } = action;

      const poolDetail = payload[0];
      const symbol = getAssetSymbolFromPayload(poolDetail);

      if (symbol) {
        const poolDetailedData = {
          ...state.poolDetailedData,
          [symbol]: poolDetail,
        };
        return {
          ...state,
          poolDetailedData,
          poolDetailedDataLoading: false,
        };
      }
      return { ...state, poolDetailedDataLoading: false };
    }
    case 'GET_POOL_DETAIL_BY_ASSET_FAILED':
      return {
        ...state,
        poolDetailedDataLoading: false,
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
        thorchain: {
          ...state.thorchain,
          ...action.payload,
        },
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
        poolAddressLoading: true,
      };
    case 'GET_POOL_ADDRESSES_SUCCESS': {
      const { payload } = action;
      return {
        ...state,
        poolAddressData: payload,
        bnbPoolAddress: getBNBPoolAddress(payload),
        poolAddress: getPoolAddress(payload),
        poolAddressLoading: false,
      };
    }
    case 'GET_POOL_ADDRESSES_FAILED':
      return {
        ...state,
        poolAddressData: Nothing,
        bnbPoolAddress: {},
        poolAddress: Nothing,
        error: action.payload,
        poolAddressLoading: false,
      };
    case 'GET_TX_REQUEST':
      return {
        ...state,
        txData: pending,
        txRefreshing: !!action.payload.refresh,
      };
    case 'GET_TX_SUCCESS':
      return {
        ...state,
        txData: success(action.payload.data),
        txRefreshing: false,
      };
    case 'GET_TX_FAILED':
      return {
        ...state,
        txData: failure(action.payload),
        txRefreshing: false,
      };
    case 'GET_RT_AGGREGATE_BY_ASSET':
      return {
        ...state,
        rtAggregateLoading: true,
      };
    case 'GET_RT_AGGREGATE_BY_ASSET_SUCCESS':
      return {
        ...state,
        rtAggregate: action.payload,
        rtAggregateLoading: false,
      };
    case 'GET_RT_AGGREGATE_BY_ASSET_FAILED':
      return {
        ...state,
        rtAggregateLoading: false,
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
    case 'GET_NETWORK_INFO_REQUEST':
      return {
        ...state,
        networkInfoLoading: true,
        error: Nothing,
      };
    case 'GET_NETWORK_INFO_SUCCESS':
      return {
        ...state,
        networkInfoLoading: false,
        networkInfo: action.payload,
      };
    case 'GET_NETWORK_INFO_FAILED':
      return {
        ...state,
        networkInfoLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
