import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';
import {
  getStatechainURL,
  getChainserviceURL,
  getHeaders,
  axiosRequest,
} from '../../helpers/apiHelper';

export function* getPools() {
  yield takeEvery(actions.GET_POOLS_REQUEST, function*({ payload }) {
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

          const poolParams = {
            method: 'get',
            url: getChainserviceURL(`poolData?asset=${ticker}`),
            headers: getHeaders(),
          };

          return call(axiosRequest, poolParams);
        }),
      );

      const swapResponse = yield all(
        data.map(poolData => {
          const { ticker } = poolData;

          const poolParams = {
            method: 'get',
            url: getChainserviceURL(`swapData?asset=${ticker}`),
            headers: getHeaders(),
          };

          return call(axiosRequest, poolParams);
        }),
      );

      const poolData = data.map((poolInfo, index) => {
        return {
          ...poolInfo,
          poolData: poolResponse[index].data,
          swapData: swapResponse[index].data,
        };
      });

      yield put(actions.getPoolsSuccess(poolData));
    } catch (error) {
      yield put(actions.getPoolsFailed(error));
    }
  });
}

export function* getPoolData() {
  yield takeEvery(actions.GET_POOL_DATA_REQUEST, function*({ payload }) {
    const ticker = payload;
    const params = {
      method: 'get',
      url: getStatechainURL(`swapservice/pool/${ticker}`),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);

      yield put(actions.getPoolDataSuccess(data));
    } catch (error) {
      yield put(actions.getPoolDataFailed(error));
    }
  });
}

export default function* rootSaga() {
  yield all([fork(getPools), fork(getPoolData)]);
}
