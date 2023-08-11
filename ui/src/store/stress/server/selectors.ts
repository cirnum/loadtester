import { ApplicationState } from "../../types";

export const getAddServerState = (state: ApplicationState) => {
  return state.server.server;
};
export const getServerList = (state: ApplicationState) => {
  return state.server.serverList;
};

export const getDeleteRequest = (state: ApplicationState) => {
  return state.server.deleteRequest;
};

export const getAddOrEditState = (state: ApplicationState) => {
  return state.server.server?.addOrEdit || {};
};

export const getServerConfig = (state: ApplicationState) => {
  return state.server.serverConfig || {};
};
