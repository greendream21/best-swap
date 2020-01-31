import { User, AssetData, StakeData, GetUserStakeDataResult } from './types';
import { FixmeType } from '../../types/bepswap';

export interface SaveWallet {
  type: typeof SAVE_WALLET;
  payload: User;
}

export interface ForgetWallet {
  type: typeof FORGET_WALLET;
}

export interface RefreshBalance {
  type: typeof REFRESH_BALANCE;
  payload: Address;
}

export interface RefreshBalanceSuccess {
  type: typeof REFRESH_BALANCE_SUCCESS;
  payload: AssetData;
}
export interface RefreshBalanceFailed {
  type: typeof REFRESH_BALANCE_FAILED;
  payload: Error;
}
export interface RefreshStakes {
  type: typeof REFRESH_STAKES;
  payload: Address;
}
export interface RefreshStakesSuccess {
  type: typeof REFRESH_STAKES_SUCCESS;
  payload: FixmeType;
}
export interface RefreshStakesFailed {
  type: typeof REFRESH_STAKES_FAILED;
  payload: Error;
}

export interface GetUserStakeDataRequestPayload {
  address: Address;
  asset: FixmeType;
}
export interface GetUserStakeDataRequest {
  type: typeof GET_USER_STAKE_DATA_REQUEST;
  payload: GetUserStakeDataRequestPayload;
}
export interface GetUserStakeDataSuccess {
  type: typeof GET_USER_STAKE_DATA_SUCCESS;
  payload: GetUserStakeDataResult;
}
export interface GetUserStakeDataFailed {
  type: typeof GET_USER_STAKE_DATA_FAILED;
  payload: Error;
}
export interface SetAssetData {
  type: typeof SET_ASSET_DATA;
  payload: AssetData;
}
export interface SetStakeData {
  type: typeof SET_STAKE_DATA;
  payload: StakeData[];
}

export type WalletActionsTypes =
  | SaveWallet
  | ForgetWallet
  | RefreshBalance
  | RefreshBalanceSuccess
  | RefreshBalanceFailed
  | RefreshStakes
  | RefreshStakesSuccess
  | RefreshStakesFailed
  | GetUserStakeDataRequest
  | GetUserStakeDataSuccess
  | GetUserStakeDataFailed
  | SetAssetData
  | SetStakeData;

export const SAVE_WALLET = 'SAVE_WALLET';
export const FORGET_WALLET = 'FORGET_WALLET';

export const REFRESH_BALANCE = 'REFRESH_BALANCE';
export const REFRESH_BALANCE_SUCCESS = 'REFRESH_BALANCE_SUCCESS';
export const REFRESH_BALANCE_FAILED = 'REFRESH_BALANCE_FAILED';

export const REFRESH_STAKES = 'REFRESH_STAKES';
export const REFRESH_STAKES_SUCCESS = 'REFRESH_STAKES_SUCCESS';
export const REFRESH_STAKES_FAILED = 'REFRESH_STAKES_FAILED';

export const SET_ASSET_DATA = 'SET_ASSET_DATA';
export const SET_STAKE_DATA = 'SET_STAKE_DATA';

export const GET_USER_STAKE_DATA_REQUEST = 'GET_USER_STAKE_DATA_REQUEST';
export const GET_USER_STAKE_DATA_SUCCESS = 'GET_USER_STAKE_DATA_SUCCESS';
export const GET_USER_STAKE_DATA_FAILED = 'GET_USER_STAKE_DATA_FAILED';

export const saveWallet = (payload: User): SaveWallet => ({
  type: SAVE_WALLET,
  payload,
});

export const forgetWallet = (): ForgetWallet => ({
  type: FORGET_WALLET,
});

export const refreshBalance = (payload: Address): RefreshBalance => ({
  type: REFRESH_BALANCE,
  payload,
});

export const refreshBalanceSuccess = (
  payload: AssetData,
): RefreshBalanceSuccess => ({
  type: REFRESH_BALANCE_SUCCESS,
  payload,
});

export const refreshBalanceFailed = (payload: Error): RefreshBalanceFailed => ({
  type: REFRESH_BALANCE_FAILED,
  payload,
});

export const refreshStake = (payload: Address): RefreshStakes => ({
  type: REFRESH_STAKES,
  payload,
});

export const refreshStakeSuccess = (
  payload: FixmeType,
): RefreshStakesSuccess => ({
  type: REFRESH_STAKES_SUCCESS,
  payload,
});

export const refreshStakeFailed = (payload: Error): RefreshStakesFailed => ({
  type: REFRESH_STAKES_FAILED,
  payload,
});

export const getUserStakeData = (
  payload: GetUserStakeDataRequestPayload,
): GetUserStakeDataRequest => ({
  type: GET_USER_STAKE_DATA_REQUEST,
  payload,
});

export const getUserStakeDataSuccess = (
  payload: GetUserStakeDataResult,
): GetUserStakeDataSuccess => ({
  type: GET_USER_STAKE_DATA_SUCCESS,
  payload,
});

export const getUserStakeDataFailed = (
  payload: Error,
): GetUserStakeDataFailed => ({
  type: GET_USER_STAKE_DATA_FAILED,
  payload,
});

export const setAssetData = (payload: AssetData): SetAssetData => ({
  type: SET_ASSET_DATA,
  payload,
});
export const setStakeData = (payload: StakeData[]): SetStakeData => ({
  type: SET_STAKE_DATA,
  payload,
});
