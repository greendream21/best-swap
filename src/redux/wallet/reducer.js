import actions from './actions';
import { getWalletAddress, getKeystore } from '../../helpers/webStorageHelper';

const wallet = getWalletAddress();
const keystore = getKeystore();

const user = wallet ? { wallet, keystore } : {};

const initState = {
  user,
  assetData: [],
  stakeData: [],
  loadingAssets: false,
  loadingStakes: false,
  error: null,
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.SAVE_WALLET:
      return {
        ...state,
        user: payload,
      };
    case actions.FORGET_WALLET:
      return {
        ...state,
        user: {},
      };
    case actions.REFRESH_BALANCE:
      return {
        ...state,
        loadingAssets: true,
      };
    case actions.REFRESH_BALANCE_SUCCESS:
      return {
        ...state,
        assetData: payload,
        loadingAssets: false,
      };
    case actions.REFRESH_BALANCE_FAILED:
      return {
        ...state,
        loadingAssets: false,
        error: payload,
      };

    case actions.REFRESH_STAKES:
      return {
        ...state,
        loadingStakes: true,
      };
    case actions.REFRESH_STAKES_SUCCESS:
      return {
        ...state,
        stakeData: payload,
        loadingStakes: false,
      };
    case actions.REFRESH_STAKES_FAILED:
      return {
        ...state,
        loadingStakes: false,
        error: payload,
      };
    case actions.SET_ASSET_DATA:
      return {
        ...state,
        assetData: payload,
      };
    case actions.SET_STAKE_DATA:
      return {
        ...state,
        stakeData: payload,
      };
    default:
      return state;
  }
}
