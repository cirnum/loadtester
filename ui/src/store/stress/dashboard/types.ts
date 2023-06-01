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
  SEND_LOADSTER_REQUEST,
  SEND_LOADSTER_SUCCESS,
  SEND_LOADSTER_FAILURE,
  ADD_REQUEST_COOKIES,
  SAVE_REQUEST_RESPONSE,
  PUSH_TO_HISTORY,
  ADD_NEW_REQUEST,
} from "./actionTypes";
import { ApiCallAction } from "../../types";
import { Server } from "../server/types";

export type RestMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FetchHistoryRequestPayload {
  limit: number;
  page: number;
}

export interface SelectedRequest {
  request?: RequestHistoryPayload;
  requestHeader: RequestHeadersAndParamsPayload[];
  requestCookies: RequestHeadersAndParamsPayload[];
  requestParams: RequestHeadersAndParamsPayload[];
  requestBody: Record<string, any>[] | Object;
  response?: RequestResponse;
}
export interface IDashboard {
  history: {
    loading: boolean;
    error?: FetchHistoryFailurePayload;
    requests?: FetchHistorySuccessPayload;
  };
  analysis: {
    loading: boolean;
    error?: string;
    data?: FetchLoadsterSuccessPayload;
  };
  selectedRequest: SelectedRequest;
}

export interface FetchLoadsterSuccessPayload {
  message: string;
  data: LoadsterRequestedResponse;
  status: string;
}
export interface FetchHistorySuccessPayload {
  message: string;
  data: RequestList;
  status: string;
}

export interface Jobs extends Server {
  status: boolean;
  created: string;
  error?: string;
  server?: Server;
  serverId: string;
}
export interface LoadsterRequestedResponse {
  workers: Jobs[];
  totalRPS: number;
  totalRequest: number;
  successRPS: number;
  totalSuccessRequest: number;
  failRPS: number;
  totalFailRequest: number;
  otherFailRPS: number;
  totalFailRPS: number;
  totalOtherFailRequest: number;
  finish: number;
  serverMap: Record<string, ServerMapData>;
  failPercentage: number;
  timeTaken: number;
  maxLatency: number;
  minLatency: number;
}

export interface ServerMapData {
  serverId: string;
  totalRPS: number;
  successRPS: number;
  failRPS: number;
  otherFailRPS: number;
  totalFailRPS: number;
  latency: LoadsterResponse[];
  success: LoadsterResponse[];
  fail: LoadsterResponse[];
  otherFail: LoadsterResponse[];
  failPercentage: number;
  timeTaken: number;
  maxLatency: number;
  minLatency: number;
}
export interface LoadsterResponse {
  id: string;
  count: number;
  type: string;
  Title: string;
  min: number;
  max: number;
  mean: number;
  stddev: number;
  median: number;
  p75: number;
  p95: number;
  p99: number;
  p999: number;
  rps: number;
  reqId: string;
  serverId: string;
  token: string;
  created: number;
  updated_at: number;
  created_at: number;
  finish: boolean;
  startTime: number;
}

export interface RequestList {
  pagination: Pagination;
  data: RequestHistoryPayload[];
}
export interface Pagination {
  limit: number;
  page: number;
  offset: number;
  total: number;
}
export interface RequestHistoryPayload {
  clients: number;
  created: number;
  created_at: number;
  qps: number;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  id: string;
  ips: string[];
  keepAlive: boolean;
  method: RestMethods;
  postData: Record<string, string>;
  requests: number;
  time: number;
  url: string;
  params: Record<string, string>[] | Record<string, string>;
}

export interface LoadsterRequestPayload {
  reqId: string;
}
export interface LoadsterPayload {
  pagination: Pagination;
  requestId: string;
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
export interface PushToHistoryAction extends Action {
  type: typeof PUSH_TO_HISTORY;
  payload: RequestHistoryPayload;
}

export interface SelectRequestActionOnGet extends Action {
  type: typeof SELECT_REQUEST;
  payload: SelectedRequestResponse;
}

export interface AddNewRequestAction extends Action {
  type: typeof ADD_NEW_REQUEST;
}

export interface SelectRequestAndResponseOnGet extends Action {
  type: typeof SELECT_REQUEST;
  payload: RequestedResponsePayload;
}
// When intial request hit and verify the response: start //
export interface SaveRequestResponseAction extends Action {
  type: typeof SAVE_REQUEST_RESPONSE;
  payload?: RequestResponse;
}
export interface RequestResponse {
  body: string;
  headers: Record<string, string[]>;
  contentLength: number;
  cookies: Record<string, string>;
  proto: string;
  timeTaken: number;
  uncompress: boolean;
  statusCode: number;
}
export interface RequestedResponsePayload {
  error: string;
  msg: string;
  data: {
    request: RequestHistoryPayload;
    response?: RequestResponse;
  };
}
// When intial request hit and verify the response: end //

export interface SelectedRequestResponse {
  data: RequestHistoryPayload;
  error: string;
  msg: string;
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

// Add request Params
export interface AddRequestCookiesAction extends Action {
  type: typeof ADD_REQUEST_COOKIES;
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

// Get Result data
export interface GetLoadsterRequest extends Action {
  type: typeof SEND_LOADSTER_REQUEST;
  payload: LoadsterRequestPayload;
}

export interface GetLoadsterSuccess extends Action {
  type: typeof SEND_LOADSTER_SUCCESS;
  payload: LoadsterPayload;
}

export interface GetLoadsterFailure extends Action {
  type: typeof SEND_LOADSTER_FAILURE;
  payload: string;
}

export interface LoadsterAction extends ApiCallAction {
  method: "GET";
  payload: LoadsterRequestPayload;
  onRequest?: ActionCreator<GetLoadsterRequest>;
  onSuccess?: ActionCreator<GetLoadsterSuccess>;
  onFailure?: ActionCreator<GetLoadsterFailure>;
}
// SendRequestPayloadSet
export interface SendRequestSagaPayload {
  url: string;
  clients: number;
  method: string;
  time: number;
  qps: number;
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
  | SendPayloadToSagaAction
  | LoadsterAction
  | GetLoadsterRequest
  | GetLoadsterSuccess
  | GetLoadsterFailure
  | AddRequestCookiesAction
  | SaveRequestResponseAction
  | PushToHistoryAction
  | AddNewRequestAction;
