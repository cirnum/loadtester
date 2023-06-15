import { Action, ActionCreator } from "redux";
import { AUTH, AuthAction } from "./auth/types";
import { IDashboard, DashboardAction } from "./stress/dashboard/types";
import { IRequestReport, RequestAction } from "./stress/request/types";
import { IServer, ServerAction } from "./stress/server/types";
import { AWSAction, IAWS } from "./stress/aws/types";

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
  dashboard: IDashboard;
  requestReport: IRequestReport;
  server: IServer;
  aws: IAWS;
}

export interface CommonError {
  error: boolean;
  message: string;
  data?: null;
}

export interface PaginationPayload {
  page: number;
  limit: number;
}
export type ApplicationActions =
  | AuthAction
  | DashboardAction
  | RequestAction
  | ServerAction
  | AWSAction;

export type ResponseBody = {
  status: number;
  message: string;
};
