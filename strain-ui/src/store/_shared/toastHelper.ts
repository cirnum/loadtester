import {
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_SUCCESS,
} from "../auth/actionTypes";
import {
  LoginFailure,
  LoginSuccess,
  SignUpFailure,
  SignUpSuccess,
} from "../auth/types";
import { ToastConfig } from "../middleware/toast";
import { ApplicationActions } from "../types";

export const toastActions: {
  [key in ApplicationActions["type"]]?: (
    action: Extract<ApplicationActions, { type: key }>
  ) => ToastConfig;
} = {
  [LOGIN_SUCCESS]: (action: LoginSuccess) => ({
    type: "success",
    message: action.payload.message,
  }),
  [LOGIN_FAILURE]: (action: LoginFailure) => ({
    type: "error",
    message: action.payload.message,
  }),
  [SIGNUP_FAILURE]: (action: SignUpFailure) => ({
    type: "error",
    message: action.payload.message,
  }),
  [SIGNUP_SUCCESS]: (action: SignUpSuccess) => ({
    type: "success",
    message: action.payload.message,
  }),
};
