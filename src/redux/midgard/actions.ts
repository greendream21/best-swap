import { AssetSymbol } from '../../types/bepswap';
import {
  GetStakerPoolDataPayload,
  PriceDataIndex,
  AssetDetailMap,
  GetTxByAddressTxIdPayload,
  GetTxByAddressAssetPayload,
  GetTxByAddressPayload,
  GetTxByAssetPayload,
} from './types';
import {
  AssetDetail,
  PoolDetail,
  StakersAssetData,
  ThorchainEndpoints,
  InlineResponse200,
} from '../../types/generated/midgard';

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
};

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
};
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
  payload: StakersAssetData[];
}
export const getStakerPoolDataSuccess = (
  payload: StakersAssetData[],
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

// get transactions by address
export const GET_TX_BY_ADDRESS = 'GET_TX_BY_ADDRESS';
export interface GetTxByAddress {
  type: typeof GET_TX_BY_ADDRESS;
  payload: GetTxByAddressPayload;
}
export const getTxByAddress = (
  payload: GetTxByAddressPayload,
): GetTxByAddress => ({
  type: GET_TX_BY_ADDRESS,
  payload,
});

export const GET_TX_BY_ADDRESS_SUCCESS = 'GET_TX_BY_ADDRESS_SUCCESS';
export interface GetTxByAddressSuccess {
  type: typeof GET_TX_BY_ADDRESS_SUCCESS;
  payload: InlineResponse200;
}
export const getTxByAddressSuccess = (
  payload: InlineResponse200,
): GetTxByAddressSuccess => ({
  type: GET_TX_BY_ADDRESS_SUCCESS,
  payload,
});

export const GET_TX_BY_ADDRESS_FAILED = 'GET_TX_BY_ADDRESS_FAILED';
export interface GetTxByAddressFailed {
  type: typeof GET_TX_BY_ADDRESS_FAILED;
  payload: Error;
}
export const getTxByAddressFailed = (payload: Error): GetTxByAddressFailed => ({
  type: GET_TX_BY_ADDRESS_FAILED,
  payload,
});

// get transactions by address and txId
export const GET_TX_BY_ADDRESS_TXID = 'GET_TX_BY_ADDRESS_TXID';
export interface GetTxByAddressTxId {
  type: typeof GET_TX_BY_ADDRESS_TXID;
  payload: GetTxByAddressTxIdPayload;
}
export const getTxByAddressTxId = (
  payload: GetTxByAddressTxIdPayload,
): GetTxByAddressTxId => ({
  type: GET_TX_BY_ADDRESS_TXID,
  payload,
});

export const GET_TX_BY_ADDRESS_TXID_SUCCESS = 'GET_TX_BY_ADDRESS_TXID_SUCCESS';
export interface GetTxByAddressTxIdSuccess {
  type: typeof GET_TX_BY_ADDRESS_TXID_SUCCESS;
  payload: InlineResponse200;
}
export const getTxByAddressTxIdSuccess = (
  payload: InlineResponse200,
): GetTxByAddressTxIdSuccess => ({
  type: GET_TX_BY_ADDRESS_TXID_SUCCESS,
  payload,
});

export const GET_TX_BY_ADDRESS_TXID_FAILED = 'GET_TX_BY_ADDRESS_TXID_FAILED';
export interface GetTxByAddressTxIdFailed {
  type: typeof GET_TX_BY_ADDRESS_TXID_FAILED;
  payload: Error;
}
export const getTxByAddressTxIdFailed = (
  payload: Error,
): GetTxByAddressTxIdFailed => ({
  type: GET_TX_BY_ADDRESS_TXID_FAILED,
  payload,
});

// get transactions by address and asset
export const GET_TX_BY_ADDRESS_ASSET = 'GET_TX_BY_ADDRESS_ASSET';
export interface GetTxByAddressAsset {
  type: typeof GET_TX_BY_ADDRESS_ASSET;
  payload: GetTxByAddressAssetPayload;
}
export const getTxByAddressAsset = (
  payload: GetTxByAddressAssetPayload,
): GetTxByAddressAsset => ({
  type: GET_TX_BY_ADDRESS_ASSET,
  payload,
});

export const GET_TX_BY_ADDRESS_ASSET_SUCCESS =
  'GET_TX_BY_ADDRESS_ASSET_SUCCESS';
export interface GetTxByAddressAssetSuccess {
  type: typeof GET_TX_BY_ADDRESS_ASSET_SUCCESS;
  payload: InlineResponse200;
}
export const getTxByAddressAssetSuccess = (
  payload: InlineResponse200,
): GetTxByAddressAssetSuccess => ({
  type: GET_TX_BY_ADDRESS_ASSET_SUCCESS,
  payload,
});

export const GET_TX_BY_ADDRESS_ASSET_FAILED = 'GET_TX_BY_ADDRESS_ASSET_FAILED';
export interface GetTxByAddressAssetFailed {
  type: typeof GET_TX_BY_ADDRESS_ASSET_FAILED;
  payload: Error;
}
export const getTxByAddressAssetFailed = (
  payload: Error,
): GetTxByAddressAssetFailed => ({
  type: GET_TX_BY_ADDRESS_ASSET_FAILED,
  payload,
});

// get transactions by asset
export const GET_TX_BY_ASSET = 'GET_TX_BY_ASSET';
export interface GetTxByAsset {
  type: typeof GET_TX_BY_ASSET;
  payload: GetTxByAssetPayload;
}
export const getTxByAsset = (payload: GetTxByAssetPayload): GetTxByAsset => ({
  type: GET_TX_BY_ASSET,
  payload,
});

export const GET_TX_BY_ASSET_SUCCESS = 'GET_TX_BY_ASSET_SUCCESS';
export interface GetTxByAssetSuccess {
  type: typeof GET_TX_BY_ASSET_SUCCESS;
  payload: InlineResponse200;
}
export const getTxByAssetSuccess = (
  payload: InlineResponse200,
): GetTxByAssetSuccess => ({
  type: GET_TX_BY_ASSET_SUCCESS,
  payload,
});

export const GET_TX_BY_ASSET_FAILED = 'GET_TX_BY_ASSET_FAILED';
export interface GetTxByAssetFailed {
  type: typeof GET_TX_BY_ASSET_FAILED;
  payload: Error;
}
export const getTxByAssetFailed = (payload: Error): GetTxByAssetFailed => ({
  type: GET_TX_BY_ASSET_FAILED,
  payload,
});

export const GET_API_BASEPATH_PENDING = 'GET_API_BASEPATH_PENDING';
export interface GetApiBasePathPending {
  type: typeof GET_API_BASEPATH_PENDING;
}
export const getApiBasePathPending = (): GetApiBasePathPending => ({
  type: GET_API_BASEPATH_PENDING,
});

export const GET_API_BASEPATH_FAILED = 'GET_API_BASEPATH_FAILED';
export interface GetApiBasePathFailed {
  type: typeof GET_API_BASEPATH_FAILED;
  payload: Error;
}
export const getApiBasePathFailed = (payload: Error): GetApiBasePathFailed => ({
  type: GET_API_BASEPATH_FAILED,
  payload,
});

export const GET_API_BASEPATH_SUCCESS = 'GET_API_BASEPATH_SUCCESS';
export interface GetApiBasePathSuccess {
  type: typeof GET_API_BASEPATH_SUCCESS;
  payload: string;
}
export const getApiBasePathSuccess = (
  payload: string,
): GetApiBasePathSuccess => ({
  type: GET_API_BASEPATH_SUCCESS,
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
  | SetPriceIndex
  | GetTxByAddress
  | GetTxByAddressSuccess
  | GetTxByAddressFailed
  | GetTxByAddressTxId
  | GetTxByAddressTxIdSuccess
  | GetTxByAddressTxIdFailed
  | GetTxByAddressAsset
  | GetTxByAddressAssetSuccess
  | GetTxByAddressAssetFailed
  | GetTxByAsset
  | GetTxByAssetSuccess
  | GetTxByAssetFailed
  | GetApiBasePathPending
  | GetApiBasePathFailed
  | GetApiBasePathSuccess;
