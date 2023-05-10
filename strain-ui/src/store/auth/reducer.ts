import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_CLEAR,
} from "./actionTypes";
import { AUTH, AuthAction } from "./types";

const initialState: AUTH = {
  loading: false,
  user: undefined,
  error: undefined,
  signup: {
    loading: false,
    data: undefined,
  },
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
    case SIGNUP_REQUEST:
      return {
        ...state,
        loading: true,
        signup: {
          ...state.signup,
          loading: true,
        },
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        signup: {
          loading: false,
          data: action.payload,
        },
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        signup: {
          loading: false,
          data: action.payload,
        },
      };
    case SIGNUP_CLEAR:
      return {
        ...state,
        signup: {
          loading: false,
          data: undefined,
        },
      };
    default:
      return {
        ...state,
      };
  }
};
