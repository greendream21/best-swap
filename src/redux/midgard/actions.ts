import { AssetSymbol } from '../../types/bepswap';
import { GetStakerPoolDataPayload, PriceDataIndex, PoolData, AssetDataIndex, GetPoolAddressSuccessData } from './types';
import { AssetData } from '../wallet/types';

export const GET_ASSET_INFO_REQUEST = 'GET_ASSET_INFO_REQUEST';
export interface GetAssetInfo {
  type: typeof GET_ASSET_INFO_REQUEST;
  payload: AssetSymbol;
}
export const getAssetInfo = (payload: AssetSymbol): GetAssetInfo => ({
  type: GET_ASSET_INFO_REQUEST,
  payload,
});

export interface GetAssetInfoSuccessPayload {
  assetDataIndex: AssetDataIndex;
  assetResponse: AssetData[];
}

export const GET_ASSET_INFO_SUCCESS = 'GET_ASSET_INFO_SUCCESS';
export interface GetAssetInfoSuccess {
  type: typeof GET_ASSET_INFO_SUCCESS;
  payload: GetAssetInfoSuccessPayload;
}
export const getAssetInfoSuccess = (
  payload: GetAssetInfoSuccessPayload,
): GetAssetInfoSuccess => ({
  type: GET_ASSET_INFO_SUCCESS,
  payload,
});

export const GET_ASSET_INFO_FAILED = 'GET_ASSET_INFO_FAILED';
export interface GetAssetInfoFailed {
  type: typeof GET_ASSET_INFO_FAILED;
  payload: Error;
}
export const getAssetInfoFailed = (payload: Error): GetAssetInfoFailed => ({
  type: GET_ASSET_INFO_FAILED,
  payload,
});

export const GET_POOLS_REQUEST = 'GET_POOLS_REQUEST';
export interface GetPools {
  type: typeof GET_POOLS_REQUEST;
}
export const getPools = (): GetPools => ({
  type: GET_POOLS_REQUEST,
});

export const GET_POOLS_SUCCESS = 'GET_POOLS_SUCCESS';
export interface GetPoolsSuccess {
  type: typeof GET_POOLS_SUCCESS;
  payload: PoolData[];
}
export const getPoolsSuccess = (payload: PoolData[]): GetPoolsSuccess => ({
  type: GET_POOLS_SUCCESS,
  payload,
});
export const GET_POOLS_FAILED = 'GET_POOLS_FAILED';
export interface GetPoolsFailed {
  type: typeof GET_POOLS_FAILED;
  payload: Error;
}
export const getPoolsFailed = (payload: Error): GetPoolsFailed => ({
  type: GET_POOLS_FAILED,
  payload,
});

export const GET_POOL_DATA_REQUEST = 'GET_POOL_DATA_REQUEST';
export interface GetPoolData {
  type: typeof GET_POOL_DATA_REQUEST;
  payload: string;
}
export const getPoolData = (payload: string): GetPoolData => ({
  type: GET_POOL_DATA_REQUEST,
  payload,
});

export const GET_POOL_DATA_SUCCESS = 'GET_POOL_DATA_SUCCESS';
export interface GetPoolDataSuccess {
  type: typeof GET_POOL_DATA_SUCCESS;
  payload: PoolData;
}
export const getPoolDataSuccess = (payload: PoolData): GetPoolDataSuccess => ({
  type: GET_POOL_DATA_SUCCESS,
  payload,
});

export const GET_POOL_DATA_FAILED = 'GET_POOL_DATA_FAILED';
export interface GetPoolDataFailed {
  type: typeof GET_POOL_DATA_FAILED;
  payload: Error;
}
export const getPoolDataFailed = (payload: Error): GetPoolDataFailed => ({
  type: GET_POOL_DATA_FAILED,
  payload,
});

export const GET_STAKER_POOL_DATA_REQUEST = 'GET_STAKER_POOL_DATA_REQUEST';
export interface GetStakerPoolData {
  type: typeof GET_STAKER_POOL_DATA_REQUEST;
  payload: GetStakerPoolDataPayload;
}
export const getStakerPoolData = (payload: GetStakerPoolDataPayload): GetStakerPoolData => ({
  type: GET_STAKER_POOL_DATA_REQUEST,
  payload,
});

export const GET_STAKER_POOL_DATA_SUCCESS = 'GET_STAKER_POOL_DATA_SUCCESS';
export interface GetStakerPoolDataSuccess {
  type: typeof GET_STAKER_POOL_DATA_SUCCESS;
  payload: PoolData;
}
export const getStakerPoolDataSuccess = (
  payload: PoolData,
): GetStakerPoolDataSuccess => ({
  type: GET_STAKER_POOL_DATA_SUCCESS,
  payload,
});

export const GET_STAKER_POOL_DATA_FAILED = 'GET_STAKER_POOL_DATA_FAILED';
export interface GetStakerPoolDataFailed {
  type: typeof GET_STAKER_POOL_DATA_FAILED;
  payload: Error;
}
export const getStakerPoolDataFailed = (
  payload: Error,
): GetStakerPoolDataFailed => ({
  type: GET_STAKER_POOL_DATA_FAILED,
  payload,
});

export const GET_POOL_ADDRESSES_REQUEST = 'GET_POOL_ADDRESSES_REQUEST';
export interface GetPoolAddress {
  type: typeof GET_POOL_ADDRESSES_REQUEST;
}
export const getPoolAddress = (): GetPoolAddress => ({
  type: GET_POOL_ADDRESSES_REQUEST,
});

export const GET_POOL_ADDRESSES_SUCCESS = 'GET_POOL_ADDRESSES_SUCCESS';
export interface GetPoolAddressSuccess {
  type: typeof GET_POOL_ADDRESSES_SUCCESS;
  payload: GetPoolAddressSuccessData;
}
export const getPoolAddressSuccess = (
  payload: GetPoolAddressSuccessData,
): GetPoolAddressSuccess => ({
  type: GET_POOL_ADDRESSES_SUCCESS,
  payload,
});

export const GET_POOL_ADDRESSES_FAILED = 'GET_POOL_ADDRESSES_FAILED';
export interface GetPoolAddressFailed {
  type: typeof GET_POOL_ADDRESSES_FAILED;
  payload: Error;
}
export const getPoolAddressFailed = (
  payload: Error,
): GetPoolAddressFailed => ({
  type: GET_POOL_ADDRESSES_FAILED,
  payload,
});

export const GET_RUNE_PRICE_REQUEST = 'GET_RUNE_PRICE_REQUEST';
export interface GetRunePrice {
  type: typeof GET_RUNE_PRICE_REQUEST;
}
export const getRunePrice = (): GetRunePrice => ({
  type: GET_RUNE_PRICE_REQUEST,
});
export const SET_BASE_PRICE_ASSET = 'SET_BASE_PRICE_ASSET';
export interface SetBasePriceAsset {
  type: typeof SET_BASE_PRICE_ASSET;
  payload: AssetSymbol;
}
export const setBasePriceAsset = (payload: AssetSymbol): SetBasePriceAsset => ({
  type: SET_BASE_PRICE_ASSET,
  payload,
});

export const SET_PRICE_INDEX = 'SET_PRICE_INDEX';
export interface SetPriceIndex {
  type: typeof SET_PRICE_INDEX;
  payload: PriceDataIndex;
}
export const setPriceIndex = (payload: PriceDataIndex): SetPriceIndex => ({
  type: SET_PRICE_INDEX,
  payload,
});

export type MidgardActionTypes =
  | GetAssetInfo
  | GetAssetInfoSuccess
  | GetAssetInfoFailed
  | GetPools
  | GetPoolsSuccess
  | GetPoolsFailed
  | GetPoolData
  | GetPoolDataSuccess
  | GetPoolDataFailed
  | GetStakerPoolData
  | GetStakerPoolDataSuccess
  | GetStakerPoolDataFailed
  | GetPoolAddress
  | GetPoolAddressSuccess
  | GetPoolAddressFailed
  | GetRunePrice
  | SetBasePriceAsset
  | SetPriceIndex;
