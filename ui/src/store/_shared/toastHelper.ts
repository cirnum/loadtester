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
import {
  SEND_REQUEST_FAILURE,
  SEND_REQUEST_SUCCESS,
} from "../stress/dashboard/actionTypes";
import {
  SendRequestFailure,
  SendRequestSuccess,
} from "../stress/dashboard/types";
import {
  ADD_SERVER_FAILURE,
  ADD_SERVER_SUCCESS,
  DELETE_SERVER_FAILURE,
  DELETE_SERVER_SUCCESS,
} from "../stress/server/actionTypes";
import {
  AddServerFailure,
  AddServerSuccess,
  DeleteServerFailure,
  DeleteServerSuccess,
} from "../stress/server/types";
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
  [ADD_SERVER_SUCCESS]: (action: AddServerSuccess) => ({
    type: "success",
    message: action.payload.message,
  }),
  [ADD_SERVER_FAILURE]: (action: AddServerFailure) => ({
    type: "error",
    message: action.payload.message,
  }),
  [DELETE_SERVER_SUCCESS]: (action: DeleteServerSuccess) => ({
    type: "success",
    message: action.payload.message,
  }),
  [DELETE_SERVER_FAILURE]: (action: DeleteServerFailure) => ({
    type: "error",
    message: action.payload.message,
  }),
  [SEND_REQUEST_FAILURE]: (action: SendRequestFailure) => ({
    type: "error",
    message: action.payload.message,
  }),
  [SEND_REQUEST_SUCCESS]: (action: SendRequestSuccess) => ({
    type: "success",
    message: action.payload.message,
  }),
};
