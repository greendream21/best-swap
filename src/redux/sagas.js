import { all } from 'redux-saga/effects';
import walletSaga from './wallet/saga';
import chainserviceSaga from './chainservice/saga';
import statechainSaga from './statechain/saga';

export default function* rootSaga(/* getState */) {
  yield all([walletSaga(), chainserviceSaga(), statechainSaga()]);
}
