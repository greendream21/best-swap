import actions from './actions';
import { getWalletAddress, getKeystore } from '../../helpers/webStorageHelper';

const wallet = getWalletAddress();
const keystore = getKeystore();

const user = wallet ? { wallet, keystore } : null;

const initState = {
  user,
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.SAVE_WALLET:
      return {
        ...state,
        user: payload,
      };
    default:
      return state;
  }
}
