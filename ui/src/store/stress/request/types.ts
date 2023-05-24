import { Action, ActionCreator } from "redux";
import { ApiCallAction } from "../../types";
import {
  LoadsterRequestPayload,
  RequestHistoryPayload,
} from "../dashboard/types";
import {
  GET_REQUEST_BY_ID_FAILURE,
  GET_REQUEST_BY_ID_REQUEST,
  GET_REQUEST_BY_ID_SUCCESS,
} from "./actionTypes";

export interface IRequestReport {
  request: {
    loading: boolean;
    data?: RequestHistoryPayload;
    error?: string;
  };
}

export interface RequestByIdResponse {
  data: RequestHistoryPayload;
  error: string;
  msg: string;
}
// Get Result data
export interface GetRequestByIdRequest extends Action {
  type: typeof GET_REQUEST_BY_ID_REQUEST;
  payload: LoadsterRequestPayload;
}

export interface GetRequestByIdSuccess extends Action {
  type: typeof GET_REQUEST_BY_ID_SUCCESS;
  payload: RequestByIdResponse;
}

export interface GetRequestByIdFailure extends Action {
  type: typeof GET_REQUEST_BY_ID_FAILURE;
  payload: string;
}

export interface GetRequestByIdAction extends ApiCallAction {
  method: "GET";
  payload: LoadsterRequestPayload;
  onRequest?: ActionCreator<GetRequestByIdRequest>;
  onSuccess?: ActionCreator<GetRequestByIdSuccess>;
  onFailure?: ActionCreator<GetRequestByIdFailure>;
}

export type RequestAction =
  | GetRequestByIdAction
  | GetRequestByIdRequest
  | GetRequestByIdSuccess
  | GetRequestByIdFailure;
