import { all } from 'redux-saga/effects';
import apiSagas from './api/saga';

export default function* rootSaga(getState) {
  yield all([apiSagas()]);
}
