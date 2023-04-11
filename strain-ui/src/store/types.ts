import { Action, ActionCreator } from "redux";
import { AUTH, AuthAction } from "./auth/types";
import { IDashboard, DashboardAction } from "./stress/dashboard/types";


export interface ApiCallAction extends Action {
  type: "@app/API_CALL";
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  payload?: any;
  params?: any;
  onRequest?: ActionCreator<ApplicationActions>;
  onSuccess?: ActionCreator<ApplicationActions>;
  onFailure?: ActionCreator<ApplicationActions>;
  isJuspay?: boolean;
  extraHeaders?: Record<string, string>;
}

export interface ApplicationState {
  auth: AUTH;
  dashboard: IDashboard
}

export type ApplicationActions = AuthAction | DashboardAction;

export type ResponseBody = {
  status: number;
  message: string;
};
