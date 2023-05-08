import {
  FETCH_STRESS_HISTORY_REQUEST,
  FETCH_STRESS_HISTORY_SUCCESS,
  FETCH_STRESS_HISTORY_FAILURE,
  SELECT_REQUEST,
  ADD_REQUEST_HEADER,
  ADD_REQUEST_PARAMS,
  USER_CLICK_CHECKBOX,
  SEND_REQUEST_REQUEST,
  SEND_REQUEST_SUCCESS,
  SEND_REQUEST_FAILURE,
  SET_JSON_BODY,
  SEND_PAYLOAD_TO_SAGA,
  SEND_LOADSTER_REQUEST,
  SEND_LOADSTER_SUCCESS,
  SEND_LOADSTER_FAILURE,
} from "./actionTypes";
import {
  FetchHistoryRequest,
  FetchHistoryFailure,
  FetchHistorySuccess,
  FetchHistoryFailurePayload,
  FetchHistoryRequestPayload,
  FetchHistorySuccessPayload,
  FetchHistoryAction,
  RequestHistoryPayload,
  SelectRequestAction,
  AddRequestHeaderAction,
  RequestHeadersAndParamsPayload,
  AddRequestParamsAction,
  UserClickCheckBoxAction,
  UserClickCheckBoxPayload,
  SendRequestRequest,
  SendRequestSuccess,
  SendRequestFailure,
  SendRequestAction,
  SetJsonBody,
  SendRequestSagaPayload,
  SendPayloadToSagaAction,
  GetLoadsterRequest,
  LoadsterPayload,
  LoadsterRequestPayload,
  GetLoadsterSuccess,
  GetLoadsterFailure,
  LoadsterAction,
} from "./types";

export const fetchHistoryRequest = (
  payload: FetchHistoryRequestPayload
): FetchHistoryRequest => ({
  type: FETCH_STRESS_HISTORY_REQUEST,
  payload,
});

export const fetchHistorySuccess = (
  payload: FetchHistorySuccessPayload
): FetchHistorySuccess => ({
  type: FETCH_STRESS_HISTORY_SUCCESS,
  payload,
});

export const fetchHistoryFailure = (
  payload: FetchHistoryFailurePayload
): FetchHistoryFailure => ({
  type: FETCH_STRESS_HISTORY_FAILURE,
  payload,
});

export const fetchHistoryAction = (
  params: FetchHistoryRequestPayload
): FetchHistoryAction => ({
  type: "@app/API_CALL",
  method: "GET",
  path: "/request",
  params,
  onRequest: fetchHistoryRequest,
  onSuccess: fetchHistorySuccess,
  onFailure: fetchHistoryFailure,
});

// Select requesy
export const selectRequestAction = (
  payload: RequestHistoryPayload
): SelectRequestAction => ({
  type: SELECT_REQUEST,
  payload,
});

// Add Request Header
export const addRequestHeaderAction = (
  payload: RequestHeadersAndParamsPayload
): AddRequestHeaderAction => ({
  type: ADD_REQUEST_HEADER,
  payload,
});

// Add Request Params
export const addRequestParamsAction = (
  payload: RequestHeadersAndParamsPayload
): AddRequestParamsAction => ({
  type: ADD_REQUEST_PARAMS,
  payload,
});

// Add Request Params
export const userClickCheckBoxAction = (
  payload: UserClickCheckBoxPayload
): UserClickCheckBoxAction => ({
  type: USER_CLICK_CHECKBOX,
  payload,
});

// Add Request Params
export const setJsonBody = (
  payload: Record<string, any>[] | []
): SetJsonBody => ({
  type: SET_JSON_BODY,
  payload,
});

// Send request
export const sendRequestRequest = (
  payload: Partial<RequestHistoryPayload>
): SendRequestRequest => ({
  type: SEND_REQUEST_REQUEST,
  payload,
});

export const sendRequestSuccess = (
  payload: FetchHistoryFailurePayload
): SendRequestSuccess => ({
  type: SEND_REQUEST_SUCCESS,
  payload,
});

export const sendRequestFailure = (
  payload: FetchHistoryFailurePayload
): SendRequestFailure => ({
  type: SEND_REQUEST_FAILURE,
  payload,
});

export const sendRequestAction = (
  payload: Partial<RequestHistoryPayload>
): SendRequestAction => ({
  type: "@app/API_CALL",
  method: "POST",
  path: "/request",
  payload,
  onRequest: sendRequestRequest,
  onSuccess: sendRequestSuccess,
  onFailure: sendRequestFailure,
});

// Get Loadster data
// Send request
export const getLoadsterRequest = (
  payload: LoadsterRequestPayload
): GetLoadsterRequest => ({
  type: SEND_LOADSTER_REQUEST,
  payload,
});

export const getLoadsterSuccess = (
  payload: LoadsterPayload
): GetLoadsterSuccess => ({
  type: SEND_LOADSTER_SUCCESS,
  payload,
});

export const getLoadsterFailure = (payload: string): GetLoadsterFailure => ({
  type: SEND_LOADSTER_FAILURE,
  payload,
});

export const getLoadsterAction = (
  payload: LoadsterRequestPayload
): LoadsterAction => ({
  type: "@app/API_CALL",
  method: "GET",
  path: `/loadster/${payload.reqId}`,
  payload,
  onRequest: getLoadsterRequest,
  onSuccess: getLoadsterSuccess,
  onFailure: getLoadsterFailure,
});

// Send action for saga
export const sendPayloadToSaga = (
  payload: SendRequestSagaPayload
): SendPayloadToSagaAction => ({
  type: SEND_PAYLOAD_TO_SAGA,
  payload,
});
