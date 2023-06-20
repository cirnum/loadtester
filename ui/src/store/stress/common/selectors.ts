import { ApplicationState } from "../../types";

export const getSettigs = (state: ApplicationState) => {
  return state.common.settings?.data;
};
