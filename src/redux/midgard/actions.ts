import { AssetSymbol } from 'types/bepswap';
import {
  PoolDetail,
  StatsData,
  StakersAssetData,
  ThorchainEndpoints,
  NetworkInfo,
} from 'types/generated/midgard';

import {
  GetStakerPoolDataPayload,
  PriceDataIndex,
  GetAssetsPayload,
  GetPoolDataPayload,
  RTAggregateData,
  GetRTStatsPayload,
  RTStatsData,
  GetRTAggregateByAssetPayload,
  GetPoolDetailByAssetPayload,
  GetPoolEarningDetailsPayload,
  ThorchainData,
  PoolStatus,
  PoolDataMap,
  GetTxPayload,
  TxSuccessPayload,
} from './types';

export const getPools = (payload?: PoolStatus) =>
  ({ type: 'GET_POOLS_REQUEST', payload } as const);

export const getPoolsSuccess = (payload: string[]) =>
  ({ type: 'GET_POOLS_SUCCESS', payload } as const);

export const getPoolsFailed = (payload: Error) =>
  ({ type: 'GET_POOLS_FAILED', payload } as const);

export const getPoolAssets = (payload: string[]) =>
  ({ type: 'GET_POOL_ASSETS_REQUEST', payload } as const);

export const getPoolAssetsSuccess = (payload: GetAssetsPayload) =>
  ({ type: 'GET_POOL_ASSETS_SUCCESS', payload } as const);

export const getPoolAssetsFailed = (payload: Error) =>
  ({ type: 'GET_POOL_ASSETS_FAILED', payload } as const);

export const getPoolData = (payload: GetPoolDataPayload) =>
  ({ type: 'GET_POOL_DATA_REQUEST', payload } as const);

type GetPoolDataSuccessPayload = {
  poolData: PoolDataMap;
};

export const getPoolDataSuccess = (payload: GetPoolDataSuccessPayload) =>
  ({ type: 'GET_POOL_DATA_SUCCESS', payload } as const);

export const getPoolDataFailed = (payload: Error) =>
  ({ type: 'GET_POOL_DATA_FAILED', payload } as const);

export const getPoolDetailByAsset = (payload: GetPoolDetailByAssetPayload) =>
  ({ type: 'GET_POOL_DETAIL_BY_ASSET', payload } as const);

export const getPoolDetailByAssetSuccess = (payload: PoolDetail[]) =>
  ({ type: 'GET_POOL_DETAIL_BY_ASSET_SUCCESS', payload } as const);

export const getPoolDetailByAssetFailed = (payload: Error) =>
  ({ type: 'GET_POOL_DETAIL_BY_ASSET_FAILED', payload } as const);

export const getStakerPoolData = (payload: GetStakerPoolDataPayload) =>
  ({ type: 'GET_STAKER_POOL_DATA_REQUEST', payload } as const);

export const getStakerPoolDataSuccess = (payload: StakersAssetData[]) =>
  ({ type: 'GET_STAKER_POOL_DATA_SUCCESS', payload } as const);

export const getStakerPoolDataFailed = (payload: Error) =>
  ({ type: 'GET_STAKER_POOL_DATA_FAILED', payload } as const);

export const getThorchainDataSuccess = (payload: ThorchainData) =>
  ({ type: 'GET_THORCHAIN_DATA_SUCCESS', payload } as const);

export const getPoolAddress = () =>
  ({ type: 'GET_POOL_ADDRESSES_REQUEST' } as const);

export const getPoolAddressSuccess = (payload: ThorchainEndpoints) =>
  ({ type: 'GET_POOL_ADDRESSES_SUCCESS', payload } as const);

export const getPoolAddressFailed = (payload: Error) =>
  ({ type: 'GET_POOL_ADDRESSES_FAILED', payload } as const);

export const getRunePrice = () => ({ type: 'GET_RUNE_PRICE_REQUEST' } as const);

export const setBasePriceAsset = (payload: AssetSymbol) =>
  ({ type: 'SET_BASE_PRICE_ASSET', payload } as const);

export const setPriceIndex = (payload: PriceDataIndex) =>
  ({ type: 'SET_PRICE_INDEX', payload } as const);

// get tx by address, txId, asset, type, offset, limit
export const getTx = (payload: GetTxPayload) =>
  ({ type: 'GET_TX_REQUEST', payload } as const);

export const getTxSuccess = (payload: TxSuccessPayload) =>
  ({ type: 'GET_TX_SUCCESS', payload } as const);

export const getTxFailed = (payload: Error) =>
  ({ type: 'GET_TX_FAILED', payload } as const);

export const getApiBasePathPending = () =>
  ({ type: 'GET_API_BASEPATH_PENDING' } as const);

export const getApiBasePathFailed = (payload: Error) =>
  ({ type: 'GET_API_BASEPATH_FAILED', payload } as const);

export const getApiBasePathSuccess = (payload: string) =>
  ({ type: 'GET_API_BASEPATH_SUCCESS', payload } as const);

export const getStats = () => ({ type: 'GET_STATS_REQUEST' } as const);

export const getStatsSuccess = (payload: StatsData) =>
  ({ type: 'GET_STATS_SUCCESS', payload } as const);

export const getStatsFailed = (payload: Error) =>
  ({ type: 'GET_STATS_FAILED', payload } as const);

export const getPoolEarningDetails = (payload: string) =>
  ({ type: 'GET_POOL_EARNING_DETAILS', payload } as const);

export const getPoolEarningDetailsSuccess = (
  payload: GetPoolEarningDetailsPayload,
) => ({ type: 'GET_POOL_EARNING_DETAILS_SUCCESS', payload } as const);

export const getPoolEarningDetailsFailed = (payload: Error) =>
  ({ type: 'GET_POOL_EARNING_DETAILS_FAILED', payload } as const);

export const getRTStats = (payload: GetRTStatsPayload) =>
  ({ type: 'GET_RT_STATS_CHANEGS', payload } as const);

export const getRTStatsSuccess = (payload: RTStatsData) =>
  ({ type: 'GET_RT_STATS_CHANEGS_SUCCESS', payload } as const);

export const getRTStatsFailed = (payload: Error) =>
  ({ type: 'GET_RT_STATS_CHANEGS_FAILED', payload } as const);

export const getRTAggregateByAsset = (payload: GetRTAggregateByAssetPayload) =>
  ({ type: 'GET_RT_AGGREGATE_BY_ASSET', payload } as const);

export const getRTAggregateByAssetSuccess = (payload: RTAggregateData) =>
  ({ type: 'GET_RT_AGGREGATE_BY_ASSET_SUCCESS', payload } as const);

export const getRTAggregateByAssetFailed = (payload: Error) =>
  ({ type: 'GET_RT_AGGREGATE_BY_ASSET_FAILED', payload } as const);

export const getNetworkInfo = () =>
  ({ type: 'GET_NETWORK_INFO_REQUEST' } as const);

export const getNetworkInfoSuccess = (payload: NetworkInfo) =>
  ({ type: 'GET_NETWORK_INFO_SUCCESS', payload } as const);

export const getNetworkInfoFailed = (payload: Error) =>
  ({ type: 'GET_NETWORK_INFO_FAILED', payload } as const);

export type MidgardActionTypes = ReturnType<
  | typeof getPools
  | typeof getPoolsSuccess
  | typeof getPoolsFailed
  | typeof getPoolAssets
  | typeof getPoolAssetsSuccess
  | typeof getPoolAssetsFailed
  | typeof getPoolData
  | typeof getPoolDataSuccess
  | typeof getPoolDataFailed
  | typeof getStakerPoolData
  | typeof getStakerPoolDataSuccess
  | typeof getStakerPoolDataFailed
  | typeof getPoolAddress
  | typeof getPoolAddressSuccess
  | typeof getPoolAddressFailed
  | typeof getRunePrice
  | typeof setBasePriceAsset
  | typeof setPriceIndex
  | typeof getTx
  | typeof getTxSuccess
  | typeof getTxFailed
  | typeof getApiBasePathPending
  | typeof getApiBasePathFailed
  | typeof getApiBasePathSuccess
  | typeof getThorchainDataSuccess
  | typeof getStats
  | typeof getStatsSuccess
  | typeof getStatsFailed
  | typeof getRTStats
  | typeof getRTStatsSuccess
  | typeof getRTStatsFailed
  | typeof getPoolEarningDetails
  | typeof getPoolEarningDetailsSuccess
  | typeof getPoolEarningDetailsFailed
  | typeof getRTAggregateByAsset
  | typeof getRTAggregateByAssetSuccess
  | typeof getRTAggregateByAssetFailed
  | typeof getPoolDetailByAsset
  | typeof getPoolDetailByAssetSuccess
  | typeof getPoolDetailByAssetFailed
  | typeof getNetworkInfo
  | typeof getNetworkInfoSuccess
  | typeof getNetworkInfoFailed
>;
