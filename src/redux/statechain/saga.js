import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';
import {
  getStatechainURL,
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

      yield put(actions.getPoolsSuccess(data));
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

      yield all(
        data.map(token => {
          return put(actions.getTokenInfo({ token }));
        }),
      );

      yield put(actions.getPoolDataSuccess(data));
    } catch (error) {
      yield put(actions.getPoolDataFailed(error));
    }
  });
}

export default function* rootSaga() {
  yield all([fork(getPools), fork(getPoolData)]);
}
