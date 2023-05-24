import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Box,
  Button,
  Stat,
} from "@chakra-ui/react";
import { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { Stats } from "../../../components/Stats";
import { StatFields, WorkerFields } from "../../../constants/request.const";
import { useInterval } from "../../../hooks/useInterval";
import { getLoadsterAction } from "../../../store/stress/dashboard/actions";
import {
  getLoadsterData,
  getLoadsterList,
  getSelectedRequest,
  getSelectedRequestId,
} from "../../../store/stress/dashboard/selectors";

function ResponseTab({ children }: { children: ReactElement }) {
  const [, setTabIndex] = useState(0);
  return (
    <Tabs onChange={(index) => setTabIndex(index)} w="100%">
      <TabList color="grey">
        {["Request Status", "Worker Status", "Worker Stats"].map((value) => (
          <Tab key={value} fontWeight="bold" fontSize="12px">
            {value}
          </Tab>
        ))}
      </TabList>
      {children}
    </Tabs>
  );
}

export function RequestStats({
  selectedRequestId,
}: {
  selectedRequestId: string;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loadsterRespons = useSelector(getLoadsterList);
  const selectedRequest = useSelector(getSelectedRequest);
  const isFinish = loadsterRespons?.finish;

  const getWorkerByServerId = (id) => {
    const server = loadsterRespons?.workers?.find(
      (worker) => id === worker.serverId
    );
    if (server) {
      return server;
    }
    return {
      server: {
        alias: "Master",
      },
    };
  };
  useInterval(
    () => {
      dispatch(getLoadsterAction({ reqId: selectedRequestId }));
    },
    isFinish ? null : 3000
  );

  return (
    <Box w="full" borderRight="2px solid #e2e8f0">
      <ResponseTab>
        <TabPanels>
          <TabPanel>
            {selectedRequestId && selectedRequest && (
              <Box w="full" p={10} borderRight="2px solid #e2e8f0">
                <Text fontWeight="bold" pb={5}>
                  Request Status
                </Text>

                <Stats fieldsToPopulate={StatFields} data={loadsterRespons}>
                  <Stat display="flex" alignItems="center">
                    <Button
                      onClick={() =>
                        navigate(`/request/${selectedRequest?.id}`)
                      }
                    >
                      View In Details
                    </Button>
                  </Stat>
                </Stats>
              </Box>
            )}
          </TabPanel>
          <TabPanel>
            <Box w="full" pl={10} pr={10} borderRight="2px solid #e2e8f0">
              {loadsterRespons?.workers.map((worker) => {
                const newWorker = { ...worker.server, ...worker };
                return (
                  <Stats fieldsToPopulate={WorkerFields} data={newWorker} />
                );
              })}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box w="full" pl={10} pr={10} borderRight="2px solid #e2e8f0">
              {Object.values(loadsterRespons?.serverMap || [])?.map(
                (server) => {
                  const serverDetails = {
                    ...getWorkerByServerId(server.serverId)?.server,
                    ...server,
                  };
                  return (
                    <Stats fieldsToPopulate={StatFields} data={serverDetails} />
                  );
                }
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </ResponseTab>
    </Box>
  );
}

export function RequestLoadsterData() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(getLoadsterData);
  const selectedRequestId = useSelector(getSelectedRequestId);
  useEffect(() => {
    if (selectedRequestId) {
      dispatch(getLoadsterAction({ reqId: selectedRequestId }));
    }
  }, [selectedRequestId]);
  if (!data?.data && loading) {
    return <Spinner />;
  }
  if (selectedRequestId && data?.data) {
    return <RequestStats selectedRequestId={selectedRequestId} />;
  }
  return null;
}
