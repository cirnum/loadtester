import { Flex, useColorModeValue } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import AddEditRequest from "./LoadRequest";

export default function Dashboard() {
  return (
    <Flex
      bg={useColorModeValue("white", "gray.900")}
      direction="row"
      minHeight="calc(100vh - 56px)"
    >
      <Sidebar />
      <AddEditRequest />
    </Flex>
  );
}
