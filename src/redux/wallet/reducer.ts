import { Reducer } from 'redux';
import { initial, success, pending, failure } from '@devexperts/remote-data-ts';
import { tokenAmount } from '@thorchain/asgardex-token';
import { getWallet } from '../../helpers/webStorageHelper';
import { State, User } from './types';
import { WalletActionsTypes } from './actions';
import { Nothing, Maybe } from '../../types/bepswap';

import { RUNE_SYMBOL } from '../../settings/assetData';

const initialUser: Maybe<User> = getWallet();

const initState: State = {
  user: initialUser,
  assetData: [
    {
      asset: RUNE_SYMBOL,
      assetValue: tokenAmount(0),
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
    case 'SAVE_WALLET':
      return {
        ...state,
        user: action.payload,
      };
    case 'FORGET_WALLET':
      return {
        ...state,
        user: null,
      };
    case 'REFRESH_BALANCE':
      return {
        ...state,
        loadingAssets: true,
        error: null,
      };
    case 'REFRESH_BALANCE_FAILED':
      return {
        ...state,
        loadingAssets: false,
        error: action.payload,
      };
    case 'REFRESH_BALANCE_SUCCESS':
      return {
        ...state,
        assetData: action.payload,
        loadingAssets: false,
      };
    case 'REFRESH_STAKES':
      return {
        ...state,
        stakeData: pending,
        error: null,
      };
    case 'REFRESH_STAKES_SUCCESS':
      return {
        ...state,
        stakeData: success(action.payload),
      };
    case 'REFRESH_STAKES_FAILED':
      return {
        ...state,
        stakeData: failure(action.payload),
      };
    default:
      return state;
  }
};

export default reducer;
