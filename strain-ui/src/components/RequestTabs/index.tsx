import { useState } from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useStore } from "../../utils/store/stressRequest";
import CustomTable from "../CustomTable";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import JSONInput from "react-json-ide";

function RequestParams() {
  const { params, addParams } = useStore();
  return <CustomTable params={params} addKeyValue={addParams} />;
}

function RequestHeader() {
  const { headers, addHeader } = useStore();
  return <CustomTable params={headers} addKeyValue={addHeader} />;
}

function RequestBody() {
  const { body, addBody } = useStore();
  const verifyData = (event: any) => {
    if (event.error) {
      return;
    }
    addBody(event.jsObject);
  };
  return (
    <JSONInput
      placeholder={body}
      id="a_unique_id"
      width="100%"
      onChange={verifyData}
      colors={{
        default: "black",
        background: "white",
        string: "blue",
        keys: "#800000"
      }}
      style={{
        outerBox: {
          border: "1px solid #e2e8f0"
        },
        contentBox: {
          color: "black",
        },
      }}
    />
  );
}

export default function RequestTabs() {
  const TABS = ["Params", "Headers", "Body"];
  const [_, setTabIndex] = useState(0);
  return (
    <Tabs onChange={(index) => setTabIndex(index)} mt={5}>
      <TabList>
        {TABS.map((value) => (
          <Tab>{value}</Tab>
        ))}
      </TabList>
      <TabPanels p="2rem">
        <TabPanel>
          <RequestParams />
        </TabPanel>
        <TabPanel>
          <RequestHeader />
        </TabPanel>
        <TabPanel>
          <RequestBody />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
