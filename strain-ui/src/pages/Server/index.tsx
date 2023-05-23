import {
  TableContainer,
  TableCaption,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Stack,
  Button,
  Text,
  Badge,
  Spinner as SP,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import {
  addOrEditServer,
  getAllServerAction,
  selectDeleteRequest,
} from "../../store/stress/server/actions";
import { Server } from "../../store/stress/server/types";

import { getServerList } from "../../store/stress/server/selectors";
import Spinner from "../../components/Spinner";
import { DeleteDialog } from "./DeleteRequest";
import AddOrEditComp from "./AddEdit";

const pagination = {
  limit: 10,
  page: 1,
};
const TableHeader = [
  "Server Alias",
  "Description",
  "IP",
  "Token",
  "Last Update",
  "Active",
  "Action",
];

function TableBody({
  server,
  copy,
  onCopy,
}: {
  server: Server;
  copy: string;
  onCopy: (val: string) => void;
}) {
  const {
    id,
    alias,
    description,
    ip,
    updated_at: updatedAt,
    active,
    port,
    token,
  } = server;
  const dispatch = useDispatch();
  const onEdit = (action: "ADD" | "EDIT", serverDetails?: Server) => {
    dispatch(
      addOrEditServer({
        actionState: action,
        server: serverDetails,
      })
    );
  };

  return (
    <motion.tr key={id} layout transition={{ duration: 0.5 }}>
      <Td>{alias}</Td>
      <Td>{description}</Td>

      <Td>
        <Badge color={ip ? "grey" : "red"}>
          {ip ? `${ip}${port ? `:${port}` : ""}` : "Not connected"}{" "}
        </Badge>
      </Td>
      <Td
        cursor="pointer"
        color={copy === token ? "green" : ""}
        onClick={() => onCopy(token)}
      >
        {token} {copy === token ? <CheckIcon /> : <CopyIcon />}
      </Td>
      <Td>{format(updatedAt * 1000, "dd, MMM, Y, HH:MM")}</Td>
      <Td>
        <Badge colorScheme={active ? "green" : "red"}>
          {active ? "Connected" : "Disconnected"}
        </Badge>
      </Td>
      <Td>
        <Stack direction="row" display="flex" alignContent="center">
          <DeleteIcon
            cursor="pointer"
            onClick={() => dispatch(selectDeleteRequest(server))}
          />
          <EditIcon cursor="pointer" onClick={() => onEdit("EDIT", server)} />
        </Stack>
      </Td>
    </motion.tr>
  );
}

export default function ServerBoard() {
  const { loading, data } = useSelector(getServerList);
  const [copy, setCopy] = useState<string>("");
  const dispatch = useDispatch();

  const onOpen = (action: "ADD" | "EDIT", server?: Server) => {
    dispatch(
      addOrEditServer({
        actionState: action,
        server,
      })
    );
  };

  useEffect(() => {
    dispatch(getAllServerAction(pagination));
  }, []);

  const onCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopy(() => text);
  };

  if (loading && !data?.data) {
    return <Spinner />;
  }
  return (
    <Box w="100%" bg="white" h="calc(100vh - 65px)" p={10}>
      <AddOrEditComp />
      <DeleteDialog />
      <TableContainer border="1px solid #f6f6f6">
        <Stack
          width="100%"
          direction="row"
          justifyContent="space-between"
          alignItems="Center"
          padding={3}
        >
          <Text fontSize="sm" fontWeight="bold">
            Server Details
          </Text>
          <Button size="sm" onClick={() => onOpen("ADD")}>
            Add New Server
          </Button>
        </Stack>
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              {TableHeader.map((item) => (
                <Th>{item}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {loading && (
              <TableCaption>
                <SP />
              </TableCaption>
            )}
            {data?.data?.map((server) => (
              <TableBody server={server} copy={copy} onCopy={onCopy} />
            ))}
          </Tbody>
        </Table>
        <Stack
          direction="row"
          w="100%"
          height="60px"
          bg="white"
          justifyContent="center"
          align="center"
        >
          <Button colorScheme="blue">Prev</Button>
          <Button colorScheme="blue">Next</Button>
        </Stack>
      </TableContainer>
    </Box>
  );
}
