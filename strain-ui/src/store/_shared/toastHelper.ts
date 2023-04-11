import { LOGIN_FAILURE, LOGIN_SUCCESS } from "../auth/actionTypes";
import { LoginFailure, LoginSuccess } from "../auth/types";
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
};
