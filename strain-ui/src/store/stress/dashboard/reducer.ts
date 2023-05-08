import queryString from "query-string";
import {
  commonRequestHeader,
  selectedRequestConst,
} from "../../../constants/dashboard.const";
import {
  FETCH_STRESS_HISTORY_REQUEST,
  FETCH_STRESS_HISTORY_SUCCESS,
  FETCH_STRESS_HISTORY_FAILURE,
  SELECT_REQUEST,
  ADD_REQUEST_HEADER,
  ADD_REQUEST_PARAMS,
  USER_CLICK_CHECKBOX,
  SET_JSON_BODY,
  SEND_LOADSTER_REQUEST,
  SEND_LOADSTER_SUCCESS,
  SEND_LOADSTER_FAILURE,
} from "./actionTypes";
import {
  IDashboard,
  DashboardAction,
  SelectedRequest,
  RequestHeadersAndParamsPayload,
} from "./types";

const initialState: IDashboard = {
  history: {
    loading: false,
    requests: undefined,
    error: undefined,
  },
  analysis: {
    loading: false,
    data: undefined,
  },
  selectedRequest: {
    request: undefined,
    requestHeader: [
      {
        ...commonRequestHeader,
      },
    ],
    requestParams: [
      {
        ...commonRequestHeader,
      },
    ],
    requestBody: {},
  },
};

const mapPrams = (headers: Record<string, string>) => {
  const allPramsKey = Object.keys(headers);
  const totalItem = allPramsKey.length - 1;
  return allPramsKey?.reduce((acc, key, index) => {
    acc.push({ key, value: headers[key], isChecked: true });
    if (index === totalItem) {
      acc.push({ ...commonRequestHeader });
    }
    return acc;
  }, [] as RequestHeadersAndParamsPayload[]);
};

export default (state = initialState, action: DashboardAction) => {
  switch (action.type) {
    case ADD_REQUEST_HEADER: {
      const { requestHeader } = state.selectedRequest;
      const requestToUpdate = requestHeader[action.payload?.position || 0];
      requestToUpdate[action.payload.key] = action.payload.value;
      requestToUpdate.isChecked = true;
      if (requestHeader.length - 1 === action.payload?.position) {
        requestHeader.push({ ...commonRequestHeader });
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
        requestParams = requestParams.concat({ ...commonRequestHeader });
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
      const [url, queryParams] = action.payload.url.split("?");
      const parsed = queryString.parse(queryParams) as Record<string, any>;
      const common: SelectedRequest = { ...selectedRequestConst };
      const requestHeader = mapPrams(action.payload?.headers);
      const requestparams = mapPrams(parsed);
      const requestBody = action.payload?.postData;
      const payload = {
        ...action.payload,
        url: url.slice(0, url.lastIndexOf("/")),
      };

      if (Object.keys(requestHeader).length)
        common.requestHeader = requestHeader;
      if (Object.keys(requestparams).length)
        common.requestParams = requestparams;
      if (Object.keys(requestBody).length) common.requestBody = requestBody;
      return {
        ...state,
        selectedRequest: {
          ...state.selectedRequest,
          request: payload,
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
    case FETCH_STRESS_HISTORY_SUCCESS: {
      return {
        ...state,
        history: {
          loading: false,
          requests: action.payload,
          error: undefined,
        },
      };
    }
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
    case SEND_LOADSTER_REQUEST:
      return {
        ...state,
        analysis: {
          ...state.analysis,
          loading: true,
        },
      };
    case SEND_LOADSTER_SUCCESS: {
      return {
        ...state,
        analysis: {
          loading: false,
          data: action.payload,
          error: undefined,
        },
      };
    }
    case SEND_LOADSTER_FAILURE:
      return {
        ...state,
        analysis: {
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
