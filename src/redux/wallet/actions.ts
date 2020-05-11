import { Address } from '@thorchain/asgardex-binance';
import { AssetData, User, StakeData } from './types';

export const saveWallet = (payload: User) =>
  ({ type: 'SAVE_WALLET', payload } as const);

export const forgetWallet = () => ({ type: 'FORGET_WALLET' } as const);

export const refreshBalance = (payload: Address) =>
  ({ type: 'REFRESH_BALANCE', payload } as const);

export const refreshBalanceSuccess = (payload: AssetData[]) =>
  ({ type: 'REFRESH_BALANCE_SUCCESS', payload } as const);

export const refreshBalanceFailed = (payload: Error) =>
  ({ type: 'REFRESH_BALANCE_FAILED', payload } as const);

export const refreshStakes = (payload: Address) =>
  ({ type: 'REFRESH_STAKES', payload } as const);

export const refreshStakesSuccess = (payload: StakeData[]) =>
  ({ type: 'REFRESH_STAKES_SUCCESS', payload } as const);

export const refreshStakesFailed = (payload: Error) =>
  ({ type: 'REFRESH_STAKES_FAILED', payload } as const);

export type WalletActionsTypes = ReturnType<
  | typeof saveWallet
  | typeof forgetWallet
  | typeof refreshBalance
  | typeof refreshBalanceSuccess
  | typeof refreshBalanceFailed
  | typeof refreshStakes
  | typeof refreshStakesSuccess
  | typeof refreshStakesFailed
>;
