import { Box, Stack, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ELoadChart } from "../../components/Chart/Eline";
import { Stats } from "../../components/Stats";
import { getLoadsterAction } from "../../store/stress/dashboard/actions";
import { getLoadsterList } from "../../store/stress/dashboard/selectors";
import { ServerMapData } from "../../store/stress/dashboard/types";
import { useInterval } from "../../hooks/useInterval";
import { getRequestByIdAction } from "../../store/stress/request/actions";
import { getSelectedRequest } from "../../store/stress/request/selectors";
import Spinner from "../../components/Spinner";
import { StatFields } from "../../constants/request.const";
import { Animate } from "../../components/Stats/Animation";
import { getLatencyOptions, getRps } from "../../utils/chartOption";

function RPSChart({ servers }: { servers: Record<string, ServerMapData> }) {
  const getRPSOption = getRps(servers);
  return (
    <Stack direction="row" paddingTop={5}>
      <ELoadChart options={getRPSOption} />
    </Stack>
  );
}
function MapByServer({ servers }: { servers: Record<string, ServerMapData> }) {
  const serverList = Object.values(servers);
  if (serverList.length < 1) {
    return null;
  }
  return (
    <Stack direction="row" paddingTop={5}>
      {serverList?.map((server) => {
        const getLatencyOption = getLatencyOptions(server.latency || []);
        return <ELoadChart options={getLatencyOption} />;
      })}
    </Stack>
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
