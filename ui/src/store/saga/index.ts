import { all, fork } from "redux-saga/effects";

import requestSaga from "./request";
import serverSaga from "./server";
import awsSaga from "./aws";

export function* rootSaga() {
  yield all([fork(requestSaga), fork(serverSaga), fork(awsSaga)]);
}
