import {
  LoadsterResponse,
  RequestHistoryPayload,
} from "../store/stress/dashboard/types";

const resultData = {
  clients: 0,
  finish: false,
  rps: 0,
  count: 0,
  totalRequst: 0,
  ".latency": 0,
  ".http_ok": 0,
  httpFail: 0,
  httpSuccess: 0,
  successRPS: 0,
  failedRPS: 0,
  timeTaken: 0,
  failedPer: 0,
  max: 0,
  min: 0,
};

export const NumberFormat = (value: number) => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export const getFailedHttp = (httpFail: LoadsterResponse[]) => {
  const requestFailed = httpFail[httpFail.length - 1];
  const start = requestFailed?.startTime || 0;
  const end = requestFailed?.created_at || 0;
  return [requestFailed?.count || 0, end - start];
};

export const getSuccessHttp = (httpSuccess: LoadsterResponse[]) => {
  const requestSuccess = httpSuccess[httpSuccess.length - 1];
  const start = requestSuccess?.startTime || 0;
  const end = requestSuccess?.created_at || 0;
  return [requestSuccess?.count || 0, end - start];
};
export const getRequestStats = (
  requestedData: LoadsterResponse[] | undefined,
  selectedRequest: RequestHistoryPayload
) => {
  const resultIs = { ...resultData };
  if (requestedData) {
    const stressData = requestedData?.filter(
      (item) => item.type === "histogram"
    );
    const httpFail = requestedData?.filter(
      (item) => item.Title === ".http_fail"
    );
    const httpSuccess = requestedData?.filter(
      (item) => item.Title === ".http_ok"
    );

    let failedRequestCount = 0;
    let successRequestCount = 0;
    let successRPSDuration = 1;
    let failedRPSDuration = 1;

    if (httpFail?.length) {
      [failedRequestCount, failedRPSDuration] = getFailedHttp(httpFail);
    }
    if (httpSuccess?.length) {
      [successRequestCount, successRPSDuration] = getSuccessHttp(httpSuccess);
    }
    const isFinish = requestedData?.filter((item) => item.finish);
    if (stressData) {
      const last = stressData[stressData.length - 1];
      const [first] = stressData;
      resultIs.finish = last?.finish;
      resultIs.max = last?.max;
      resultIs.min = last?.min;
      resultIs.httpFail = failedRequestCount;
      resultIs.httpSuccess = successRequestCount;
      resultIs.successRPS = successRequestCount / successRPSDuration;
      resultIs.failedRPS = failedRequestCount / failedRPSDuration;

      const timeTaken = (last?.created || 0) - (first?.startTime || 0);
      resultIs.timeTaken = !isFinish?.length
        ? timeTaken
        : selectedRequest?.time || 1;
      resultIs.count = last?.count || 0;
      resultIs.failedPer =
        ((resultIs.count - successRequestCount) / resultIs.count) * 100;
      resultIs.rps = parseInt(
        (resultIs.count / resultIs.timeTaken).toString(),
        10
      );
      resultIs.clients = selectedRequest.clients;
      return resultIs;
    }
  }
  return resultIs;
};
