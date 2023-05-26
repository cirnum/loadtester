import { Card } from "@chakra-ui/react";
import SelectedAddEditRequest from "../AddEditRequest/selectedRequest";
import { RequestLoadsterData } from "./requestStats";

export default function AddEditRequest() {
  return (
    <Card
      h="full"
      minWidth="800px"
      borderRight="2px solid #e2e8f0"
      overflowX="scroll"
      flex={7}
    >
      <SelectedAddEditRequest />
      <RequestLoadsterData />
    </Card>
  );
}
