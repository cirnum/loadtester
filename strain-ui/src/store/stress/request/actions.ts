// Get Loadster data

import { LoadsterRequestPayload } from "../dashboard/types";
import {
  GET_REQUEST_BY_ID_FAILURE,
  GET_REQUEST_BY_ID_REQUEST,
  GET_REQUEST_BY_ID_SUCCESS,
} from "./actionTypes";
import {
  GetRequestByIdAction,
  GetRequestByIdFailure,
  GetRequestByIdRequest,
  GetRequestByIdSuccess,
  RequestByIdResponse,
} from "./types";

// Send request
export const getRequestByIdRequest = (
  payload: LoadsterRequestPayload
): GetRequestByIdRequest => ({
  type: GET_REQUEST_BY_ID_REQUEST,
  payload,
});

export const getRequestByIdSuccess = (
  payload: RequestByIdResponse
): GetRequestByIdSuccess => ({
  type: GET_REQUEST_BY_ID_SUCCESS,
  payload,
});

export const getRequestByIdFailure = (
  payload: string
): GetRequestByIdFailure => ({
  type: GET_REQUEST_BY_ID_FAILURE,
  payload,
});

export const getRequestByIdAction = (
  payload: LoadsterRequestPayload
): GetRequestByIdAction => ({
  type: "@app/API_CALL",
  method: "GET",
  path: `/request/${payload.reqId}`,
  payload,
  onRequest: getRequestByIdRequest,
  onSuccess: getRequestByIdSuccess,
  onFailure: getRequestByIdFailure,
});
