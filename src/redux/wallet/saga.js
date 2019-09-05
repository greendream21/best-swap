import { all, takeEvery, put, fork } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import actions from './actions';
import {
  saveWalletAddress,
  getWalletAddress,
  saveKeystore,
  getKeystore,
} from '../../helpers/webStorageHelper';

export function* checkUser() {
  yield takeEvery(actions.CHECK_USER, function*() {
    const wallet = getWalletAddress();
    const keystore = getKeystore();

    if (wallet) {
      const user = { wallet, keystore };

      yield put(actions.saveWallet(user));
      yield put(push('/swap'));
    } else {
      yield put(push('/connect'));
    }
  });
}

export function* saveWalletSaga() {
  yield takeEvery(actions.SAVE_WALLET, function*({ payload }) {
    const { wallet, keystore } = payload;

    saveWalletAddress(wallet);
    saveKeystore(keystore);

    yield put(push('/swap'));
  });
}

export default function* rootSaga() {
  yield all([fork(checkUser), fork(saveWalletSaga)]);
}
