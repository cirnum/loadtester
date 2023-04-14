import { Box, Divider } from "@chakra-ui/react";
import SelectedAddEditRequest from "../AddEditRequest/selectedRequest";
import { RequestStats } from "./requestStats";

export default function AddEditRequest() {
  return (
    <Box w="full" h="full" borderRight="2px solid #e2e8f0">
      <SelectedAddEditRequest />
      <Divider />
      <RequestStats />
    </Box>
  );
}
