import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Stats } from "../../../../components/Stats";
import { WorkerFields } from "../../../../constants/request.const";
import { getLoadsterList } from "../../../../store/stress/dashboard/selectors";

export function WorkerState() {
  const loadsterRespons = useSelector(getLoadsterList);
  return (
    <Box w="full" pl={10} pr={10} borderRight="2px solid #e2e8f0">
      {loadsterRespons?.workers.map((worker) => {
        const newWorker = { ...worker.server, ...worker };
        return (
          <Stats
            fieldsToPopulate={WorkerFields}
            data={newWorker}
            key={worker.id}
          />
        );
      })}
    </Box>
  );
}
