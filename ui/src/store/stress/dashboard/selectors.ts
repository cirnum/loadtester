import { ApplicationState } from "../../types";

export const getRequestHistory = (state: ApplicationState) => {
  return state.dashboard?.history || [];
};

export const getSelectedRequestId = (state: ApplicationState) => {
  return state.dashboard?.selectedRequest?.request?.id || "";
};

export const getSelectedRequest = (state: ApplicationState) => {
  return state.dashboard?.selectedRequest?.request;
};
export const getSendRequestLoadingState = (state: ApplicationState) => {
  return state.dashboard?.selectedRequest?.loading;
};

export const getSelectedRequestHeaders = (state: ApplicationState) => {
  return state.dashboard?.selectedRequest?.requestHeader;
};

export const getSelectedRequestCookies = (state: ApplicationState) => {
  return state.dashboard?.selectedRequest?.requestCookies;
};

export const getSelectedRequestParams = (state: ApplicationState) => {
  return state.dashboard?.selectedRequest?.requestParams;
};

export const getSelectedRequestBody = (state: ApplicationState) => {
  return state.dashboard?.selectedRequest?.requestBody;
};

export const getChangedSelectedRequest = (state: ApplicationState) => {
  return state.dashboard?.selectedRequest;
};

export const getLoadsterData = (state: ApplicationState) => {
  return state.dashboard?.analysis;
};
export const getLoadsterList = (state: ApplicationState) => {
  return state.dashboard?.analysis?.data?.data;
};

export const getRequestResponseData = (state: ApplicationState) => {
  return state.dashboard?.selectedRequest.response;
};

export const getRequestTimeout = (state: ApplicationState) => {
  return state.dashboard?.selectedRequest.request?.requestTimeout;
};

export const getRequestStatusCodes = (state: ApplicationState) => {
  const statusCodes =
    state.dashboard?.selectedRequest.request?.statusCodeIncludes;
  if (statusCodes) {
    return statusCodes?.split(",").map((statusCode) => Number(statusCode));
  }
  return [];
};
