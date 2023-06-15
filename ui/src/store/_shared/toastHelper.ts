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
  COMMON_FAILURE,
  CREATE_EC2_SUCCESS,
  DELETE_EC2_SUCCESS,
} from "../stress/aws/actionTypes";
import {
  CommonFailure,
  CreateEC2Success,
  DeleteEC2Success,
} from "../stress/aws/types";
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
  GET_ALL_SERVER_FAILURE,
  SYNC_WITH_MASTER,
} from "../stress/server/actionTypes";
import {
  AddServerFailure,
  AddServerSuccess,
  DeleteServerFailure,
  DeleteServerSuccess,
  GetAllServerFailure,
  SyncWithMaster,
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
  [CREATE_EC2_SUCCESS]: (action: CreateEC2Success) => ({
    type: "success",
    message: action.payload.message,
  }),
  [GET_ALL_SERVER_FAILURE]: (action: GetAllServerFailure) => ({
    type: "error",
    message: action.payload.message,
  }),
  [DELETE_EC2_SUCCESS]: (action: DeleteEC2Success) => ({
    type: "success",
    message: action.payload.message,
  }),
  [COMMON_FAILURE]: (action: CommonFailure) => ({
    type: "error",
    message: action.payload.message,
  }),
  [SYNC_WITH_MASTER]: (action: SyncWithMaster) => ({
    type: "success",
    message: action.payload.message,
  }),
};
