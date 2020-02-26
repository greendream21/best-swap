import { AssetSymbol } from '../../types/bepswap';
import {
  GetStakerPoolDataPayload,
  PriceDataIndex,
  AssetDetailMap,
} from './types';
import { AssetDetail, PoolDetail, StakersAssetData, ThorchainEndpoints } from '../../types/generated/midgard';

export interface SetAssetsPayload {
  assetDetailIndex: AssetDetailMap;
  assetDetails: AssetDetail[];
}
export const SET_ASSETS = 'SET_ASSETS';
export interface SetAssets {
  type: typeof SET_ASSETS;
  payload: SetAssetsPayload;
}
export const setAssets = (payload: SetAssetsPayload): SetAssets => ({
  type: SET_ASSETS,
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
  payload: string[];
}
export const getPoolsSuccess = (payload: string[]): GetPoolsSuccess => ({
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

type GetPoolDataPayload = {
  assets: string[];
  overrideAllPoolData: boolean;
}

export const GET_POOL_DATA_REQUEST = 'GET_POOL_DATA_REQUEST';
export interface GetPoolData {
  type: typeof GET_POOL_DATA_REQUEST;
  payload: GetPoolDataPayload;
}
export const getPoolData = (payload: GetPoolDataPayload): GetPoolData => ({
  type: GET_POOL_DATA_REQUEST,
  payload,
});

type GetPoolDataSuccessPayload = {
  poolDetails: PoolDetail[];
  overrideAllPoolData: boolean;
}
export const GET_POOL_DATA_SUCCESS = 'GET_POOL_DATA_SUCCESS';
export interface GetPoolDataSuccess {
  type: typeof GET_POOL_DATA_SUCCESS;
  payload: GetPoolDataSuccessPayload;
}
export const getPoolDataSuccess = (
  payload: GetPoolDataSuccessPayload,
): GetPoolDataSuccess => ({
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
export const getStakerPoolData = (
  payload: GetStakerPoolDataPayload,
): GetStakerPoolData => ({
  type: GET_STAKER_POOL_DATA_REQUEST,
  payload,
});

export const GET_STAKER_POOL_DATA_SUCCESS = 'GET_STAKER_POOL_DATA_SUCCESS';
export interface GetStakerPoolDataSuccess {
  type: typeof GET_STAKER_POOL_DATA_SUCCESS;
  payload: StakersAssetData;
}
export const getStakerPoolDataSuccess = (
  payload: StakersAssetData,
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
  payload: ThorchainEndpoints;
}
export const getPoolAddressSuccess = (
  payload: ThorchainEndpoints,
): GetPoolAddressSuccess => ({
  type: GET_POOL_ADDRESSES_SUCCESS,
  payload,
});

export const GET_POOL_ADDRESSES_FAILED = 'GET_POOL_ADDRESSES_FAILED';
export interface GetPoolAddressFailed {
  type: typeof GET_POOL_ADDRESSES_FAILED;
  payload: Error;
}
export const getPoolAddressFailed = (payload: Error): GetPoolAddressFailed => ({
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
  | SetAssets
  | SetBasePriceAsset
  | SetPriceIndex;
