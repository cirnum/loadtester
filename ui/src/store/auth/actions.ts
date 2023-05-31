import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  SAVE_TOKEN,
  SIGNUP_CLEAR,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
} from "./actionTypes";
import {
  ClearSingupState,
  LoginAction,
  LoginFailure,
  LoginFailurePayload,
  LoginRequest,
  LoginRequestPayload,
  LoginSuccess,
  LoginSuccessPayload,
  SaveToken,
  SignUpAction,
  SignUpFailure,
  SignUpFailurePayload,
  SignUpRequest,
  SignUpRequestPayload,
  SignUpSuccess,
  SignUpSuccessPayload,
} from "./types";

export const loginRequest = (payload: LoginRequestPayload): LoginRequest => ({
  type: LOGIN_REQUEST,
  payload,
});

export const saveToken = (payload: string): SaveToken => ({
  type: SAVE_TOKEN,
  payload,
});

export const loginSuccess = (payload: LoginSuccessPayload): LoginSuccess => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const loginFailure = (payload: LoginFailurePayload): LoginFailure => ({
  type: LOGIN_FAILURE,
  payload,
});

export const loginAction = (payload: LoginRequestPayload): LoginAction => ({
  type: "@app/API_CALL",
  method: "POST",
  path: "/user/signin",
  payload,
  onRequest: loginRequest,
  onSuccess: loginSuccess,
  onFailure: loginFailure,
});

export const singupRequest = (
  payload: SignUpRequestPayload
): SignUpRequest => ({
  type: SIGNUP_REQUEST,
  payload,
});

export const singupSuccess = (
  payload: SignUpSuccessPayload
): SignUpSuccess => ({
  type: SIGNUP_SUCCESS,
  payload,
});

export const singupFailure = (
  payload: SignUpFailurePayload
): SignUpFailure => ({
  type: SIGNUP_FAILURE,
  payload,
});

export const singupAction = (payload: SignUpRequestPayload): SignUpAction => ({
  type: "@app/API_CALL",
  method: "POST",
  path: "/user/signup",
  payload,
  onRequest: singupRequest,
  onSuccess: singupSuccess,
  onFailure: singupFailure,
});

export const clearSingupState = (): ClearSingupState => ({
  type: SIGNUP_CLEAR,
});
