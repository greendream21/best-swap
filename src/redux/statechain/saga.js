import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { keyBy as _keyBy } from 'lodash';
import actions from './actions';
import {
  getStatechainURL,
  getChainserviceURL,
  getHeaders,
  axiosRequest,
} from '../../helpers/apiHelper';

const getPoolDataRequest = async asset => {
  const params = {
    method: 'get',
    url: getChainserviceURL(`poolData?asset=${asset}`),
    headers: getHeaders(),
  };

  try {
    const { data } = await axiosRequest(params);
    return data;
  } catch (error) {
    return null;
  }
};

const getSwapDataRequest = async asset => {
  const params = {
    method: 'get',
    url: getChainserviceURL(`swapData?asset=${asset}`),
    headers: getHeaders(),
  };

  try {
    const { data } = await axiosRequest(params);
    return data;
  } catch (error) {
    return null;
  }
};

export function* getPools() {
  yield takeEvery(actions.GET_POOLS_REQUEST, function*(/* { payload } */) {
    const params = {
      method: 'get',
      url: getStatechainURL('swapservice/pools'),
      headers: getHeaders(),
      withCredentials: true,
    };

    try {
      const { data } = yield call(axiosRequest, params);

      const poolResponse = yield all(
        data.map(poolData => {
          const { ticker } = poolData;

          return call(getPoolDataRequest, ticker);
        }),
      );

      const swapResponse = yield all(
        data.map(poolData => {
          const { ticker } = poolData;

          return call(getSwapDataRequest, ticker);
        }),
      );

      const poolData = _keyBy(
        poolResponse.filter(data => data !== null),
        'asset',
      );
      const swapData = _keyBy(
        swapResponse.filter(data => data !== null),
        'asset',
      );

      yield put(
        actions.getPoolsSuccess({
          pools: data,
          poolData,
          swapData,
        }),
      );
    } catch (error) {
      yield put(actions.getPoolsFailed(error));
    }
  });
}

export function* getPoolInfo() {
  yield takeEvery(actions.GET_POOL_INFO_REQUEST, function*({ payload }) {
    const ticker = payload;
    const params = {
      method: 'get',
      url: getStatechainURL(`swapservice/pool/${ticker}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);

      yield put(actions.getPoolInfoSuccess(data));
    } catch (error) {
      yield put(actions.getPoolInfoFailed(error));
    }
  });
}

export function* getPoolData() {
  yield takeEvery(actions.GET_POOL_DATA_REQUEST, function*({ payload }) {
    const { asset } = payload;

    const params = {
      method: 'get',
      url: getChainserviceURL(`poolData?asset=${asset}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);

      yield put(actions.getPoolDataSuccess({ asset, data }));
    } catch (error) {
      yield put(actions.getPoolDataFailed(error));
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
      const { data } = yield call(axiosRequest, params);

      yield put(actions.getSwapDataSuccess({ asset, data }));
    } catch (error) {
      yield put(actions.getSwapDataFailed(error));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(getPools),
    fork(getPoolInfo),
    fork(getPoolData),
    fork(getSwapData),
  ]);
}
