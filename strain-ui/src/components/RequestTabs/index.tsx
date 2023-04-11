import { useState } from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  getSelectedRequestHeaders,
  getSelectedRequestParams,
} from "../../store/stress/dashboard/selectors";
import {
  addRequestHeaderAction,
  addRequestParamsAction,
  userClickCheckBoxAction,
} from "../../store/stress/dashboard/actions";
import CustomTable from "../CustomTable";
import RequestBody from "./RequestBody";
import { RequestHeadersAndParamsPayload } from "../../store/stress/dashboard/types";

function RequestHeaders() {
  const params = useSelector(getSelectedRequestHeaders);
  const dispatch = useDispatch();
  const addParams = (payload: RequestHeadersAndParamsPayload) => {
    dispatch(addRequestHeaderAction(payload));
  };
  const isCheckClicked = (position: number, isChecked: boolean) => {
    const payload = { position, isChecked, type: "requestHeader" };
    dispatch(userClickCheckBoxAction(payload));
  };
  return (
    <CustomTable
      params={params}
      addKeyValue={addParams}
      onCheckClick={isCheckClicked}
    />
  );
}

function RequestParams() {
  const headers = useSelector(getSelectedRequestParams);
  const dispatch = useDispatch();
  const addParams = (payload: RequestHeadersAndParamsPayload) => {
    dispatch(addRequestParamsAction(payload));
  };
  const isCheckClicked = (position: number, isChecked: boolean) => {
    const payload = { position, isChecked, type: "requestParams" };
    dispatch(userClickCheckBoxAction(payload));
  };
  return (
    <CustomTable
      params={headers}
      addKeyValue={addParams}
      onCheckClick={isCheckClicked}
    />
  );
}

export default function RequestTabs() {
  const TABS = ["Params", "Headers", "Body"];
  const [, setTabIndex] = useState(0);
  return (
    <Tabs onChange={(index) => setTabIndex(index)} w="100%">
      <TabList>
        {TABS.map((value) => (
          <Tab key={value}>{value}</Tab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>
          <RequestParams />
        </TabPanel>
        <TabPanel>
          <RequestHeaders />
        </TabPanel>
        <TabPanel>
          <RequestBody />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
