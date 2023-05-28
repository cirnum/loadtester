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
  Stack,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowForwardIcon, AddIcon } from "@chakra-ui/icons";
import { getSelectedRequest } from "../../../store/stress/dashboard/selectors";
import { RestMethods } from "../../../store/stress/dashboard/types";
import Method from "./method";
import RequestOptions from "./requestOptions";
import { sendPayloadToSaga } from "../../../store/stress/dashboard/actions";

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

  return (
    <Box w="full" borderRight="2px solid #e2e8f0">
      <HStack m={2} justifyContent="space-between">
        <Stack alignItems="Center" direction="row">
          <Text fontSize="sm" color="tomato.700" as="b">
            {selectedRequest?.method}
          </Text>
          <Tag m={4}>{url}</Tag>
        </Stack>

        {selectedRequest?.method && (
          <Button colorScheme="tomato" size="md">
            <AddIcon marginRight={2} /> New
          </Button>
        )}
      </HStack>
      <Divider />
      <HStack m={2}>
        <InputGroup display="flex" flexWrap="wrap">
          <InputLeftAddon>
            <Method method={method} setMethod={setMethod} />
          </InputLeftAddon>
          <Input
            flex={6}
            placeholder="Enter request url"
            value={url}
            onChange={(e) => setURL(e.target.value)}
          />
          <Input
            borderRadius="5px"
            mx={3}
            flex={2}
            type="number"
            placeholder="Total Users"
            value={clients || ""}
            onChange={(e) => setClients(parse(e.target.value))}
          />
          <Input
            mx={3}
            flex={2}
            type="number"
            placeholder="Time in seconds"
            value={seconds || ""}
            onChange={(e) => setSeconds(parse(e.target.value))}
          />
          <Button
            colorScheme="tomato"
            w="150px"
            size="md"
            mr={16}
            rightIcon={<ArrowForwardIcon />}
            value={url}
            onClick={() => sendRequest()}
          >
            Send
          </Button>
        </InputGroup>
      </HStack>
      <RequestOptions />
    </Box>
  );
}
