import { all, fork } from "redux-saga/effects";

import requestSaga from "./request";
import serverSaga from "./server";

export function* rootSaga() {
  yield all([fork(requestSaga), fork(serverSaga)]);
}
