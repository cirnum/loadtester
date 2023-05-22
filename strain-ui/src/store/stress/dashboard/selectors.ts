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

export const getSelectedRequestHeaders = (state: ApplicationState) => {
  return state.dashboard?.selectedRequest?.requestHeader;
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
