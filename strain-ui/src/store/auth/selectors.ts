import { ApplicationState } from "../types";

export const getAuthState = (state: ApplicationState) => {
  return state.auth.user;
};
