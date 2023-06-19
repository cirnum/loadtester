import { ApplicationState } from "../../types";

export const getEC2List = (state: ApplicationState) => {
  return state.aws.list;
};

export const getCreateEC2ToggleState = (state: ApplicationState) => {
  return state.aws.actions.openCreateEC2Form;
};

export const getWillDeleteEC2 = (state: ApplicationState) => {
  return state.aws.willDelete;
};

export const getCommonLoadingState = (state: ApplicationState) => {
  return state.aws.common.loading;
};

export const getPemFileState = (state: ApplicationState) => {
  return state.aws.pem;
};

export const getCreatePemState = (state: ApplicationState) => {
  return state.aws.createPem;
};
