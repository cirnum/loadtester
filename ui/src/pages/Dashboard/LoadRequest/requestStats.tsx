import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
  Text,
} from "@chakra-ui/react";
import { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoadsterAction } from "../../../store/stress/dashboard/actions";
import {
  getRequestResponseData,
  getSelectedRequestId,
} from "../../../store/stress/dashboard/selectors";
import RequestResponse from "./RequestRespons";
// import { WorkerState } from "./RequestStatus/workerState";
import ServerMap from "./RequestStatus/serverMap";
import RequestedStats from "./RequestedStats";

function ResponseTab({ children }: { children: ReactElement }) {
  const [, setTabIndex] = useState(0);
  const response = useSelector(getRequestResponseData);

  const list = ["Response", "Request Status", "Worker Stats"].filter((item) => {
    if (!response && item === "Response") {
      return false;
    }
    return true;
  });
  return (
    <Tabs onChange={(index) => setTabIndex(index)} w="100%">
      <TabList color="grey">
        {list.map((value) => (
          <Tab key={value} fontWeight="bold" fontSize="14px">
            <Text
              sx={{
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "20px",
              }}
              fontSize="sm"
              isTruncated
              fontWeight="medium"
              color="#171239"
            >
              {value}
            </Text>
          </Tab>
        ))}
      </TabList>
      {children}
    </Tabs>
  );
}

export function RequestStats() {
  const response = useSelector(getRequestResponseData);
  return (
    <Box w="full" borderRight="2px solid #e2e8f0" height="calc(100vh-600px)">
      <ResponseTab>
        <Box>
          <TabPanels>
            {response && (
              <TabPanel>
                <RequestResponse />
              </TabPanel>
            )}
            <TabPanel>
              <RequestedStats />
            </TabPanel>
            {/* <TabPanel>
              <WorkerState />
            </TabPanel> */}
            <TabPanel>
              <ServerMap />
            </TabPanel>
          </TabPanels>
        </Box>
      </ResponseTab>
    </Box>
  );
}

export function RequestLoadsterData() {
  const dispatch = useDispatch();
  const selectedRequestId = useSelector(getSelectedRequestId);
  useEffect(() => {
    if (selectedRequestId) {
      dispatch(getLoadsterAction({ reqId: selectedRequestId }));
    }
  }, [selectedRequestId]);

  if (!selectedRequestId) return null;
  return <RequestStats />;
}
