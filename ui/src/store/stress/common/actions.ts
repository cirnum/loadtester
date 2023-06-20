import { GET_SETTINGS } from "./actionTypes";
import {
  GetSettingsAction,
  SettingPayload,
  SettingsOnSuccessAndFailure,
} from "./types";

export const settingsOnSuccessAndFailure = (
  payload: SettingPayload
): SettingsOnSuccessAndFailure => ({
  type: GET_SETTINGS,
  payload,
});

export const getSettingsAction = (): GetSettingsAction => ({
  type: "@app/API_CALL",
  method: "GET",
  path: "/setting",
  onSuccess: settingsOnSuccessAndFailure,
});
