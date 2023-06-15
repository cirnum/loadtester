import { Action, ActionCreator } from "redux";
import { ApiCallAction, PaginationPayload } from "../../types";
import { Pagination } from "../dashboard/types";
import {
  COMMON_FAILURE,
  COMMON_REQUEST,
  COMMON_SUCCESS,
  CREATE_EC2_SUCCESS,
  DELETE_EC2_SUCCESS,
  GET_EC2_SERVERS_FAILURE,
  GET_EC2_SERVERS_REQUEST,
  GET_EC2_SERVERS_SUCCESS,
  SELECT_DELETE_EC2,
  TOGGLE_CREATE_EC2_FORM,
} from "./actionTypes";

export interface IAWS {
  list: {
    loading: boolean;
    data?: EC2ListPayload;
  };
  common: {
    loading: boolean;
    data?: EC2ListPayload;
  };
  willDelete?: AWSEC2;
  actions: {
    openCreateEC2Form: boolean;
  };
}

export interface EC2ListPayload {
  error: boolean;
  message: string;
  data?: AWSEC2[];
  pagination?: Pagination;
}

export interface EC2CreatePayload {
  keyName: string;
  instanceType: string;
  ami: string;
  count: number;
}

export interface DeleteEC2Payload {
  instanceIds: string[];
}

export interface AWSEC2 {
  id: string;
  privateIp: string;
  publicIp: string;
  publicDns: string;
  ec2State: string;
  ec2StateCode: number;
  availabilityZone: string;
  type: number;
  imgId: boolean;
  instanceId: string;
  keyName: string;
  instanceType: boolean;
  privateDns: number;
  updated_at: number;
}

// Get EC2s data
export interface GetEC2ServerRequest extends Action {
  type: typeof GET_EC2_SERVERS_REQUEST;
  params: PaginationPayload;
}

export interface GetEC2ServerSuccess extends Action {
  type: typeof GET_EC2_SERVERS_SUCCESS;
  payload: EC2ListPayload;
}

export interface GetEC2ServerFailure extends Action {
  type: typeof GET_EC2_SERVERS_FAILURE;
  payload: EC2ListPayload;
}

export interface GetEC2ServerAction extends ApiCallAction {
  method: "GET";
  params?: PaginationPayload;
  onRequest?: ActionCreator<GetEC2ServerRequest>;
  onSuccess?: ActionCreator<GetEC2ServerSuccess>;
  onFailure?: ActionCreator<GetEC2ServerFailure>;
}

// Common Request
export interface CommonRequest extends Action {
  type: typeof COMMON_REQUEST;
}

export interface CommonFailure extends Action {
  type: typeof COMMON_FAILURE;
  payload: EC2ListPayload;
}

export interface CommonSuccess extends Action {
  type: typeof COMMON_SUCCESS;
  payload: EC2ListPayload;
}
// Create EC2s Instances
export interface CreateEC2Success extends Action {
  type: typeof CREATE_EC2_SUCCESS;
  payload: EC2ListPayload;
}

export interface ToggleEC2Form extends Action {
  type: typeof TOGGLE_CREATE_EC2_FORM;
  payload: boolean;
}

export interface CreateEC2Action extends ApiCallAction {
  method: "POST";
  payload?: EC2CreatePayload;
  onRequest?: ActionCreator<CommonRequest>;
  onSuccess?: ActionCreator<CreateEC2Success>;
  onFailure?: ActionCreator<CommonFailure>;
}

// Delete server Action
export interface SelectDeleteEC2 extends Action {
  type: typeof SELECT_DELETE_EC2;
  payload?: AWSEC2;
}

export interface DeleteEC2Success extends Action {
  type: typeof DELETE_EC2_SUCCESS;
  payload: EC2ListPayload;
}

export interface DeleteEC2Action extends ApiCallAction {
  method: "DELETE";
  payload?: DeleteEC2Payload;
  onRequest?: ActionCreator<CommonRequest>;
  onSuccess?: ActionCreator<DeleteEC2Success>;
  onFailure?: ActionCreator<CommonFailure>;
}

export type AWSAction =
  | GetEC2ServerRequest
  | GetEC2ServerSuccess
  | GetEC2ServerFailure
  | GetEC2ServerAction
  | CreateEC2Success
  | CreateEC2Action
  | ToggleEC2Form
  | DeleteEC2Success
  | SelectDeleteEC2
  | CommonFailure
  | CommonRequest
  | DeleteEC2Action;
