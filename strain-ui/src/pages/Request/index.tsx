import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import { utcToZonedTime, format } from "date-fns-tz";
import { AccordianArea } from "../../components/Accordian";
import { ELoadChart } from "../../components/Chart/Eline";
import { Stats } from "../../components/Stats";
import { getLoadsterAction } from "../../store/stress/dashboard/actions";
import { getLoadsterList } from "../../store/stress/dashboard/selectors";
import {
  LoadsterResponse,
  RequestHistoryPayload,
} from "../../store/stress/dashboard/types";
import { useInterval } from "../../hooks/useInterval";
import { getRequestByIdAction } from "../../store/stress/request/actions";
import { getSelectedRequest } from "../../store/stress/request/selectors";
import Spinner from "../../components/Spinner";

function getOptions(latency: LoadsterResponse[]) {
  const keyToMap = ["mean", "median", "p99", "p75", "stddev"];
  return {
    legend: {
      data: keyToMap,
    },
    xAxis: {
      data: latency?.map((item) => {
        const someTime = utcToZonedTime(
          item.created * 1000,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );
        return format(someTime, "HH:mm:ss");
      }),
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      type: "value",
    },
    series: keyToMap.map((key) => ({
      name: key,
      data: latency?.map((item) => item[key]?.toFixed()),
      type: "line",
    })),
  };
}

function getRps(latency: LoadsterResponse[]) {
  const clculateRPS = (item: LoadsterResponse, rps: number) => {
    const endTime = item.created;
    const { startTime } = item;
    return (rps / (endTime - startTime)).toFixed();
  };
  const keyToMap = ["count"];
  return {
    legend: {
      data: keyToMap,
    },
    xAxis: {
      data: latency?.map((item) => {
        const someTime = utcToZonedTime(
          item.created * 1000,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );
        return format(someTime, "HH:mm:ss");
      }),
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      type: "value",
    },
    series: keyToMap.map((key) => ({
      name: key,
      data: latency?.map((item) => clculateRPS(item, item[key])),
      type: "line",
    })),
  };
}

function Request({
  requestId,
  request,
}: {
  requestId: string;
  request: RequestHistoryPayload;
}) {
  const dispatch = useDispatch();
  const data = useSelector(getLoadsterList);

  const latencyData = useMemo(
    () => data?.data?.filter((r) => r.type === "histogram"),
    [data?.data]
  );
  const isFinish = data?.data?.filter((item) => item.finish);
  useInterval(
    () => {
      if (requestId) {
        dispatch(getLoadsterAction({ reqId: requestId }));
      }
    },
    isFinish?.length ? null : 3000
  );

  useEffect(() => {
    if (requestId) {
      dispatch(getLoadsterAction({ reqId: requestId }));
    }
  }, [requestId]);

  if (!data?.data) return null;

  const getLatencyOption = getOptions(latencyData || []);
  const getRPSOption = getRps(latencyData || []);

  return (
    <Stack direction="row" w="100%" bg="white">
      <Box width="full" height="full" bg="white" p={10} pt={5}>
        <Stats isMainPage selectedRequest={request} />
        <AccordianArea title="Response Times (ms)" margin={2}>
          <ELoadChart options={getLatencyOption} />
        </AccordianArea>
        <AccordianArea title="RPS success/failure" margin={2}>
          <ELoadChart options={getRPSOption} />
        </AccordianArea>
      </Box>
    </Stack>
  );
}

export default function RequestWraper() {
  const dispatch = useDispatch();
  const { requestId } = useParams();
  const { data, loading } = useSelector(getSelectedRequest);

  useEffect(() => {
    if (requestId) {
      dispatch(getRequestByIdAction({ reqId: requestId }));
    }
  }, [requestId]);

  if (!data && loading) {
    return <Spinner />;
  }
  if (data && requestId) {
    return <Request requestId={requestId} request={data} />;
  }
  return null;
}
