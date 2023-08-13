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
  SERVER_CONFIG_FAILURE,
  SERVER_CONFIG_REQUEST,
  SERVER_CONFIG_SUCCESS,
  SYNC_WITH_MASTER,
  SYNC_WITH_MASTER_REQUEST,
} from "./actionTypes";

type ServerConfig = {
  token: string;
  port: string;
  masterIp: string;
  ip: string;
  hostIp: string;
  hostUrl: string;
  isAwsAvailable: boolean;
  awsErrorMessage: string;
  isSlave: boolean;
};

export interface IServer {
  syncWithMaster: {
    loading: boolean;
  };
  serverConfig: {
    loading: boolean;
    data?: ServerConfig;
    error?: string;
  };
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
  port?: number;
  enabled: boolean;
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

export interface ServerConfigSuccessPayload {
  data: ServerConfig;
}

export interface SyncResponse {
  error: boolean;
  message: string;
}
export interface AddServerRequestPayload {
  alias: string;
  description: string;
  ip?: string;
  port?: number;
  enabled?: boolean;
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
  actionState: "ADD" | "EDIT" | "VIEW_CONFIG" | undefined;
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

// Sync with master
export interface SyncWithMAsterRequest extends Action {
  type: typeof SYNC_WITH_MASTER_REQUEST;
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

export interface SyncWithMaster extends Action {
  type: typeof SYNC_WITH_MASTER;
  payload: SyncResponse;
}

export interface SyncWithMasterRequest extends Action {
  type: typeof SYNC_WITH_MASTER_REQUEST;
  payload: SyncResponse;
}
export interface SynWithMasterAction extends ApiCallAction {
  method: "GET";
  onRequest?: ActionCreator<SyncWithMAsterRequest>;
  onSuccess?: ActionCreator<SyncWithMaster>;
  onFailure?: ActionCreator<SyncWithMaster>;
}

// Get Server config
export interface ServerConfigRequest extends Action {
  type: typeof SERVER_CONFIG_REQUEST;
  payload: { ip: string };
}

export interface ServerConfigSuccess extends Action {
  type: typeof SERVER_CONFIG_SUCCESS;
  payload: ServerConfigSuccessPayload;
}

export interface ServerConfigFailure extends Action {
  type: typeof SERVER_CONFIG_FAILURE;
  payload: AddServerRequestFailed;
}

export interface ServerConfigAction extends ApiCallAction {
  method: "POST";
  payload?: { ip: string };
  onRequest?: ActionCreator<ServerConfigRequest>;
  onSuccess?: ActionCreator<ServerConfigSuccess>;
  onFailure?: ActionCreator<ServerConfigFailure>;
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
  | SynWithMasterAction
  | SyncWithMaster
  | EditServerAction
  | ServerConfigRequest
  | ServerConfigSuccess
  | ServerConfigFailure
  | ServerConfigAction
  | SyncWithMAsterRequest;
