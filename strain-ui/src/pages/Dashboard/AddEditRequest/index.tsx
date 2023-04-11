import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Tag,
  Text,
  HStack,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { getSelectedRequest } from "../../../store/stress/dashboard/selectors";
import { RestMethods } from "../../../store/stress/dashboard/types";
import NumberInput from "../../../components/NumberInput";
import Method from "./method";
import RequestOptions from "./requestOptions";
import { sendPayloadToSaga } from "../../../store/stress/dashboard/actions";

export default function AddEditRequest() {
  const dispatch = useDispatch();
  const selectedRequest = useSelector(getSelectedRequest);
  const [method, setMethod] = useState<RestMethods>(
    selectedRequest?.method || "GET"
  );
  const [url, setURL] = useState<string>("");
  const [clients, setClients] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const parse = (val) => val.replace(/^\$/, "");

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

  return (
    <Box w="full" h="full" borderRight="2px solid #e2e8f0">
      <HStack m={4}>
        <Text fontSize="sm" color="tomato" as="b">
          {selectedRequest?.method}
        </Text>
        <Tag m={4}>{selectedRequest?.url}</Tag>
      </HStack>
      <Divider />
      <HStack m={4}>
        <InputGroup>
          <InputLeftAddon>
            <Method method={method} setMethod={setMethod} />
          </InputLeftAddon>
          <Input
            htmlSize={80}
            width="auto"
            placeholder="Enter request url"
            value={url}
            onChange={(e) => setURL(e.target.value)}
          />
          <NumberInput
            placeholder="Clients"
            value={clients}
            onChange={(e) => setClients(parse(e.target.value))}
          />
          <NumberInput
            value={seconds}
            placeholder="Seconds"
            onChange={(e) => setSeconds(parse(e.target.value))}
          />
        </InputGroup>

        <Button
          colorScheme="blue"
          ml="20px"
          w="200px"
          rightIcon={<ArrowForwardIcon />}
          value={url}
          onClick={() => sendRequest()}
        >
          Send
        </Button>
      </HStack>
      <RequestOptions />
    </Box>
  );
}
