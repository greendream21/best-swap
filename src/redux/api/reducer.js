import actions from './actions';

const initState = {
  data: [],
  error: null,
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.GET_DATA_REQUEST:
      return {
        ...state,
        error: null,
      };
    case actions.GET_DATA_SUCCESS:
      return {
        ...state,
        data: payload,
        error: null,
      };
    case actions.GET_DATA_FAILED:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
}
