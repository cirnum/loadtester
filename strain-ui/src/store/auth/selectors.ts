import { ApplicationState } from "../types";

export const getAuthState = (state: ApplicationState) => {
  return state.auth.user;
};
export const getSignupState = (state: ApplicationState) => {
  return state.auth.signup;
};
