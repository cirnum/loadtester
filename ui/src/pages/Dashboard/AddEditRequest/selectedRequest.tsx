import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Tag,
  Text,
  HStack,
  Button,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowForwardIcon, AddIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { getSelectedRequest } from "../../../store/stress/dashboard/selectors";
import { RestMethods } from "../../../store/stress/dashboard/types";
import RequestOptions from "./requestOptions";
import {
  addNewRequestAction,
  sendPayloadToSaga,
} from "../../../store/stress/dashboard/actions";
import MethodInfo from "../../../components/Info/MethodInfo";
import { InputWrap } from "./InputArea/inputWrap";
import Method from "./method";

export default function SelectedAddEditRequest() {
  const dispatch = useDispatch();
  const selectedRequest = useSelector(getSelectedRequest);

  const [method, setMethod] = useState<RestMethods>(
    selectedRequest?.method || "GET"
  );
  const [url, setURL] = useState<string>("");
  const [clients, setClients] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const parse = (val) => val.replace(/^\$/, "");

  useEffect(() => {
    setMethod(() => selectedRequest?.method || "GET");
  }, [selectedRequest?.id]);
  const sendRequest = () => {
    dispatch(
      sendPayloadToSaga({
        url,
        method,
        clients,
        time: seconds,
      })
    );
  };
  useEffect(() => {
    if (selectedRequest) {
      setClients(selectedRequest?.clients);
      setSeconds(selectedRequest?.time);
      setURL(selectedRequest?.url);
    }
  }, [selectedRequest]);

  const addNewRequest = () => {
    dispatch(addNewRequestAction());
    setClients(0);
    setSeconds(0);
    setURL("");
  };
  return (
    <Box w="full" borderRight="2px solid #e2e8f0">
      {selectedRequest && (
        <HStack m={2} justifyContent="space-between">
          <Stack alignItems="Center" direction="row">
            <MethodInfo>
              <Text fontSize="sm" color="tomato.700" as="b">
                {selectedRequest?.method}
              </Text>
            </MethodInfo>
            <Tag m={4}>{url}</Tag>
          </Stack>
          <Button colorScheme="gray" size="md" onClick={addNewRequest}>
            <AddIcon marginRight={3} /> New
          </Button>
        </HStack>
      )}
      <Divider />
      <HStack height="60px" borderBottom="1px solid #EBEBEB" paddingX="32px">
        <InputWrap flex={1} width="full">
          <Method method={method} setMethod={setMethod} />
          <ArrowDownIcon />
        </InputWrap>
        {/* <Box height="24px" borderLeft="2px solid #171239" /> */}
        <InputWrap flex={7}>
          <Input
            _focusVisible={{
              outline: "none",
              caretColor: "secondary.500",
            }}
            border="0"
            type="text"
            placeholder="Enter request url"
            onChange={(e) => setURL(e.target.value)}
            value={url}
          />
        </InputWrap>
        <InputWrap flex={2}>
          <Input
            _focusVisible={{
              outline: "none",
              caretColor: "secondary.500",
            }}
            flex={2}
            type="number"
            placeholder="Total Users"
            border="0"
            onChange={(e) => setClients(parse(e.target.value))}
            value={clients || ""}
          />
        </InputWrap>
        <InputWrap flex={2}>
          <Input
            _focusVisible={{
              outline: "none",
              caretColor: "secondary.500",
            }}
            flex={2}
            type="number"
            placeholder="Time in seconds"
            onChange={(e) => setSeconds(parse(e.target.value))}
            value={seconds || ""}
            border="0"
          />
        </InputWrap>
        <InputWrap flex={0.5} borderRight="0" padding="12px">
          <Button
            borderRadius="4px"
            colorScheme="primary"
            w="fit-content"
            size="md"
            rightIcon={<ArrowForwardIcon />}
            onClick={() => sendRequest()}
          >
            Send
          </Button>
        </InputWrap>
      </HStack>
      <RequestOptions />
    </Box>
  );
}
