import { all, takeEvery, put, fork } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import actions from './actions';
import {
  saveWalletAddress,
  saveKeystore,
  clearWalletAddress,
  clearKeystore,
} from '../../helpers/webStorageHelper';

export function* saveWalletSaga() {
  yield takeEvery(actions.SAVE_WALLET, function*({ payload }) {
    const { wallet, keystore } = payload;

    saveWalletAddress(wallet);
    saveKeystore(keystore);

    yield put(push('/swap'));
  });
}

export function* forgetWalletSaga() {
  yield takeEvery(actions.FORGET_WALLET, function*({ payload }) {
    clearWalletAddress();
    clearKeystore();

    yield put(push('/connect'));
  });
}

export default function* rootSaga() {
  yield all([fork(saveWalletSaga), fork(forgetWalletSaga)]);
}
