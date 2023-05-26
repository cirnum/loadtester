import { Box } from "@chakra-ui/react";
import TabComp from "../../../components/RequestTabs";

export default function RequestOptions() {
  return (
    <Box h="300px" minWidth="800px" overflowX="scroll">
      <TabComp />
    </Box>
  );
}
