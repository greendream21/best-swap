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

export default function* rootSaga() {
  yield all([fork(getUserData)]);
}
