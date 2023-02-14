import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
  Select,
  Text,
  Button,
} from "@chakra-ui/react";
import TabComp from "../../components/Tab";
import CustomTable from "../../components/CustomTable";
const METHODS = [{value: "GET", isSeleted: true }, {value: "POST"}, {value: "PUT"}, {value: "DELETE"}, { value: "PATCH" }]
const TABS = ["Params","Authorization","Headers", "Body"]

const fn = (value: string) => {
    if(value === "Params"){
        return <CustomTable />
    }
    return <>{value}</>
}
export default function RequestComp() {
  return (
    <Card>
      <CardBody>
        <InputGroup size="md">
            <Select placeholder="Select option" width="100px" bg="gray.100">
                {METHODS.map((item) => <option  value={item.value} selected={item?.isSeleted || false}>{item.value}</option>)}
            </Select>
          <Input placeholder="Enter request url" />
            <Button colorScheme="blue"  ml="20px"  rightIcon={<ArrowForwardIcon />} >Send</Button>
        </InputGroup>
        <TabComp tabs={TABS} tabPanel={TABS.map((value) => fn(value))} />
      </CardBody>
    </Card>
  );
}
