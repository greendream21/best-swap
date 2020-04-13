import { all, takeEvery, put, fork, call } from 'redux-saga/effects';

import { Method, AxiosResponse } from 'axios';
import { Token, Market, TickerStatistics, Account, TxPage, OrderList } from '@thorchain/asgardex-binance';
import * as actions from './actions';
import {
  getBinanceTestnetURL,
  getBinanceMainnetURL,
  getHeaders,
  axiosRequest,
} from '../../helpers/apiHelper';
import { getTickerFormat } from '../../helpers/stringHelper';
import { getTokenName } from '../../helpers/assetHelper';

const LIMIT = 1000;

export function* getBinanceTokens() {
  yield takeEvery(actions.GET_BINANCE_TOKENS, function*() {
    const params = {
      method: 'get' as Method,
      url: getBinanceTestnetURL(`tokens?limit=${LIMIT}`),
      headers: getHeaders(),
    };

    try {
      const { data }: AxiosResponse<Token[]> = yield call(
        axiosRequest,
        params,
      );

      yield put(actions.getBinanceTokensSuccess(data));
    } catch (error) {
      yield put(actions.getBinanceTokensFailed(error));
    }
  });
}

export function* getBinanceMarkets() {
  yield takeEvery(actions.GET_BINANCE_MARKETS, function*() {
    const params = {
      method: 'get' as Method,
      url: getBinanceTestnetURL(`markets?limit=${LIMIT}`),
      headers: getHeaders(),
    };

    try {
      const { data }: AxiosResponse<Market[]> = yield call(
        axiosRequest,
        params,
      );

      yield put(actions.getBinanceMarketsSuccess(data));
    } catch (error) {
      yield put(actions.getBinanceMarketsFailed(error));
    }
  });
}

export function* getBinanceTicker() {
  yield takeEvery(actions.GET_BINANCE_TICKER, function*({
    payload,
  }: actions.GetBinanceTicker) {
    const ticker = getTickerFormat(payload);
    const tokenName = getTokenName(ticker);

    const params = {
      method: 'get' as Method,
      url: getBinanceMainnetURL(`ticker/24hr?symbol=${tokenName}_BNB`),
      headers: getHeaders(),
    };

    try {
      const { data }: AxiosResponse<TickerStatistics[]> = yield call(
        axiosRequest,
        params,
      );

      yield put(actions.getBinanceTickerSuccess(data));
    } catch (error) {
      yield put(actions.getBinanceTickerFailed(error));
    }
  });
}

export function* getBinanceAccount() {
  yield takeEvery(actions.GET_BINANCE_ACCOUNT, function*({
    payload,
  }: actions.GetBinanceAccount) {
    const params = {
      method: 'get' as Method,
      url: getBinanceTestnetURL(`account/${payload}`),
      headers: getHeaders(),
    };

    try {
      const { data }: AxiosResponse<Account> = yield call(axiosRequest, params);

      yield put(actions.getBinanceAccountSuccess(data));
    } catch (error) {
      yield put(actions.getBinanceAccountFailed(error));
    }
  });
}

export function* getBinanceTransactions() {
  yield takeEvery(actions.GET_BINANCE_TRANSACTIONS, function*({
    payload,
  }: actions.GetBinanceTransactions) {
    const { address, symbol, startTime, endTime, limit } = payload;

    const params = {
      method: 'get' as Method,
      url: getBinanceTestnetURL(
        `transactions?address=${address}&txAsset=${symbol}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`,
      ),
      headers: getHeaders(),
    };

    try {
      const { data }: AxiosResponse<TxPage> = yield call(
        axiosRequest,
        params,
      );

      yield put(actions.getBinanceTransactionsSuccess(data));
    } catch (error) {
      yield put(actions.getBinanceTransactionsFailed(error));
    }
  });
}

export function* getBinanceOpenOrders() {
  yield takeEvery(actions.GET_BINANCE_OPEN_ORDERS, function*({
    payload,
  }: actions.GetBinanceOpenOrders) {
    const { address, symbol } = payload;

    const params = {
      method: 'get' as Method,
      url: getBinanceTestnetURL(
        `orders/open?address=${address}&symbol=${symbol}`,
      ),
      headers: getHeaders(),
    };

    try {
      const { data }: AxiosResponse<OrderList> = yield call(
        axiosRequest,
        params,
      );

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
