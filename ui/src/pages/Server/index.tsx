/* eslint-disable react/no-unused-prop-types */
import {
  TableContainer,
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
  Image,
  HStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  addOrEditServer,
  editServerAction,
  getAllServerAction,
  selectDeleteRequest,
  synWithMasterAction,
} from "../../store/stress/server/actions";
import {
  AddServerRequestPayload,
  Server,
} from "../../store/stress/server/types";
import Play from "../../assets/play.svg";
import Pause from "../../assets/pause.svg";

import {
  getAddServerState,
  getServerList,
  getSyncWithMasterLoader,
} from "../../store/stress/server/selectors";
import Spinner from "../../components/Spinner";
import { DeleteDialog } from "./DeleteRequest";
import AddOrEditComp from "./AddEdit";
import { CustomizeToolTipInfo } from "../Dashboard/AddEditRequest/selectedRequest";
import { getSettigs } from "../../store/stress/common/selectors";
import { paginationHandler } from "../../utils/_shared";
import { PAGINATION, ServerHeader } from "../../constants/_shared.const";
import ServerConfigComp from "./ViewConfig";

function TableBody({
  server,
}: {
  server: Server;
  _copy?: string;
  _onCopy?: (val: string) => void;
}) {
  const {
    id,
    alias,
    description,
    ip,
    updated_at: updatedAt,
    active,
    enabled,
  } = server;
  const dispatch = useDispatch();
  const [selectedServer, setSelected] = useState<Server | null>(null);
  const { loading } = useSelector(getAddServerState);
  const onEdit = (
    action: "ADD" | "EDIT" | "VIEW_CONFIG",
    serverDetails?: Server
  ) => {
    dispatch(
      addOrEditServer({
        actionState: action,
        server: serverDetails,
      })
    );
  };

  useEffect(() => {
    if (!loading && selectedServer) {
      setSelected(null);
    }
  }, [loading]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changeServerState = (serverState: Server) => {
    const payload = {
      ...serverState,
      enabled: !server.enabled,
    };
    setSelected(serverState);
    dispatch(editServerAction(payload as AddServerRequestPayload));
  };

  return (
    <Tr key={id}>
      <Td>
        <Text isTruncated>{alias}</Text>
      </Td>
      <Td>
        <Text isTruncated>{description}</Text>
      </Td>

      <Td>
        <Badge color={ip ? "grey" : "red"}>{ip || "Not connected"} </Badge>
      </Td>
      <Td>{format(updatedAt, "dd, MMM, Y, HH:MM")}</Td>
      <Td>
        <Badge colorScheme={active ? "green" : "red"}>
          {active ? "Connected" : "Disconnected"}
        </Badge>
      </Td>
      <Td>
        <Stack direction="row" display="flex" alignContent="center">
          {loading && selectedServer?.id === id ? (
            <SP />
          ) : (
            <CustomizeToolTipInfo
              text={enabled ? "Status: Running" : "Status: Stopped"}
            >
              <Image
                width="18px"
                height="18px"
                src={enabled ? Pause : Play}
                alt="loadster"
                cursor="pointer"
                onClick={() => changeServerState(server)}
              />
            </CustomizeToolTipInfo>
          )}
          <EditIcon cursor="pointer" onClick={() => onEdit("EDIT", server)} />
          <DeleteIcon
            cursor="pointer"
            onClick={() => dispatch(selectDeleteRequest(server))}
          />
          <ViewIcon
            cursor="pointer"
            onClick={() => onEdit("VIEW_CONFIG", server)}
          />
        </Stack>
      </Td>
    </Tr>
  );
}

export default function ServerBoard() {
  const { loading, data } = useSelector(getServerList);
  const syncLoading = useSelector(getSyncWithMasterLoader);
  const settings = useSelector(getSettigs);
  const [pagination, setPagination] = useState<typeof PAGINATION>(PAGINATION);
  const dispatch = useDispatch();

  const onOpen = (action: "ADD" | "EDIT", server?: Server) => {
    dispatch(
      addOrEditServer({
        actionState: action,
        server,
      })
    );
  };

  const paginate = (action: "next" | "prev") => {
    const total = data?.pagination?.total || 0;
    paginationHandler(action, total, pagination, setPagination);
  };

  useEffect(() => {
    if (!loading) {
      dispatch(getAllServerAction(pagination));
    }
  }, [pagination]);

  if (loading && !data?.data) {
    return <Spinner />;
  }
  return (
    <Box w="100%" bg="white" h="calc(100vh - 65px)" p={10}>
      <AddOrEditComp />
      <ServerConfigComp />
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
          <HStack gap={3}>
            Host:
            <Badge
              display="flex"
              fontSize="sm"
              variant="outline"
              colorScheme="primary"
              p="var(--chakra-radii-md)"
            >
              Host:
              <Text textTransform="lowercase"> {settings?.data?.hostUrl}</Text>
            </Badge>
            <Button
              size="sm"
              colorScheme="primary"
              variant="outline"
              onClick={() => dispatch(synWithMasterAction())}
            >
              {syncLoading ? <SP /> : "Sync With Master"}
            </Button>
            <Button size="sm" onClick={() => onOpen("ADD")}>
              Add New Server
            </Button>
          </HStack>
        </Stack>
        <Table
          variant="simple"
          size="md"
          __css={{ "table-layout": "fixed", width: "full" }}
        >
          <Thead>
            <Tr>
              {ServerHeader.map((item) => (
                <Th>{item}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data?.data?.map((server) => (
              <TableBody server={server} />
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
          <Button colorScheme="blue" onClick={() => paginate("prev")}>
            Prev
          </Button>
          <Button colorScheme="blue" onClick={() => paginate("next")}>
            Next
          </Button>
        </Stack>
      </TableContainer>
    </Box>
  );
}
