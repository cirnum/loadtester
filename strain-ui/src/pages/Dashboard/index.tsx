import { useState } from "react";
import { Button, Stack } from "@chakra-ui/react";
import { useStressedRequest } from "../../utils/query/stressedRequest";
import Table from "../../components/Table";
import Spinner from "../../components/Spinner";
import ErrorComp from "../../components/Error";
import Drawer from "../../components/Drawer";
import Request from "../StressRequest";

let headings = [
  { name: "Index" },
  { name: "Url" },
  { name: "Clients", isNumaric: true },
  { name: "Times", isNumaric: true },
  { name: "Result" },
  { name: "Edit" },
  // { name: "Delete" },
];
const pagination = { page: 1, limit: 10 };
export default function Dashboard() {
  const [drawerState, setDrawerState] = useState<boolean>(true);
  const { isLoading, isError, data, error } = useStressedRequest(pagination);

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    <ErrorComp message={(error as Error)?.message} />;
  }
  return (
    <>
      <Stack
        direction="row"
        w="100%"
        height="60px"
        bg="white"
        justifyContent="end"
        align="center"
        p={5}
      >
        <Button colorScheme="blue" onClick={() => setDrawerState(true)}>Add New Request</Button>
      </Stack>
      <Drawer isOpen={drawerState} onClose={() => setDrawerState(false)} title="Add New Request" >
        <Request />
       </Drawer>
      <Table headers={headings} data={data?.data || []} />
    </>
  );
}
