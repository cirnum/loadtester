import React from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import History from "./history";

export default function Sidebar() {
  return (
    <Box w="20%" color="grey" h="full" borderRight="2px solid #e2e8f0">
      <Tabs isFitted>
        <TabList mb="1em">
          <Tab fontWeight="bold">History</Tab>
          <Tab fontWeight="bold">Collection</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <History />
          </TabPanel>
          <TabPanel>
            <History />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
