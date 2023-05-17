import { Action, ActionCreator } from "redux";
import { ApiCallAction, CommonError, PaginationPayload } from "../../types";
import { Pagination } from "../dashboard/types";
import {
  ADD_OR_EDIT_SERVER,
  ADD_SERVER_FAILURE,
  ADD_SERVER_REQUEST,
  ADD_SERVER_SUCCESS,
  CLEAR_SERVER_STATE,
  DELETE_DIALOG_STATE,
  DELETE_SERVER_FAILURE,
  DELETE_SERVER_REQUEST,
  DELETE_SERVER_SUCCESS,
  GET_ALL_SERVER_FAILURE,
  GET_ALL_SERVER_REQUEST,
  GET_ALL_SERVER_SUCCESS,
  SELECT_DELETE_REQUEST,
} from "./actionTypes";

export interface IServer {
  serverList: ServerList;
  server: {
    addOrEdit: AddOrEditServerPayload;
    loading: boolean;
    data?: Server;
    error?: string;
  };
  deleteRequest: {
    selectedRequest?: Server;
    alertState: boolean;
    loading: boolean;
    data?: Server;
    error?: string;
  };
}

export interface Server {
  id: string;
  alias: string;
  description: string;
  ip?: string;
  port?: string;
  active?: boolean;
  created_at: number;
  updated_at: number;
  token: string;
}

export interface ServerList {
  loading: boolean;
  error?: boolean | string;
  message?: string;
  data?: {
    data: Server[];
    pagination: Pagination;
  };
}
export interface AddServerRequestPayload {
  alias: string;
  description: string;
  ip?: string;
  port?: number;
}

export interface AddServerRequestResponse {
  error: boolean;
  message: string;
  data: Server;
}
export interface AddServerRequestFailed {
  error: boolean;
  message: string;
  data: null;
}

export interface DeleteRequestResponse {
  error: boolean;
  message: string;
  data: null;
}

export interface AddOrEditServerPayload {
  actionState: "ADD" | "EDIT" | undefined;
  server?: Server;
}
// Get sevrer data
export interface AddServerRequest extends Action {
  type: typeof ADD_SERVER_REQUEST;
  payload: AddServerRequestPayload;
}

export interface AddServerSuccess extends Action {
  type: typeof ADD_SERVER_SUCCESS;
  payload: AddServerRequestResponse;
}

export interface AddServerFailure extends Action {
  type: typeof ADD_SERVER_FAILURE;
  payload: AddServerRequestFailed;
}

export interface ClearServerState extends Action {
  type: typeof CLEAR_SERVER_STATE;
}

export interface AddServerAction extends ApiCallAction {
  method: "POST";
  payload: AddServerRequestPayload;
  onRequest?: ActionCreator<AddServerRequest>;
  onSuccess?: ActionCreator<AddServerSuccess>;
  onFailure?: ActionCreator<AddServerFailure>;
}

export interface EditServerAction extends ApiCallAction {
  method: "PUT";
  payload: AddServerRequestPayload;
  onRequest?: ActionCreator<AddServerRequest>;
  onSuccess?: ActionCreator<AddServerSuccess>;
  onFailure?: ActionCreator<AddServerFailure>;
}

// Get all server data
export interface GetAllServerRequest extends Action {
  type: typeof GET_ALL_SERVER_REQUEST;
  params: PaginationPayload;
}

export interface GetAllServerSuccess extends Action {
  type: typeof GET_ALL_SERVER_SUCCESS;
  payload: ServerList;
}

export interface GetAllServerFailure extends Action {
  type: typeof GET_ALL_SERVER_FAILURE;
  payload: AddServerRequestFailed;
}

export interface GetAllServerAction extends ApiCallAction {
  method: "GET";
  params?: PaginationPayload;
  onRequest?: ActionCreator<GetAllServerRequest>;
  onSuccess?: ActionCreator<GetAllServerSuccess>;
  onFailure?: ActionCreator<GetAllServerFailure>;
}
// Get all server data
export interface DeleteServerRequest extends Action {
  type: typeof DELETE_SERVER_REQUEST;
}

export interface DeleteServerSuccess extends Action {
  type: typeof DELETE_SERVER_SUCCESS;
  payload: DeleteRequestResponse;
}

export interface DeleteServerFailure extends Action {
  type: typeof DELETE_SERVER_FAILURE;
  payload: CommonError;
}

export interface ChangeAlertDialogState extends Action {
  type: typeof DELETE_DIALOG_STATE;
  payload: boolean;
}

export interface AddOrEditServer extends Action {
  type: typeof ADD_OR_EDIT_SERVER;
  payload: AddOrEditServerPayload;
}

export interface SelectDeleteRequest extends Action {
  type: typeof SELECT_DELETE_REQUEST;
  payload?: Server;
}

export interface DeleteServerAction extends ApiCallAction {
  method: "DELETE";
  onRequest?: ActionCreator<DeleteServerRequest>;
  onSuccess?: ActionCreator<DeleteServerSuccess>;
  onFailure?: ActionCreator<DeleteServerFailure>;
}

export type ServerAction =
  | AddServerAction
  | AddServerRequest
  | AddServerSuccess
  | AddServerFailure
  | ClearServerState
  | GetAllServerRequest
  | GetAllServerSuccess
  | GetAllServerFailure
  | GetAllServerAction
  | DeleteServerRequest
  | DeleteServerSuccess
  | DeleteServerFailure
  | DeleteServerAction
  | ChangeAlertDialogState
  | SelectDeleteRequest
  | AddOrEditServer
  | EditServerAction;
