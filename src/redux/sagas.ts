import { all } from 'redux-saga/effects';

import appSaga from './app/saga';
import binanceSaga from './binance/saga';
import midgardSaga from './midgard/saga';
import walletSaga from './wallet/saga';

export default function* rootSaga(/* getState */) {
  yield all([appSaga(), walletSaga(), binanceSaga(), midgardSaga()]);
}
