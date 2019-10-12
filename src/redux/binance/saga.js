import { all, takeEvery, put, fork, call } from 'redux-saga/effects';

import actions from './actions';
import {
  getBinanceTestnetURL,
  getBinanceMainnetURL,
  getHeaders,
  axiosRequest,
} from '../../helpers/apiHelper';

const TOKEN_LIMIT = 1000;

export function* getBinanceTokens() {
  yield takeEvery(actions.GET_BINANCE_TOKENS, function*() {
    const params = {
      method: 'get',
      url: getBinanceTestnetURL(`tokens?limit=${TOKEN_LIMIT}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);

      yield put(actions.getBinanceTokensSuccess(data));
    } catch (error) {
      yield put(actions.getBinanceTokensFailed(error));
    }
  });
}

export function* getBinanceMarkets() {
  yield takeEvery(actions.GET_BINANCE_MARKETS, function*() {
    const params = {
      method: 'get',
      url: getBinanceTestnetURL(`markets?limit=${TOKEN_LIMIT}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);

      yield put(actions.getBinanceMarketsSuccess(data));
    } catch (error) {
      yield put(actions.getBinanceMarketsFailed(error));
    }
  });
}

export function* getBinanceTicker() {
  yield takeEvery(actions.GET_BINANCE_MARKETS, function*({ payload }) {
    const params = {
      method: 'get',
      url: getBinanceMainnetURL(`ticker/24hr?symbol=${payload}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);

      yield put(actions.getBinanceTickerSuccess(data));
    } catch (error) {
      yield put(actions.getBinanceTickerFailed(error));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(getBinanceTokens),
    fork(getBinanceMarkets),
    fork(getBinanceTicker),
  ]);
}
