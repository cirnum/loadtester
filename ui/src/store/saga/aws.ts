import { all, takeLatest, put } from "redux-saga/effects";
import {
  CommonFailure,
  CreateEC2Success,
  CreatePemKeyRequestSuccessAndFail,
  DeleteEC2Success,
} from "../stress/aws/types";
import {
  COMMON_FAILURE,
  CREATE_EC2_SUCCESS,
  CREATE_PEM_FILE_SUCCESS_AND_FAIL,
  DELETE_EC2_SUCCESS,
} from "../stress/aws/actionTypes";
import { getEC2ServerAction, getPemFilesAction } from "../stress/aws/actions";

function* awsListSaga() {
  const pagination = {
    page: 1,
    limit: 25,
  };
  yield put(getEC2ServerAction(pagination));
}
function* awsGetPemKeys() {
  yield put(getPemFilesAction());
}

function* combineSaga() {
  yield all([
    takeLatest<CreateEC2Success["type"], typeof awsListSaga>(
      CREATE_EC2_SUCCESS,
      awsListSaga
    ),
    takeLatest<CommonFailure["type"], typeof awsListSaga>(
      COMMON_FAILURE,
      awsListSaga
    ),
    takeLatest<DeleteEC2Success["type"], typeof awsListSaga>(
      DELETE_EC2_SUCCESS,
      awsListSaga
    ),
    takeLatest<CreatePemKeyRequestSuccessAndFail["type"], typeof awsGetPemKeys>(
      CREATE_PEM_FILE_SUCCESS_AND_FAIL,
      awsGetPemKeys
    ),
  ]);
}

export default combineSaga;
