import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from "./actionTypes";
import {
  LoginAction,
  LoginFailure,
  LoginFailurePayload,
  LoginRequest,
  LoginRequestPayload,
  LoginSuccess,
  LoginSuccessPayload,
} from "./types";

export const loginRequest = (payload: LoginRequestPayload): LoginRequest => ({
  type: LOGIN_REQUEST,
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
  path: "/login",
  payload,
  onRequest: loginRequest,
  onSuccess: loginSuccess,
  onFailure: loginFailure,
});
