import { AssetData, User, StakeData } from './types';
import { Address } from '../../types/binance';

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
  payload: AssetData[];
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
  payload: StakeData[];
}
export interface RefreshStakesFailed {
  type: typeof REFRESH_STAKES_FAILED;
  payload: Error;
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

export const SAVE_WALLET = 'SAVE_WALLET';
export const FORGET_WALLET = 'FORGET_WALLET';

export const REFRESH_BALANCE = 'REFRESH_BALANCE';
export const REFRESH_BALANCE_SUCCESS = 'REFRESH_BALANCE_SUCCESS';
export const REFRESH_BALANCE_FAILED = 'REFRESH_BALANCE_FAILED';

export const REFRESH_STAKES = 'REFRESH_STAKES';
export const REFRESH_STAKES_SUCCESS = 'REFRESH_STAKES_SUCCESS';
export const REFRESH_STAKES_FAILED = 'REFRESH_STAKES_FAILED';

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
  payload: AssetData[],
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

export const refreshStakeSuccess = (payload: StakeData[]): RefreshStakesSuccess => ({
  type: REFRESH_STAKES_SUCCESS,
  payload,
});

export const refreshStakeFailed = (payload: Error): RefreshStakesFailed => ({
  type: REFRESH_STAKES_FAILED,
  payload,
});
