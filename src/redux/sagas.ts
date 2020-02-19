import { all } from 'redux-saga/effects';
import walletSaga from './wallet/saga';
import binanceSaga from './binance/saga';
import midgardSaga from './midgard/saga';

export default function* rootSaga(/* getState */) {
  yield all([walletSaga(), binanceSaga(), midgardSaga()]);
}
