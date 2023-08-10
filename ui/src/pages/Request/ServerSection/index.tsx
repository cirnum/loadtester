import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, HStack } from "@chakra-ui/react";
import Tabs from "../../../components/Tabs";
import { getLoadsterList } from "../../../store/stress/dashboard/selectors";
import CommonStats from "./commonStats";
import {
  LoadsterResponse,
  ServerMapData,
} from "../../../store/stress/dashboard/types";
import { ELoadChart } from "../../../components/Chart/Eline";
import {
  getLatencyOptions,
  getRps,
  getServerStatsOptions,
} from "../../../utils/chartOption";

function RPSChart({ servers }: { servers: Record<string, ServerMapData> }) {
  const getRPSOption = getRps(servers);
  return <ELoadChart options={getRPSOption} />;
}
function MapByServer({ server }: { server?: ServerMapData }) {
  const getLatencyOption = getLatencyOptions(server?.latency || []);
  return <ELoadChart options={getLatencyOption} />;
}
function MapServerStats({
  data,
  title,
}: {
  data: LoadsterResponse[];
  title: string;
}) {
  if (data.length < 1) return null;
  const getLatencyOption = getServerStatsOptions(data || [], title);

  return <ELoadChart options={getLatencyOption} />;
}

export default function ServerSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const data = useSelector(getLoadsterList);
  const serverNameList = Object.keys(data?.serverMap || {});
  const list = serverNameList?.map((serverName) => {
    const findWorker = data?.workers?.find((worker) => {
      return serverName === worker?.serverId;
    });
    if (findWorker) {
      return { id: findWorker.serverId, alias: findWorker.alias };
    }
    return { id: serverName, alias: serverName };
  });
  const selectedServer = selected && data?.serverMap?.[selected];

  useEffect(() => {
    if (serverNameList.length) {
      setSelected(serverNameList[0]);
    }
  }, []);

  if (!data?.serverMap) return null;

  return (
    <>
      <Card mx={5} mb={5} p={5}>
        <CommonStats data={data} />
      </Card>
      <Card mx={5}>
        <Tabs list={list} setSelected={setSelected} selected={selected}>
          <Card p={5}>
            {selectedServer && (
              <>
                <HStack width="full" gap={5} py={5}>
                  <RPSChart servers={data?.serverMap} />
                  <MapByServer server={selectedServer} />
                </HStack>
                <HStack width="full" gap={5} py={5}>
                  <MapServerStats
                    data={selectedServer.cpuUsage}
                    title="Cpu Usage (users)"
                  />
                  <MapServerStats
                    data={selectedServer.ramUsage}
                    title="Ram Usage %"
                  />
                </HStack>
                <HStack>
                  <MapServerStats
                    data={selectedServer.loadAvg}
                    title="Load Average over 1 min *100"
                  />
                  <MapServerStats
                    data={selectedServer.ingress}
                    title="Data Recieved Kbps"
                  />
                </HStack>

                <MapServerStats
                  data={selectedServer.outgress}
                  title="Data Transmitted Kbps"
                />
              </>
            )}
          </Card>
        </Tabs>
      </Card>
    </>
  );
}
