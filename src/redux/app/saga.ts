import { all, takeEvery, put, fork, select, take } from 'redux-saga/effects';

import { BUSD_SYMBOL } from 'settings/assetData';
import { TX_PAGE_LIMIT, TX_PUBLIC_PAGE_LIMIT } from 'settings/constants';

import * as binanceActions from '../binance/actions';
import * as midgardActions from '../midgard/actions';
import { RootState } from '../store';
import * as walletActions from '../wallet/actions';
import * as actions from './actions';

// initial data used for bepswap
export function* getBEPSwapData() {
  yield takeEvery('GET_BEPSWAP_DATA', function*() {
    yield put(midgardActions.getPools());
    yield put(midgardActions.getPoolAddress());
    yield put(midgardActions.getStats());
    yield put(midgardActions.getNetworkInfo());
    yield put(walletActions.refreshWallet());
    yield put(binanceActions.getBinanceData());

    yield take('GET_POOL_ADDRESSES_SUCCESS');

    yield put(midgardActions.setBasePriceAsset(BUSD_SYMBOL));
  });
}

// refresh data needed for pool view homepage
export function* getPoolViewData() {
  yield takeEvery('GET_POOL_VIEW_DATA', function*({
    payload,
  }: ReturnType<typeof actions.getPoolViewData>) {
    yield put(midgardActions.getPools());
    yield put(midgardActions.getPoolAddress());
    yield put(midgardActions.getStats());
    yield put(midgardActions.getNetworkInfo());
    yield put(walletActions.refreshWallet());
    yield put(
      midgardActions.getTx({
        asset: payload,
        offset: 0,
        limit: TX_PUBLIC_PAGE_LIMIT,
        refresh: true,
      }),
    );

    // get volume chart data for AT and Last week
    yield put(midgardActions.getRTStats({}));
  });
}

// refresh data needed for pool detail page
export function* getPoolDetailViewData() {
  yield takeEvery('GET_POOL_DETAIL_VIEW_DATA', function*({
    payload,
  }: ReturnType<typeof actions.getPoolViewData>) {
    yield put(midgardActions.getPools());
    yield put(midgardActions.getPoolAddress());
    yield put(midgardActions.getNetworkInfo());
    yield put(walletActions.refreshWallet());
    yield put(
      midgardActions.getTx({
        asset: payload,
        offset: 0,
        limit: TX_PUBLIC_PAGE_LIMIT,
        refresh: true,
      }),
    );

    if (payload) {
      yield put(
        midgardActions.getRTAggregateByAsset({
          asset: payload,
        }),
      );
    }
  });
}

// refresh data needed for swap page
export function* refreshSwapData() {
  yield takeEvery('REFRESH_SWAP_DATA', function*() {
    yield put(midgardActions.getPools());
    yield put(midgardActions.getPoolAddress());
    yield put(midgardActions.getNetworkInfo());
    yield put(walletActions.refreshWallet());
    yield put(midgardActions.getNetworkInfo());
  });
}

// refresh data needed for stake page
export function* refreshStakeData() {
  yield takeEvery('REFRESH_STAKE_DATA', function*({
    payload,
  }: ReturnType<typeof actions.refreshStakeData>) {
    const symbol = payload;

    yield put(midgardActions.getPools());
    yield put(midgardActions.getPoolAddress());
    yield put(midgardActions.getNetworkInfo());
    yield put(walletActions.refreshWallet());

    const user = yield select((state: RootState) => state.Wallet.user);

    if (user.wallet) {
      yield put(
        midgardActions.getStakerPoolData({
          asset: symbol,
          address: user.wallet,
        }),
      );
    }
  });
}

// refresh data needed for stake page
export function* refreshTransactionData() {
  yield takeEvery('REFRESH_TRANSACTION_DATA', function*() {
    const user = yield select((state: RootState) => state.Wallet.user);
    const walletAddress = user?.wallet;
    yield put(
      midgardActions.getTx({
        address: walletAddress,
        offset: 0,
        limit: TX_PAGE_LIMIT,
        refresh: true,
      }),
    );
  });
}

export default function* rootSaga() {
  yield all([
    fork(getBEPSwapData),
    fork(getPoolViewData),
    fork(getPoolDetailViewData),
    fork(refreshSwapData),
    fork(refreshStakeData),
    fork(refreshTransactionData),
  ]);
}
