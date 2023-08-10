import { Box, Divider } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Stats } from "../../../../components/Stats";
import { StatFields } from "../../../../constants/request.const";
import { getLoadsterList } from "../../../../store/stress/dashboard/selectors";

export default function ServerMap() {
  const loadsterRespons = useSelector(getLoadsterList);
  const getWorkerByServerId = (id) => {
    const server = loadsterRespons?.workers?.find(
      (worker) => id === worker.serverId
    );
    if (server) {
      server.alias = server?.alias ? server?.alias : server?.id;
      return { server };
    }
    return {
      server: {
        alias: "Master",
      },
    };
  };
  return (
    <Box w="full" pl={10} pr={10} borderRight="2px solid #e2e8f0">
      {Object.values(loadsterRespons?.serverMap || [])?.map((server, index) => {
        const serverDetails = {
          ...getWorkerByServerId(server.serverId)?.server,
          ...server,
        };
        return (
          <>
            <Stats
              fieldsToPopulate={StatFields}
              data={serverDetails}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
            />
            <Divider mt={4} />
          </>
        );
      })}
    </Box>
  );
}
