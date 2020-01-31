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
  GET_USER_STAKE_DATA_SUCCESS,
  SET_ASSET_DATA,
  SET_STAKE_DATA,
  GET_USER_STAKE_DATA_REQUEST,
  GET_USER_STAKE_DATA_FAILED,
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
  stakeData: [],
  loadingAssets: false,
  loadingStakes: false,
  error: Nothing,
};

export default function apiReducer(
  state = initState,
  action: WalletActionsTypes,
) {
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
        stakeData: [],
        loadingStakes: true,
        error: null,
      };
    case REFRESH_STAKES_SUCCESS:
      return {
        ...state,
        loadingStakes: false,
      };
    case REFRESH_STAKES_FAILED:
      return {
        ...state,
        loadingStakes: false,
        error: action.payload,
      };
    case GET_USER_STAKE_DATA_REQUEST:
      return {
        ...state,
        loadingStakes: true,
        error: null,
      };
    case GET_USER_STAKE_DATA_SUCCESS:
      return {
        ...state,
        stakeData: [...state.stakeData, action.payload],
        error: null,
      };
    case GET_USER_STAKE_DATA_FAILED:
      return {
        ...state,
        loadingStakes: false,
        error: action.payload,
      };
    case SET_ASSET_DATA:
      return {
        ...state,
        assetData: action.payload,
      };
    case SET_STAKE_DATA:
      return {
        ...state,
        stakeData: action.payload,
      };
    default:
      return state;
  }
}
