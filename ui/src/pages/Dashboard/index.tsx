import { Box, useColorModeValue } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import AddEditRequest from "./LoadRequest";

export default function Dashboard() {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      height="calc(100vh - 65px)"
      display="flex"
      overflow="none"
      flexDirection="row"
    >
      <Sidebar />
      <AddEditRequest />
    </Box>
  );
}
