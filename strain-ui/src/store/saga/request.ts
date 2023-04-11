import { all, takeLatest, select, put } from "redux-saga/effects";
import { sendRequestAction } from "../stress/dashboard/actions";

import { SEND_PAYLOAD_TO_SAGA } from "../stress/dashboard/actionTypes";
import { getChangedSelectedRequest } from "../stress/dashboard/selectors";
import {
  RequestHeadersAndParamsPayload,
  SendPayloadToSagaAction,
  RestMethods,
  RequestHistoryPayload,
} from "../stress/dashboard/types";

function validURL(str: string) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

const constructUrl = (
  url: string,
  params: RequestHeadersAndParamsPayload[]
) => {
  if (validURL(url)) {
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
  }
  return url;
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
  const postData = request.requestBody;
  const method = action.payload.method as RestMethods;
  return {
    ...action.payload,
    url,
    headers,
    postData,
    method,
  };
};
/*
  Worker Saga: Fired on FETCH_TODO_REQUEST action
*/
function* requestSaga(action: SendPayloadToSagaAction) {
  const selectedRequest: ReturnType<typeof getChangedSelectedRequest> =
    yield select(getChangedSelectedRequest);
  const payloadToSend = parseRequest(selectedRequest, action);
  yield put(sendRequestAction(payloadToSend as RequestHistoryPayload));
}

/*
  Starts worker saga on latest dispatched `FETCH_TODO_REQUEST` action.
  Allows concurrent increments.
*/
function* todoSaga() {
  yield all([
    takeLatest<SendPayloadToSagaAction["type"], typeof requestSaga>(
      SEND_PAYLOAD_TO_SAGA,
      requestSaga
    ),
  ]);
}

export default todoSaga;
