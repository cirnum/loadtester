import { useState } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  getRequestStatusCodes,
  getRequestTimeout,
  getSelectedRequestCookies,
  getSelectedRequestHeaders,
  getSelectedRequestParams,
} from "../../store/stress/dashboard/selectors";
import {
  addRequestCookiesAction,
  addRequestHeaderAction,
  addRequestParamsAction,
  addRequestStatusCodes,
  addRequestTimeout,
  userClickCheckBoxAction,
} from "../../store/stress/dashboard/actions";
import CustomTable from "../CustomTable";
import RequestBody from "./RequestBody";
import { RequestHeadersAndParamsPayload } from "../../store/stress/dashboard/types";
import TagInput from "../InputWithChip";

function Settings() {
  const dispatch = useDispatch();
  const timeout = useSelector(getRequestTimeout);
  const requestStatusCodes = useSelector(getRequestStatusCodes);
  const onChange = (event: any) => {
    dispatch(addRequestTimeout(event.target.value));
  };
  const onStatusCodeChange = (data: number[]) => {
    dispatch(addRequestStatusCodes(data));
  };
  return (
    <Flex gap={4}>
      <FormControl flex={1}>
        <FormLabel>Request Timeout</FormLabel>
        <Input
          value={timeout || ""}
          placeholder="Request Timeout in secoonds ex - 10 default 10s"
          variant="filled"
          onChange={onChange}
        />
      </FormControl>
      <FormControl flex={1}>
        <FormLabel>Add Status codes to include</FormLabel>
        <TagInput
          defaultTags={requestStatusCodes}
          onChangeTags={onStatusCodeChange}
        />
      </FormControl>
    </Flex>
  );
}
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

function RequestCookies() {
  const params = useSelector(getSelectedRequestCookies);
  const dispatch = useDispatch();
  const addParams = (payload: RequestHeadersAndParamsPayload) => {
    dispatch(addRequestCookiesAction(payload));
  };
  const isCheckClicked = (position: number, isChecked: boolean) => {
    const payload = { position, isChecked, type: "requestCookies" };
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
  const TABS = ["Params", "Headers", "Body", "Cookies", "Advance Options"];
  const [, setTabIndex] = useState(1);
  return (
    <Tabs onChange={(index) => setTabIndex(index)} w="full">
      <TabList color="grey" paddingTop="12px">
        {TABS.map((value) => (
          <Tab key={value} fontWeight="bold" fontSize="14px">
            <Text
              sx={{
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#171239",
              }}
              fontSize="sm"
              isTruncated
              fontWeight="medium"
            >
              {value}
            </Text>
          </Tab>
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
        <TabPanel>
          <RequestCookies />
        </TabPanel>
        <TabPanel>
          <Settings />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
