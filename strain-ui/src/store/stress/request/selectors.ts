import { ApplicationState } from "../../types";

export const getSelectedRequest = (state: ApplicationState) => {
  return state.requestReport.request;
};
