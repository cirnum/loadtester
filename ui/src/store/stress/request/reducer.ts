import {
  GET_REQUEST_BY_ID_FAILURE,
  GET_REQUEST_BY_ID_REQUEST,
  GET_REQUEST_BY_ID_SUCCESS,
} from "./actionTypes";
import { IRequestReport, RequestAction } from "./types";

const initialState: IRequestReport = {
  request: {
    loading: false,
    data: undefined,
    error: undefined,
  },
};

export default (state = initialState, action: RequestAction) => {
  switch (action.type) {
    case GET_REQUEST_BY_ID_REQUEST:
      return {
        ...state,
        request: {
          ...state.request,
          loading: true,
        },
      };
    case GET_REQUEST_BY_ID_SUCCESS: {
      return {
        ...state,
        request: {
          error: undefined,
          loading: false,
          data: action.payload.data,
        },
      };
    }
    case GET_REQUEST_BY_ID_FAILURE:
      return {
        ...state,
        request: {
          pending: false,
          data: undefined,
          error: action.payload,
        },
      };
    default:
      return {
        ...state,
      };
  }
};
