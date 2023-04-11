import {
  FETCH_STRESS_HISTORY_REQUEST,
  FETCH_STRESS_HISTORY_SUCCESS,
  FETCH_STRESS_HISTORY_FAILURE,
  SELECT_REQUEST,
  ADD_REQUEST_HEADER,
  ADD_REQUEST_PARAMS,
  USER_CLICK_CHECKBOX,
  SET_JSON_BODY,
} from "./actionTypes";
import { IDashboard, DashboardAction } from "./types";

type Accumlator = Record<string, any>[];
const initialState: IDashboard = {
  history: {
    loading: false,
    requests: undefined,
    error: undefined,
  },
  selectedRequest: {
    request: undefined,
    requestHeader: [
      {
        key: "",
        value: "",
        isChecked: true,
      },
    ],
    requestParams: [
      {
        key: "",
        value: "",
        isChecked: true,
      },
    ],
    requestBody: {},
  },
};

const mapHeaderAndParas = (
  headers: Record<string, string>[] | Record<string, string>
) => {
  if (Array.isArray(headers)) {
    return headers?.reduce((acc, data) => {
      const { Key, Value } = data;
      acc.push({ key: Key, value: Value, isChecked: true });
      return acc;
    }, [] as Accumlator);
  }
  return [];
};

export default (state = initialState, action: DashboardAction) => {
  switch (action.type) {
    case ADD_REQUEST_HEADER: {
      const { requestHeader } = state.selectedRequest;
      const requestToUpdate = requestHeader[action.payload?.position || 0];
      requestToUpdate[action.payload.key] = action.payload.value;
      requestToUpdate.isChecked = true;
      if (requestHeader.length - 1 === action.payload?.position) {
        requestHeader.push({ key: "", value: "", isChecked: false });
      }
      return {
        ...state,
        selectedRequest: {
          ...state.selectedRequest,
          requestHeader: [...requestHeader],
        },
      };
    }
    case USER_CLICK_CHECKBOX: {
      const selectedRequest = { ...state.selectedRequest };
      const newArr = [...selectedRequest[action.payload.type]];
      const postionToChange = { ...newArr[action.payload.position] };
      postionToChange.isChecked = !postionToChange.isChecked;
      newArr[action.payload.position] = postionToChange;

      return {
        ...state,
        selectedRequest: {
          ...state.selectedRequest,
          [action.payload.type]: newArr,
        },
      };
    }
    case ADD_REQUEST_PARAMS: {
      let { requestParams } = state.selectedRequest;
      const requestToUpdate = requestParams[action.payload?.position || 0];
      requestToUpdate[action.payload.key] = action.payload.value;
      requestToUpdate.isChecked = true;
      if (requestParams.length - 1 === action.payload?.position) {
        requestParams = requestParams.concat({
          key: "",
          value: "",
          isChecked: false,
        });
      }
      return {
        ...state,
        selectedRequest: {
          ...state.selectedRequest,
          requestParams: [...requestParams],
        },
      };
    }
    case SELECT_REQUEST: {
      const common: any = {};
      const requestHeader = mapHeaderAndParas(action.payload?.headers);
      const requestparams = mapHeaderAndParas(action.payload?.params);

      if (Object.keys(requestHeader).length)
        common.requestHeader = requestHeader;
      if (Object.keys(requestparams).length)
        common.requestParams = requestparams;
      return {
        ...state,
        selectedRequest: {
          ...state.selectedRequest,
          request: action.payload,
          ...common,
        },
      };
    }
    case FETCH_STRESS_HISTORY_REQUEST:
      return {
        ...state,
        history: {
          loading: true,
        },
      };
    case FETCH_STRESS_HISTORY_SUCCESS:
      return {
        ...state,
        history: {
          loading: false,
          requests: action.payload,
          error: undefined,
        },
      };
    case FETCH_STRESS_HISTORY_FAILURE:
      return {
        ...state,
        history: {
          pending: false,
          requests: undefined,
          error: action.payload,
        },
      };
    case SET_JSON_BODY:
      return {
        ...state,
        selectedRequest: {
          ...state.selectedRequest,
          requestBody: action.payload,
        },
      };
    default:
      return {
        ...state,
      };
  }
};
