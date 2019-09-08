import { all } from 'redux-saga/effects';
import walletSaga from './wallet/saga';
import chainserviceSaga from './chainservice/saga';

export default function* rootSaga(getState) {
  yield all([walletSaga(), chainserviceSaga()]);
}
