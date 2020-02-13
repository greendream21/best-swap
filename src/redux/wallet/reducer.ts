import { Reducer } from 'redux';
import { initial, success, pending, failure } from '@devexperts/remote-data-ts';
import { getWalletAddress, getKeystore } from '../../helpers/webStorageHelper';
import { State, User } from './types';
import {
  SAVE_WALLET,
  WalletActionsTypes,
  FORGET_WALLET,
  REFRESH_BALANCE,
  REFRESH_BALANCE_SUCCESS,
  REFRESH_BALANCE_FAILED,
  REFRESH_STAKES,
  REFRESH_STAKES_SUCCESS,
  REFRESH_STAKES_FAILED,
} from './actions';
import { Nothing } from '../../types/bepswap';

const wallet = getWalletAddress();
const keystore = getKeystore();

const user = wallet ? ({ wallet, keystore } as User) : Nothing;

const initState: State = {
  user,
  assetData: [
    {
      asset: 'RUNE-A1F',
      assetValue: 0,
      price: 0,
    },
  ],
  stakeData: initial,
  loadingAssets: false,
  error: Nothing,
};

const reducer: Reducer<State, WalletActionsTypes> = (
  state = initState,
  action,
) => {
  switch (action.type) {
    case SAVE_WALLET:
      return {
        ...state,
        user: action.payload,
      };
    case FORGET_WALLET:
      return {
        ...state,
        user: null,
      };
    case REFRESH_BALANCE:
      return {
        ...state,
        loadingAssets: true,
        error: null,
      };
    case REFRESH_BALANCE_FAILED:
      return {
        ...state,
        loadingAssets: false,
        error: action.payload,
      };
    case REFRESH_BALANCE_SUCCESS:
      return {
        ...state,
        assetData: action.payload,
        loadingAssets: false,
      };
    case REFRESH_STAKES:
      return {
        ...state,
        stakeData: pending,
        error: null,
      };
    case REFRESH_STAKES_SUCCESS:
      return {
        ...state,
        stakeData: success(action.payload),
      };
    case REFRESH_STAKES_FAILED:
      return {
        ...state,
        stakeData: failure(action.payload),
      };
    default:
      return state;
  }
};

export default reducer;
