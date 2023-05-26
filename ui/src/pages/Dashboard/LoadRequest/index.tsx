import { Box, Divider } from "@chakra-ui/react";
import SelectedAddEditRequest from "../AddEditRequest/selectedRequest";
import { RequestLoadsterData } from "./requestStats";

export default function AddEditRequest() {
  return (
    <Box
      h="full"
      w="calc(100vw-20%)"
      minWidth="600px"
      borderRight="2px solid #e2e8f0"
      flex={7}
    >
      <SelectedAddEditRequest />
      <Divider />
      <RequestLoadsterData />
    </Box>
  );
}
