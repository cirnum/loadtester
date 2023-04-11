import { Action, ActionCreator } from "redux";
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from "./actionTypes";
import { ApiCallAction } from "../types";

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface AUTH {
  loading: boolean;
  error?: LoginFailurePayload;
  user?: LoginSuccessPayload;
}

export interface LoginSuccessPayload {
  message: string;
  data: string;
  status: string;
}

export interface LoginFailurePayload {
  message: string;
  data: string;
  status: string;
}

export interface LoginRequest extends Action {
  type: typeof LOGIN_REQUEST;
  payload: LoginRequestPayload;
}

export interface LoginSuccess extends Action {
  type: typeof LOGIN_SUCCESS;
  payload: LoginSuccessPayload;
}

export interface LoginFailure extends Action {
  type: typeof LOGIN_FAILURE;
  payload: LoginFailurePayload;
}

export interface LoginAction extends ApiCallAction {
  method: "POST";
  payload: LoginRequestPayload;
  onRequest?: ActionCreator<LoginRequest>;
  onSuccess?: ActionCreator<LoginSuccess>;
  onFailure?: ActionCreator<LoginFailure>;
}

export type AuthAction =
  | LoginRequest
  | LoginSuccess
  | LoginFailure
  | LoginAction;
