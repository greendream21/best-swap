import {
  all,
  takeEvery,
  put,
  fork,
  select,
  race,
  take,
} from 'redux-saga/effects';
import moment from 'moment';

import * as actions from './actions';
import * as binanceActions from '../binance/actions';
import * as midgardActions from '../midgard/actions';
import * as walletActions from '../wallet/actions';

import { RootState } from '../store';

import { TxDetailsTypeEnum } from '../../types/generated/midgard';

import { BUSD_SYMBOL } from '../../settings/assetData';

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
      midgardActions.getTransactionWithRefresh({
        asset: payload,
        offset: 0,
        limit: 10,
      }),
    );

    const timeStamp: number = moment().unix();
    yield put(
      midgardActions.getRTVolumeByAsset({
        asset: '',
        from: 0,
        to: timeStamp,
        interval: 'day',
      }),
    );
    yield put(
      midgardActions.getRTAggregateByAsset({
        asset: '',
        from: 0,
        to: timeStamp,
        interval: 'day',
      }),
    );
  });
}

// refresh data needed for swap page
export function* refreshSwapData() {
  yield takeEvery('REFRESH_SWAP_DATA', function*() {
    yield put(midgardActions.getPools());
    yield put(midgardActions.getPoolAddress());
    yield put(walletActions.refreshWallet());
  });
}

// refresh data needed for stake page
export function* refreshStakeData() {
  yield takeEvery('REFRESH_STAKE_DATA', function*({
    payload,
  }: ReturnType<typeof actions.refreshStakeData>) {
    const symbol = payload;

    yield put(midgardActions.getPoolAddress());
    yield put(midgardActions.getNetworkInfo());
    yield put(walletActions.refreshWallet());

    const user = yield select((state: RootState) => state.Wallet.user);

    if (user.wallet) {
      yield put(
        midgardActions.getPoolData({
          assets: [symbol],
          overrideAllPoolData: false,
          type: 'full',
        }),
      );
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

    if (user.wallet) {
      const allTxTypeParams = `${TxDetailsTypeEnum.Swap},${TxDetailsTypeEnum.DoubleSwap},${TxDetailsTypeEnum.Stake},${TxDetailsTypeEnum.Unstake}`;

      yield put(actions.setRefreshTxStatus(true));
      yield put(
        midgardActions.getTxByAddress({
          address: user.wallet,
          offset: 0,
          limit: 5,
          type: allTxTypeParams,
        }),
      );

      yield race([
        take('GET_TX_BY_ADDRESS_SUCCESS'),
        take('GET_TX_BY_ADDRESS_FAILED'),
      ]);

      yield put(actions.setRefreshTxStatus(false));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(getBEPSwapData),
    fork(getPoolViewData),
    fork(refreshSwapData),
    fork(refreshStakeData),
    fork(refreshTransactionData),
  ]);
}
