import { Box, Button, HStack, Input } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { InputWrap } from "./inputWrap";
import { getSelectedRequest } from "../../../../store/stress/dashboard/selectors";
import { RestMethods } from "../../../../store/stress/dashboard/types";
import { sendPayloadToSaga } from "../../../../store/stress/dashboard/actions";

export default function InputArea() {
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
    <HStack height="60px" borderBottom="1px solid #EBEBEB" paddingX="32px">
      <Box height="24px" borderLeft="2px solid #171239" />
      <InputWrap flex={7}>
        <Input
          _focusVisible={{
            outline: "none",
            caretColor: "secondary.500",
          }}
          border="0"
          type="number"
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
  );
}
