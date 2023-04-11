import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from "./actionTypes";
import { AUTH, AuthAction } from "./types";

const initialState: AUTH = {
  loading: false,
  user: undefined,
  error: undefined,
};

export default (state = initialState, action: AuthAction) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        pending: false,
        user: undefined,
        error: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
