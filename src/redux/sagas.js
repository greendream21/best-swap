import { all } from 'redux-saga/effects';
import walletSaga from './wallet/saga';
import chainserviceSaga from './chainservice/saga';
import statechainSaga from './statechain/saga';
import binanceSaga from './binance/saga';

export default function* rootSaga(/* getState */) {
  yield all([
    walletSaga(),
    chainserviceSaga(),
    statechainSaga(),
    binanceSaga(),
  ]);
}
