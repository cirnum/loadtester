import { Action, ActionCreator } from "redux";
import { ApiCallAction } from "../../types";
import { GET_SETTINGS } from "./actionTypes";

export interface ICommon {
  settings: {
    loading: boolean;
    data?: SettingPayload;
  };
}
export interface CommonResponse {
  error?: boolean;
  message: string;
}

export type SettingPayload = CommonResponse & { data?: Settings };
export type Settings = {
  ip: string;
  port: string;
  hostIp: string;
  hostUrl: string;
  isAwsAvailable: string;
  awsErrorMessage: string;
};

export interface SettingsOnSuccessAndFailure extends Action {
  type: typeof GET_SETTINGS;
  payload: SettingPayload;
}

export interface GetSettingsAction extends ApiCallAction {
  method: "GET";
  onSuccess?: ActionCreator<SettingsOnSuccessAndFailure>;
}

export type CommonAction = GetSettingsAction | SettingsOnSuccessAndFailure;
