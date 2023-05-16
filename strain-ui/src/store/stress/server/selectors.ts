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
