import { Maybe } from '../../types/bepswap';
import { TxTypes, TxStatus, TxResult } from './types';

export const setTxResult = (payload: Maybe<TxResult>) =>
  ({ type: 'SET_TX_RESULT', payload } as const);

export const setTxTimerType = (payload: TxTypes) =>
  ({ type: 'SET_TX_TIMER_TYPE', payload } as const);

export const setTxTimerModal = (payload: boolean) =>
  ({ type: 'SET_TX_TIMER_MODAL', payload } as const);

export const setTxTimerStatus = (payload: boolean) =>
  ({ type: 'SET_TX_TIMER_STATUS', payload } as const);

export const setTxTimerValue = (payload: number) =>
  ({ type: 'SET_TX_TIMER_VALUE', payload } as const);

export const countTxTimerValue = (payload: number) =>
  ({ type: 'COUNT_TX_TIMER_VALUE', payload } as const);

export const setTxTimerStartTime = (payload: number) =>
  ({ type: 'SET_TX_TIMER_START_TIME', payload } as const);

export const setTxHash = (payload: string) =>
  ({ type: 'SET_TX_HASH', payload } as const);

export const resetTxStatus = (payload?: Partial<TxStatus>) =>
  ({ type: 'RESET_TX_STATUS', payload } as const);

export const setTheme = (payload: string) =>
  ({ type: 'SET_THEME', payload } as const);

export type AppActionsTypes = ReturnType<
  | typeof setTxResult
  | typeof setTxTimerType
  | typeof setTxTimerModal
  | typeof setTxTimerStatus
  | typeof setTxTimerValue
  | typeof countTxTimerValue
  | typeof setTxTimerStartTime
  | typeof setTxHash
  | typeof resetTxStatus
  | typeof setTheme
>;
