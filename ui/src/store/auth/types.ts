import { Action, ActionCreator } from "redux";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_CLEAR,
  SAVE_TOKEN,
} from "./actionTypes";
import { ApiCallAction } from "../types";

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface AUTH {
  loading: boolean;
  error?: LoginFailurePayload;
  user?: LoginSuccessPayload;
  token?: string;
  signup: {
    loading: boolean;
    data?: SignUpSuccessPayload;
  };
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
export interface SaveToken extends Action {
  type: typeof SAVE_TOKEN;
  payload: string;
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

export interface SignUpRequestPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignUpFailurePayload {
  message: string;
  data: string;
  error: boolean;
}
export interface SignUpSuccessPayload {
  message: string;
  data: {
    name: string;
    email: string;
  };
  error: boolean;
}
export interface SignUpRequest extends Action {
  type: typeof SIGNUP_REQUEST;
  payload: SignUpRequestPayload;
}

export interface SignUpSuccess extends Action {
  type: typeof SIGNUP_SUCCESS;
  payload: SignUpSuccessPayload;
}

export interface SignUpFailure extends Action {
  type: typeof SIGNUP_FAILURE;
  payload: SignUpFailurePayload;
}

export interface ClearSingupState extends Action {
  type: typeof SIGNUP_CLEAR;
}

export interface SignUpAction extends ApiCallAction {
  method: "POST";
  payload: SignUpRequestPayload;
  onRequest?: ActionCreator<SignUpRequest>;
  onSuccess?: ActionCreator<SignUpSuccess>;
  onFailure?: ActionCreator<SignUpFailure>;
}

export type AuthAction =
  | LoginRequest
  | LoginSuccess
  | LoginFailure
  | LoginAction
  | SignUpRequest
  | SignUpSuccess
  | SignUpFailure
  | SignUpAction
  | ClearSingupState
  | SaveToken;
