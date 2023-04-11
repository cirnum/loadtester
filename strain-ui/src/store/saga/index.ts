import { all, fork } from "redux-saga/effects";

import requestSaga from "./request";

export function* rootSaga() {
  yield all([fork(requestSaga)]);
}
