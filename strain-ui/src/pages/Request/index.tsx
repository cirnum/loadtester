import { Box, Stack, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { useEffect } from "react";
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
  ServerMapData,
} from "../../store/stress/dashboard/types";
import { useInterval } from "../../hooks/useInterval";
import { getRequestByIdAction } from "../../store/stress/request/actions";
import { getSelectedRequest } from "../../store/stress/request/selectors";
import Spinner from "../../components/Spinner";
import { StatFields } from "../../constants/request.const";
import { Animate } from "../../components/Stats/Animation";

function getOptions(latency: LoadsterResponse[], index: number) {
  const keyToMap = ["mean", "median", "p99", "p75", "stddev"];
  return {
    legend: {
      data: keyToMap,
    },
    title: {
      subtext: `worker ${index + 1}`,
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

function getRps(latencyByServer: Record<string, ServerMapData>) {
  const servers = Object.values(latencyByServer);
  const aggregate: number[] = [];
  servers.forEach((data) => {
    data.latency.forEach((load, index) => {
      if (aggregate[index]) {
        aggregate[index] += load.rps;
      } else {
        aggregate[index] = load.rps;
      }
    });
  });
  const totalRPS = {
    name: "Total RPS",
    data: aggregate,
    type: "line",
  };
  const keyToMap = ["count"];
  return {
    legend: {
      data: keyToMap,
    },
    xAxis: {
      data: servers[0]?.latency?.map((item) => {
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
    series: [
      totalRPS,
      ...servers.map((server) => {
        return {
          name: `${server.serverId}`,
          data: server.latency?.map((item) => item.rps),
          type: "line",
        };
      }),
    ],
  };
}

function RPSChart({ servers }: { servers: Record<string, ServerMapData> }) {
  const getRPSOption = getRps(servers);
  return (
    <AccordianArea title="RPS success/failure" margin={2}>
      <ELoadChart options={getRPSOption} />
    </AccordianArea>
  );
}
function MapByServer({ servers }: { servers: Record<string, ServerMapData> }) {
  const serverList = Object.values(servers);
  if (serverList.length < 1) {
    return null;
  }
  return (
    <AccordianArea title="Response Times (ms)" margin={2}>
      <Stack direction="row">
        {serverList?.map((server, index) => {
          const getLatencyOption = getOptions(server.latency || [], index);
          return <ELoadChart options={getLatencyOption} />;
        })}
      </Stack>
    </AccordianArea>
  );
}
function Request({ requestId }: { requestId: string }) {
  const dispatch = useDispatch();
  const data = useSelector(getLoadsterList);

  const isFinish = data?.finish;
  useInterval(
    () => {
      if (requestId) {
        dispatch(getLoadsterAction({ reqId: requestId }));
      }
    },
    isFinish ? null : 3000
  );

  useEffect(() => {
    if (requestId) {
      dispatch(getLoadsterAction({ reqId: requestId }));
    }
  }, [requestId]);

  if (!data?.serverMap) return null;

  return (
    <Stack direction="row" w="100%" bg="white">
      <Box width="full" height="full" bg="white" p={10} pt={5}>
        <Stats fieldsToPopulate={StatFields} data={data}>
          <>
            <Stat borderRight="1px solid #e2e8f0" mr={2}>
              <StatLabel>Total Worker Running</StatLabel>
              <StatNumber>
                <Animate value={data.workers.length + 1} />
              </StatNumber>
            </Stat>
            <Stat borderRight="1px solid #e2e8f0" mr={2}>
              <StatLabel>Min-Max latency</StatLabel>
              <StatNumber>
                <Animate value={data.minLatency} />
                -
                <Animate value={data.maxLatency} /> ms
              </StatNumber>
            </Stat>
          </>
        </Stats>
        <MapByServer servers={data.serverMap} />
        <RPSChart servers={data.serverMap} />
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
    return <Request requestId={requestId} />;
  }
  return null;
}
