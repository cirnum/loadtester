import { Action, ActionCreator } from "redux";
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
} from "./actionTypes";
import { ApiCallAction } from "../../types";

export type RestMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FetchHistoryRequestPayload {
  limit: number;
  page: number;
}

export interface SelectedRequest {
  request?: RequestHistoryPayload;
  requestHeader: RequestHeadersAndParamsPayload[];
  requestParams: RequestHeadersAndParamsPayload[];
  requestBody: Record<string, any>[] | Object;
}
export interface IDashboard {
  history: {
    loading: boolean;
    error?: FetchHistoryFailurePayload;
    requests?: FetchHistorySuccessPayload;
  };
  selectedRequest: SelectedRequest;
}

export interface FetchHistorySuccessPayload {
  message: string;
  data: RequestHistoryPayload[];
  status: string;
}

export interface RequestHistoryPayload {
  clients: number;
  created: number;
  headers: Record<string, string>[] | Record<string, string>;
  id: string;
  ips: string[];
  keepAlive: boolean;
  method: RestMethods;
  postData: Record<string, string>[] | Record<string, string>;
  requests: number;
  time: number;
  url: string;
  params: Record<string, string>[] | Record<string, string>;
}

export interface FetchHistoryFailurePayload {
  message: string;
  data: undefined;
  status: string;
}

export interface FetchHistoryRequest extends Action {
  type: typeof FETCH_STRESS_HISTORY_REQUEST;
  payload: FetchHistoryRequestPayload;
}

export interface FetchHistorySuccess extends Action {
  type: typeof FETCH_STRESS_HISTORY_SUCCESS;
  payload: FetchHistorySuccessPayload;
}

export interface FetchHistoryFailure extends Action {
  type: typeof FETCH_STRESS_HISTORY_FAILURE;
  payload: FetchHistoryFailurePayload;
}

export interface FetchHistoryAction extends ApiCallAction {
  method: "GET";
  params: FetchHistoryRequestPayload;
  onRequest?: ActionCreator<FetchHistoryRequest>;
  onSuccess?: ActionCreator<FetchHistorySuccess>;
  onFailure?: ActionCreator<FetchHistoryFailure>;
}

// Select Request
export interface SelectRequestAction extends Action {
  type: typeof SELECT_REQUEST;
  payload: RequestHistoryPayload;
}

// Add request Header
export interface RequestHeadersAndParamsPayload {
  key: string;
  value: string;
  position?: number;
  isChecked?: boolean;
}
export interface AddRequestHeaderAction extends Action {
  type: typeof ADD_REQUEST_HEADER;
  payload: RequestHeadersAndParamsPayload;
}

// Add request Params
export interface AddRequestParamsAction extends Action {
  type: typeof ADD_REQUEST_PARAMS;
  payload: RequestHeadersAndParamsPayload;
}

// Set Method
export interface SetJsonBody extends Action {
  type: typeof SET_JSON_BODY;
  payload: Record<string, any>[] | [];
}

// user check that header or params
export interface UserClickCheckBoxPayload {
  position: number;
  type: string;
  isChecked: boolean;
}
export interface UserClickCheckBoxAction extends Action {
  type: typeof USER_CLICK_CHECKBOX;
  payload: UserClickCheckBoxPayload;
}

// Send Request
export interface SendRequestRequest extends Action {
  type: typeof SEND_REQUEST_REQUEST;
  payload: Partial<RequestHistoryPayload>;
}

export interface SendRequestSuccess extends Action {
  type: typeof SEND_REQUEST_SUCCESS;
  payload: FetchHistoryFailurePayload;
}

export interface SendRequestFailure extends Action {
  type: typeof SEND_REQUEST_FAILURE;
  payload: FetchHistoryFailurePayload;
}

export interface SendRequestAction extends ApiCallAction {
  method: "POST";
  payload: Partial<RequestHistoryPayload>;
  onRequest?: ActionCreator<SendRequestRequest>;
  onSuccess?: ActionCreator<SendRequestSuccess>;
  onFailure?: ActionCreator<SendRequestFailure>;
}

// SendRequestPayloadSet
export interface SendRequestSagaPayload {
  url: string;
  clients: number;
  method: string;
  time: number;
}
export interface SendPayloadToSagaAction extends Action {
  type: typeof SEND_PAYLOAD_TO_SAGA;
  payload: SendRequestSagaPayload;
}

export type DashboardAction =
  | FetchHistoryRequest
  | FetchHistorySuccess
  | FetchHistoryFailure
  | FetchHistoryAction
  | SelectRequestAction
  | AddRequestHeaderAction
  | AddRequestParamsAction
  | UserClickCheckBoxAction
  | SendRequestRequest
  | SendRequestSuccess
  | SendRequestFailure
  | SendRequestAction
  | SetJsonBody
  | SendPayloadToSagaAction;
