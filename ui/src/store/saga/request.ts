import { all, takeLatest, select, put } from "redux-saga/effects";
import {
  saveRequestResponseAction,
  selectRequestAction,
  sendRequestAction,
} from "../stress/dashboard/actions";

import {
  SEND_PAYLOAD_TO_SAGA,
  SEND_REQUEST_SUCCESS,
} from "../stress/dashboard/actionTypes";
import { getChangedSelectedRequest } from "../stress/dashboard/selectors";
import {
  RequestHeadersAndParamsPayload,
  SendPayloadToSagaAction,
  RestMethods,
  RequestHistoryPayload,
  SendRequestSuccess,
  SelectRequestAndResponseOnGet,
} from "../stress/dashboard/types";

const constructUrl = (
  url: string,
  params: RequestHeadersAndParamsPayload[]
) => {
  const updatedUrl = new URL(url);
  for (const val in params) {
    if (params[val].isChecked && params[val].key && params[val].value) {
      updatedUrl.searchParams.set(
        params[val].key,
        params[val].value.toString()
      );
    }
  }
  return updatedUrl.toString();
};

const constructHeader = (headers: RequestHeadersAndParamsPayload[]) => {
  return headers.reduce((acc: any, header: RequestHeadersAndParamsPayload) => {
    const { key, value } = header;
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
};
const parseRequest = (
  request: ReturnType<typeof getChangedSelectedRequest>,
  action: SendPayloadToSagaAction
) => {
  const url = constructUrl(action.payload.url, request.requestParams);
  const headers = constructHeader(request.requestHeader);
  const cookies = constructHeader(request.requestCookies);
  const postData = request.requestBody;
  const method = action.payload.method as RestMethods;
  return {
    ...action.payload,
    clients: parseInt(action.payload.clients.toString(), 10),
    time: parseInt(action.payload.time.toString(), 10),
    url,
    headers,
    cookies,
    postData,
    method,
  };
};
/*
  Worker Saga: Fired on Request action
*/
function* requestSaga(action: SendPayloadToSagaAction) {
  const selectedRequest: ReturnType<typeof getChangedSelectedRequest> =
    yield select(getChangedSelectedRequest);
  const payloadToSend = parseRequest(selectedRequest, action);
  yield put(sendRequestAction(payloadToSend as RequestHistoryPayload));
}

function* requestSuccessSaga(action: SelectRequestAndResponseOnGet) {
  yield put(selectRequestAction(action.payload?.data?.request));
  yield put(saveRequestResponseAction(action.payload?.data?.response));
}

/*
  Starts worker saga on latest dispatched `FETCH_TODO_REQUEST` action.
  Allows concurrent increments.
*/
function* combineSaga() {
  yield all([
    takeLatest<SendPayloadToSagaAction["type"], typeof requestSaga>(
      SEND_PAYLOAD_TO_SAGA,
      requestSaga
    ),
    takeLatest<SendRequestSuccess["type"], typeof requestSuccessSaga>(
      SEND_REQUEST_SUCCESS,
      requestSuccessSaga
    ),
  ]);
}

export default combineSaga;
