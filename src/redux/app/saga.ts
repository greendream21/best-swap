import { all, takeEvery, put, fork } from 'redux-saga/effects';

import * as binanceActions from '../binance/actions';
import * as midgardActions from '../midgard/actions';
import * as walletActions from '../wallet/actions';

// initial data used for bepswap
export function* getBEPSwapData() {
  yield takeEvery('GET_BEPSWAP_DATA', function*() {
    yield put(midgardActions.getPools());
    yield put(midgardActions.getPoolAddress());
    yield put(midgardActions.getStats());
    yield put(walletActions.refreshWallet());
    yield put(binanceActions.getBinanceData());
  });
}

export default function* rootSaga() {
  yield all([fork(getBEPSwapData)]);
}
