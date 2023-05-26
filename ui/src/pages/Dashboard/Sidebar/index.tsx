import React from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import History from "./history";

export default function Sidebar() {
  return (
    <Box
      width="20%"
      color="grey"
      h="full"
      borderRight="2px solid #e2e8f0"
      flex={1}
    >
      <Tabs isFitted>
        <TabList mb="1em">
          <Tab fontWeight="bold" fontSize="12px">
            History
          </Tab>
          <Tab fontWeight="bold" fontSize="12px">
            Collection
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} m={0}>
            <History />
          </TabPanel>
          <TabPanel p={0}>
            <History />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
