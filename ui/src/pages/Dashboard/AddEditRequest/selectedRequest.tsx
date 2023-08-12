import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Divider,
  Tag,
  Text,
  HStack,
  Button,
  Input,
  Tooltip,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowForwardIcon,
  AddIcon,
  ArrowDownIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import {
  getSelectedRequest,
  getSendRequestLoadingState,
} from "../../../store/stress/dashboard/selectors";
import { RestMethods } from "../../../store/stress/dashboard/types";
import RequestOptions from "./requestOptions";
import {
  addNewRequestAction,
  sendPayloadToSaga,
} from "../../../store/stress/dashboard/actions";
import MethodInfo from "../../../components/Info/MethodInfo";
import { InputWrap } from "./InputArea/inputWrap";
import Method from "./method";
import { OtherOption } from "./OtherOptions";

export function CustomizeToolTipInfo({
  text,
  children,
}: {
  text: string;
  children?: ReactNode;
}) {
  return (
    <Tooltip
      hasArrow
      label={text}
      bg="white"
      color="#837F9D"
      padding="10px"
      fontWeight="500"
    >
      {children || <InfoOutlineIcon boxSize={3} cursor="pointer" margin={2} />}
    </Tooltip>
  );
}

export default function SelectedAddEditRequest() {
  const dispatch = useDispatch();
  const selectedRequest = useSelector(getSelectedRequest);
  const isLoading = useSelector(getSendRequestLoadingState);

  const [method, setMethod] = useState<RestMethods>(
    selectedRequest?.method || "GET"
  );
  const [url, setURL] = useState<string>("");
  const [clients, setClients] = useState<number>(0);
  const [qps, setQPS] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const parse = (val) => val.replace(/^\$/, "");

  useEffect(() => {
    setMethod(() => selectedRequest?.method || "GET");
  }, [selectedRequest?.id]);
  const sendRequest = () => {
    dispatch(
      sendPayloadToSaga({
        requestTimeout: Number(selectedRequest?.requestTimeout || 10),
        statusCodeIncludes: selectedRequest?.statusCodeIncludes,
        url,
        method,
        clients,
        time: seconds,
        qps,
      })
    );
  };
  useEffect(() => {
    if (selectedRequest) {
      setQPS(selectedRequest.qps || qps);
      setClients(selectedRequest?.clients || clients);
      setSeconds(selectedRequest?.time || seconds);
      setURL(selectedRequest?.url || url);
      setMethod(selectedRequest?.method || method);
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
          <MethodInfo>
            <Text fontSize="sm" color="tomato.700" as="b">
              {method || selectedRequest?.method}
            </Text>
          </MethodInfo>
          <Tag m={4}>{url}</Tag>
          <Spacer />
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
          <CustomizeToolTipInfo text="Number of concurrent users (default 10)" />
        </InputWrap>
        <InputWrap flex={2}>
          <Input
            _focusVisible={{
              outline: "none",
            }}
            flex={2}
            type="number"
            placeholder="Seconds"
            onChange={(e) => setSeconds(parse(e.target.value))}
            value={seconds || ""}
            border="0"
          />
          <CustomizeToolTipInfo text="Seconds to run (default 10s)" />
        </InputWrap>
        <InputWrap flex={2}>
          <Input
            _focusVisible={{
              outline: "none",
            }}
            flex={2}
            type="number"
            placeholder="QPS"
            onChange={(e) => setQPS(parse(e.target.value))}
            value={qps || ""}
            border="0"
          />
          <CustomizeToolTipInfo text="Query per seconds (optional)" />
        </InputWrap>
        <InputWrap
          flex={0.5}
          borderRight="0"
          padding="12px"
          display="flex"
          justifyContent="space-between"
          gap={2}
        >
          <Button
            borderRadius="4px"
            colorScheme="primary"
            w="fit-content"
            size="md"
            rightIcon={<ArrowForwardIcon />}
            onClick={() => sendRequest()}
          >
            {isLoading ? <Spinner /> : "Run"}
          </Button>
          <OtherOption />
        </InputWrap>
      </HStack>
      <RequestOptions />
    </Box>
  );
}
