import { Stack } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import AddEditRequest from "./AddEditRequest";

export default function Dashboard() {
  return (
    <Stack direction="row" w="100%" bg="white" h="calc(100vh - 65px)">
      <Sidebar />
      <AddEditRequest />
    </Stack>
  );
}
