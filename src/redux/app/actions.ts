import { TxTypes, TxStatus } from './types';

export interface SetTxTimerType {
  type: typeof SET_TX_TIMER_TYPE;
  payload: TxTypes;
}

export interface SetTxTimerModal {
  type: typeof SET_TX_TIMER_MODAL;
  payload: boolean;
}

export interface SetTxTimerValue {
  type: typeof SET_TX_TIMER_VALUE;
  payload: number;
}

export interface SetTxTimerStatus {
  type: typeof SET_TX_TIMER_STATUS;
  payload: boolean;
}

export interface CountTxTimerValue {
  type: typeof COUNT_TX_TIMER_VALUE;
  payload: number;
}

export interface SetTxTimerStartTime {
  type: typeof SET_TX_TIMER_START_TIME;
  payload: number;
}

export interface SetTxHash {
  type: typeof SET_TX_HASH;
  payload: string;
}

export interface ResetTxStatus {
  type: typeof RESET_TX_STATUS;
  payload?: Partial<TxStatus>;
}

export interface SetTheme {
  type: typeof SET_THEME;
  payload: string;
}

export type AppActionsTypes =
  | SetTxTimerType
  | SetTxTimerModal
  | SetTxTimerStatus
  | SetTxTimerValue
  | CountTxTimerValue
  | SetTxTimerStartTime
  | SetTxHash
  | ResetTxStatus
  | SetTheme;

export const SET_TX_TIMER_TYPE = 'SET_TX_TIMER_TYPE';
export const SET_TX_TIMER_MODAL = 'SET_TX_TIMER_MODAL';
export const SET_TX_TIMER_STATUS = 'SET_TX_TIMER_STATUS';
export const SET_TX_TIMER_VALUE = 'SET_TX_TIMER_VALUE';
export const COUNT_TX_TIMER_VALUE = 'COUNT_TX_TIMER_VALUE';
export const SET_TX_TIMER_START_TIME = 'SET_TX_TIMER_START_TIME';
export const SET_TX_HASH = 'SET_TX_HASH';
export const RESET_TX_STATUS = 'RESET_TX_STATUS';

export const SET_THEME = 'SET_THEME';

export const setTxTimerType = (payload: TxTypes): SetTxTimerType => ({
  type: SET_TX_TIMER_TYPE,
  payload,
});

export const setTxTimerModal = (payload: boolean): SetTxTimerModal => ({
  type: SET_TX_TIMER_MODAL,
  payload,
});

export const setTxTimerStatus = (payload: boolean): SetTxTimerStatus => ({
  type: SET_TX_TIMER_STATUS,
  payload,
});

export const setTxTimerValue = (payload: number): SetTxTimerValue => ({
  type: SET_TX_TIMER_VALUE,
  payload,
});

export const countTxTimerValue = (payload: number): CountTxTimerValue => ({
  type: COUNT_TX_TIMER_VALUE,
  payload,
});

export const setTxTimerStartTime = (payload: number): SetTxTimerStartTime => ({
  type: SET_TX_TIMER_START_TIME,
  payload,
});

export const setTxHash = (payload: string): SetTxHash => ({
  type: SET_TX_HASH,
  payload,
});

export const resetTxStatus = (payload?: Partial<TxStatus>): ResetTxStatus => ({
  type: RESET_TX_STATUS,
  payload,
});

export const setTheme = (payload: string): SetTheme => ({
  type: SET_THEME,
  payload,
});
