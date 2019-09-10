import actions from './actions';
import { getWalletAddress, getKeystore } from '../../helpers/webStorageHelper';

const wallet = getWalletAddress();
const keystore = getKeystore();

const user = wallet ? { wallet, keystore } : {};

const initState = {
  user,
  assetData: [],
  stakeData: [],
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
