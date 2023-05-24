import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  Input,
  InputGroup,
  Select,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import TabComp from "../../components/RequestTabs";
import { TRestAPIMethods } from "../../types";
import NumberInput from "../../components/NumberInput";
import { METHODS_OPTION } from "../constants";

export default function RequestComp() {
  const [method, setMethod] = useState<TRestAPIMethods>("GET");
  const [url, setURL] = useState<string>("");
  const [clients, setClients] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  console.log(method, clients, seconds);

  const sendRequest = () => {};
  return (
    <Card>
      <CardBody>
        <InputGroup size="md" m={2}>
          <Select
            placeholder="Select option"
            width="100px"
            bg="gray.100"
            onChange={(e) => setMethod(e.target.value as TRestAPIMethods)}
          >
            {METHODS_OPTION.map((item) => (
              <option value={item.value} selected={item?.isSeleted || false}>
                {item.value}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Enter request url"
            value={url}
            onChange={(e) => setURL(e.target.value)}
          />
          <NumberInput
            placeholder="Clients"
            onChange={(e) => setClients(parseInt(e.target.value, 10))}
          />
          <NumberInput
            placeholder="Seconds"
            onChange={(e) => setSeconds(parseInt(e.target.value, 10))}
          />
          <Button
            colorScheme="blue"
            ml="20px"
            rightIcon={<ArrowForwardIcon />}
            value={url}
            onClick={() => sendRequest()}
          >
            Send
          </Button>
        </InputGroup>
        <TabComp />
      </CardBody>
    </Card>
  );
}
