import { all, takeEvery, put, fork, call } from 'redux-saga/effects';

import actions from './actions';
import {
  getBinanceTestnetURL,
  getBinanceMainnetURL,
  getHeaders,
  axiosRequest,
} from '../../helpers/apiHelper';
import { getTickerFormat } from '../../helpers/stringHelper';
import { getTokenName } from '../../helpers/assetHelper';

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
  yield takeEvery(actions.GET_BINANCE_TICKER, function*({ payload }) {
    const ticker = getTickerFormat(payload);
    const tokenName = getTokenName(ticker);

    const params = {
      method: 'get',
      url: getBinanceMainnetURL(`ticker/24hr?symbol=${tokenName}_BNB`),
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

export function* getBinanceAccount() {
  yield takeEvery(actions.GET_BINANCE_ACCOUNT, function*({ payload }) {
    const params = {
      method: 'get',
      url: getBinanceTestnetURL(`account/${payload}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);

      yield put(actions.getBinanceAccountSuccess(data));
    } catch (error) {
      yield put(actions.getBinanceAccountFailed(error));
    }
  });
}

export function* getBinanceTransactions() {
  yield takeEvery(actions.GET_BINANCE_TRANSACTIONS, function*({ payload }) {
    const { address, symbol, startTime, endTime, limit } = payload;

    const params = {
      method: 'get',
      url: getBinanceTestnetURL(
        `transactions?address=${address}&txAsset=${symbol}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`,
      ),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);

      yield put(actions.getBinanceTransactionsSuccess(data));
    } catch (error) {
      yield put(actions.getBinanceTransactionsFailed(error));
    }
  });
}

export function* getBinanceOpenOrders() {
  yield takeEvery(actions.GET_BINANCE_OPEN_ORDERS, function*({ payload }) {
    const { address, symbol } = payload;

    const params = {
      method: 'get',
      url: getBinanceTestnetURL(
        `orders/open?address=${address}&symbol=${symbol}`,
      ),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);

      yield put(actions.getBinanceOpenOrdersSuccess(data));
    } catch (error) {
      yield put(actions.getBinanceOpenOrdersFailed(error));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(getBinanceTokens),
    fork(getBinanceMarkets),
    fork(getBinanceTicker),
    fork(getBinanceAccount),
    fork(getBinanceTransactions),
    fork(getBinanceOpenOrders),
  ]);
}
