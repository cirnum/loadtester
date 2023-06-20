import { all, takeLatest, put } from "redux-saga/effects";
import {
  changeAlertDialogState,
  getAllServerAction,
} from "../stress/server/actions";
import {
  ADD_SERVER_SUCCESS,
  DELETE_SERVER_SUCCESS,
  SYNC_WITH_MASTER,
} from "../stress/server/actionTypes";
import {
  AddServerSuccess,
  DeleteServerSuccess,
  SyncWithMaster,
} from "../stress/server/types";

function* serverSaga(action: AddServerSuccess) {
  if (!action.payload.error) {
    const pagination = {
      page: 1,
      limit: 10,
    };
    yield put(getAllServerAction(pagination));
  }
}

function* changeDeleteState(action: DeleteServerSuccess) {
  if (!action.payload.error) {
    yield put(changeAlertDialogState(false));
  }
}

/*
  Starts worker saga on latest dispatched `FETCH_TODO_REQUEST` action.
  Allows concurrent increments.
*/
function* combineSaga() {
  yield all([
    takeLatest<AddServerSuccess["type"], typeof serverSaga>(
      ADD_SERVER_SUCCESS,
      serverSaga
    ),
    takeLatest<DeleteServerSuccess["type"], typeof serverSaga>(
      DELETE_SERVER_SUCCESS,
      serverSaga
    ),
    takeLatest<DeleteServerSuccess["type"], typeof changeDeleteState>(
      DELETE_SERVER_SUCCESS,
      changeDeleteState
    ),
    takeLatest<SyncWithMaster["type"], typeof serverSaga>(
      SYNC_WITH_MASTER,
      serverSaga
    ),
  ]);
}

export default combineSaga;
