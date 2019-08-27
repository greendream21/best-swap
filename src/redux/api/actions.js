const actions = {
  GET_DATA_REQUEST: 'GET_DATA_REQUEST',
  GET_DATA_SUCCESS: 'GET_DATA_SUCCESS',
  GET_DATA_FAILED: 'GET_DATA_FAILED',

  getDataRequest: payload => ({ type: actions.GET_DATA_REQUEST, payload }),
  getDataSuccess: payload => ({ type: actions.GET_DATA_SUCCESS, payload }),
  getDataFailed: payload => ({ type: actions.GET_DATA_FAILED, payload }),
};

export default actions;
