import actions from './actions';
import {
  getWalletAddress,
  getKeystore,
  getBasePriceAsset,
} from '../../helpers/webStorageHelper';

const wallet = getWalletAddress();
const keystore = getKeystore();
const basePriceAsset = getBasePriceAsset() || 'RUNE';

const user = wallet ? { wallet, keystore } : {};

const initState = {
  user,
  basePriceAsset, // set base price asset as a RUNE
  runePrice: null,
  assetData: [
    {
      asset: 'RUNE-A1F',
      assetValue: 43255,
      price: 0,
    },
  ],
  stakeData: [],
  loadingAssets: false,
  loadingStakes: false,
  error: null,
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.SET_BASE_PRICE_ASSET:
      return {
        ...state,
        basePriceAsset: payload,
      };
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
        stakeData: [],
        loadingStakes: true,
      };
    case actions.REFRESH_STAKES_SUCCESS:
      return {
        ...state,
        loadingStakes: false,
      };
    case actions.REFRESH_STAKES_FAILED:
      return {
        ...state,
        loadingStakes: false,
        error: payload,
      };
    case actions.GET_USER_STAKE_DATA_SUCCESS:
      return {
        ...state,
        stakeData: [...state.stakeData, payload],
        error: null,
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
