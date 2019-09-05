import { all } from 'redux-saga/effects';
import walletSaga from './wallet/saga';

export default function* rootSaga(getState) {
  yield all([walletSaga()]);
}
