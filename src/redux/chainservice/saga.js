import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import axios from 'axios';
import actions from './actions';
import { getChainserviceURL, getHeaders } from '../../helpers/apiHelper';

export function* getUserData() {
  yield takeEvery(actions.GET_USER_DATA_REQUEST, function*({ payload }) {
    const params = {
      method: 'get',
      url: getChainserviceURL('userData'),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axios.request, params);

      yield put(actions.getUserDataSuccess(data));
    } catch (error) {
      yield put(actions.getUserDataFailed(error));
    }
  });
}

export function* getTokens() {
  yield takeEvery(actions.GET_TOKENS_REQUEST, function*({ payload }) {
    const params = {
      method: 'get',
      url: getChainserviceURL('tokens'),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axios.request, params);

      yield put(actions.getTokensSuccess(data));
    } catch (error) {
      yield put(actions.getTokensFailed(error));
    }
  });
}

export function* getTokenData() {
  yield takeEvery(actions.GET_TOKENDATA_REQUEST, function*({ payload }) {
    const { token } = payload;

    const params = {
      method: 'get',
      url: getChainserviceURL(`tokenData?token=${token}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axios.request, params);

      yield put(actions.getTokenDataSuccess(data));
    } catch (error) {
      yield put(actions.getTokenDataFailed(error));
    }
  });
}

export function* getSwapData() {
  yield takeEvery(actions.GET_SWAP_DATA_REQUEST, function*({ payload }) {
    const { asset } = payload;

    const params = {
      method: 'get',
      url: getChainserviceURL(`swapData?asset=${asset}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axios.request, params);

      yield put(actions.getSwapDataSuccess(data));
    } catch (error) {
      yield put(actions.getSwapDataFailed(error));
    }
  });
}

export function* getSwapTx() {
  yield takeEvery(actions.GET_SWAP_TX_REQUEST, function*({ payload }) {
    const { asset } = payload;

    const params = {
      method: 'get',
      url: getChainserviceURL(`swapTx?asset=${asset}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axios.request, params);

      yield put(actions.getSwapTxSuccess(data));
    } catch (error) {
      yield put(actions.getSwapTxFailed(error));
    }
  });
}

export function* getStakeData() {
  yield takeEvery(actions.GET_STAKE_DATA_REQUEST, function*({ payload }) {
    const { staker, asset } = payload;

    const params = {
      method: 'get',
      url: getChainserviceURL(`stakerData?staker=${staker}&asset=${asset}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axios.request, params);

      yield put(actions.getStakeDataSuccess(data));
    } catch (error) {
      yield put(actions.getStakeDataFailed(error));
    }
  });
}

export function* getStakeTx() {
  yield takeEvery(actions.GET_STAKE_TX_REQUEST, function*({ payload }) {
    const { staker, asset } = payload;

    const params = {
      method: 'get',
      url: getChainserviceURL(`stakerTx?staker=${staker}&asset=${asset}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axios.request, params);

      yield put(actions.getStakeTxSuccess(data));
    } catch (error) {
      yield put(actions.getStakeTxFailed(error));
    }
  });
}

export default function* rootSaga() {
  yield all([fork(getUserData)]);
}
