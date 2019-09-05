import actions from './actions';

const initState = {
  user: null,
};

export default function apiReducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case actions.SAVE_WALLET:
      return {
        ...state,
        user: payload,
      };
    case actions.CHECK_USER:
      return {
        ...state,
      };
    default:
      return state;
  }
}
