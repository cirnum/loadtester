import { all, takeLatest, select, put } from "redux-saga/effects";
import {
  pushToHistoryAction,
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

function getValidProtoUrl(url: string): string {
  const defaultOption = "http://";
  if (url.indexOf(defaultOption) !== 0 || url.indexOf("https://") !== 0) {
    return defaultOption + url;
  }
  return url;
}

const constructUrl = (
  url: string,
  params: RequestHeadersAndParamsPayload[]
) => {
  let updatedUrl;
  try {
    updatedUrl = new URL(url.trim());
  } catch {
    updatedUrl = new URL(getValidProtoUrl(url.trim()));
  }
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
  const DEFAULT_CLIENT = 10;
  const DEFAULT_TIME = 10;
  const DEFAULT_QPS = 0;

  const url = constructUrl(action.payload.url, request.requestParams);
  const headers = constructHeader(request.requestHeader);
  const cookies = constructHeader(request.requestCookies);
  const postData = request.requestBody;
  const method = action.payload.method as RestMethods;
  return {
    ...action.payload,
    clients: parseInt(action.payload.clients?.toString(), 10) || DEFAULT_CLIENT,
    time: parseInt(action.payload.time?.toString(), 10) || DEFAULT_TIME,
    qps: parseInt(action.payload.qps?.toString(), 10) || DEFAULT_QPS,
    url,
    requestTimeout: action.payload.requestTimeout,
    statusCodeIncludes: action.payload.statusCodeIncludes,
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
  yield put(
    sendRequestAction(payloadToSend as unknown as RequestHistoryPayload) // TODO: Ts hack need to refactor
  );
}

function* requestSuccessSaga(action: SelectRequestAndResponseOnGet) {
  yield put(pushToHistoryAction(action.payload?.data?.request));
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
