import { useState } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import ImportCurl from "./importCurl";
import ImportCookies from "./importCookies";
import RequestSettings from "./requestsetting";
import CustomModal from "../../../../components/Modal";

export function OtherOption() {
  const tabList = ["Import Curl", "Cookies", "Settings"];
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Button colorScheme="tomato" size="md" onClick={() => setOpen(true)}>
        Options
      </Button>
      <CustomModal onClose={() => setOpen(false)} isOpen={open}>
        <CustomModal.Header>
          <Text color="#837F9D">Advance Options</Text>
        </CustomModal.Header>
        <CustomModal.Body>
          <Tabs color="grey" paddingTop="12px">
            <TabList>
              {tabList.map((tab) => (
                <Tab fontWeight="bold" fontSize="14px">
                  {tab}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              <TabPanel>
                <ImportCurl setOpen={setOpen} />
              </TabPanel>
              <TabPanel>
                <ImportCookies setOpen={setOpen} />
              </TabPanel>
              <TabPanel>
                <RequestSettings />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CustomModal.Body>
        <CustomModal.Footer>
          <Button colorScheme="gray" onClick={() => setOpen(false)}>
            Close
          </Button>
        </CustomModal.Footer>
      </CustomModal>
    </Box>
  );
}
