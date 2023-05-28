import React from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import History from "./history";

export default function Sidebar() {
  return (
    <Box
      width="20%"
      minWidth="200px"
      maxWidth="300px"
      color="grey"
      borderRight="2px solid #e2e8f0"
    >
      <Tabs isFitted display="flex" flexDirection="column">
        <TabList mb="1em">
          <Tab fontWeight="bold" fontSize="14px">
            History
          </Tab>
          {/* <Tab fontWeight="bold" fontSize="14px">
            Collection
          </Tab> */}
        </TabList>
        <TabPanels>
          <TabPanel p={0} m={0}>
            <Box height="90vh" overflow="auto">
              <History />
            </Box>
          </TabPanel>
          {/* <TabPanel p={0}>
            <History />
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </Box>
  );
}
