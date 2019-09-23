import { all, takeEvery, put, fork, call } from 'redux-saga/effects';

import actions from './actions';
import {
  getCoinGeckoURL,
  getHeaders,
  axiosRequest,
} from '../../helpers/apiHelper';

export function* getRunePrice() {
  yield takeEvery(actions.GET_RUNE_PRICE, function*() {
    const params = {
      method: 'get',
      url: getCoinGeckoURL('simple/price?ids=thorchain&vs_currencies=usd'),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);
      const price = data.thorchain.usd || 0;

      yield put(actions.getRunePriceSuccess(price));
    } catch (error) {
      yield put(actions.getRunePriceFailed(error));
    }
  });
}

export function* getCoinsList() {
  yield takeEvery(actions.GET_COINS_LIST, function*() {
    const params = {
      method: 'get',
      url: getCoinGeckoURL('coins/list'),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);

      yield put(actions.getCoinsListSuccess(data));
    } catch (error) {
      yield put(actions.getCoinsListFailed(error));
    }
  });
}

export default function* rootSaga() {
  yield all([fork(getRunePrice), fork(getCoinsList)]);
}
