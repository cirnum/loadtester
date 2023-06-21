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
  Spinner as SP,
  Badge,
  Image,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { Server } from "../../store/stress/server/types";

import { getAddServerState } from "../../store/stress/server/selectors";
import Spinner from "../../components/Spinner";
import {
  getEC2ServerAction,
  selectDeleteEC2,
  toggleEC2Form,
} from "../../store/stress/aws/actions";
import { getEC2List } from "../../store/stress/aws/selectors";
import { AWSEC2 } from "../../store/stress/aws/types";
import CreateEC2 from "./CreateEc2";
import { DeleteDialog } from "./DeleteEC2";
import { useInterval } from "../../hooks/useInterval";
import { getSettigs } from "../../store/stress/common/selectors";
import Warning from "../../components/Error";
import Creds from "../../assets/code.png";

const pagination = {
  limit: 25,
  page: 1,
};
const TableHeader = [
  "Instace Id",
  "Instance Type",
  "Public Ip",
  "Public DNS",
  "Status",
  "KeyName",
  "Last Update",
  "AMI",
  "Action",
];

function TableBody({
  server,
  copy,
  onCopy,
}: {
  server: AWSEC2;
  copy: string;
  onCopy: (val: string) => void;
}) {
  const {
    id,
    instanceType,
    instanceId,
    publicIp,
    publicDns,
    ec2State,
    keyName,
    imgId,
    updated_at: updatedAt,
  } = server;
  const dispatch = useDispatch();
  const [selectedServer, setSelected] = useState<Server | null>(null);
  const { loading } = useSelector(getAddServerState);

  useEffect(() => {
    if (!loading && selectedServer) {
      setSelected(null);
    }
  }, [loading]);

  return (
    <Tr key={id}>
      <Td>{instanceId}</Td>
      <Td>{instanceType}</Td>

      <Td
        cursor="pointer"
        color={copy === publicIp ? "green" : ""}
        onClick={() => onCopy(publicIp)}
      >
        {publicIp} {copy === publicIp ? <CheckIcon /> : <CopyIcon />}
      </Td>
      <Td>
        <Text isTruncated>{publicDns}</Text>
      </Td>
      <Td>
        <Badge colorScheme={ec2State === "running" ? "green" : "red"}>
          {ec2State}
        </Badge>
      </Td>
      <Td>
        <Text isTruncated>{keyName}</Text>
      </Td>
      <Td>
        <Text isTruncated>{imgId}</Text>
      </Td>
      <Td>
        <Text isTruncated>{format(updatedAt * 1000, "dd, MMM, Y, HH:MM")}</Text>
      </Td>
      <Td>
        <Button
          variant="outline"
          colorScheme="red"
          onClick={() => {
            dispatch(selectDeleteEC2(server));
          }}
        >
          Delete
        </Button>
      </Td>
    </Tr>
  );
}

export function ServerBoard() {
  const { loading, data } = useSelector(getEC2List);
  const [copy, setCopy] = useState<string>("");

  const isFinish = data?.data?.find((item) => {
    return item.ec2State === "pending";
  });
  const dispatch = useDispatch();

  useInterval(
    () => {
      dispatch(getEC2ServerAction(pagination));
    },
    !isFinish ? null : 3000
  );
  useEffect(() => {
    if (!data) {
      dispatch(getEC2ServerAction(pagination));
    }
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
      <CreateEC2 />
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
          <Button
            size="sm"
            onClick={() => {
              dispatch(toggleEC2Form(true));
            }}
          >
            Create EC2
          </Button>
        </Stack>
        <Table
          variant="simple"
          size="md"
          __css={{ "table-layout": "fixed", width: "full" }}
        >
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

export default function AWS() {
  const settings = useSelector(getSettigs);

  if (settings?.data?.isAwsAvailable) {
    return <ServerBoard />;
  }
  return (
    <Box
      bg="white"
      height="calc(100vh - 65px)"
      alignItems="center"
      display="flex"
      flexDirection="column"
    >
      <Warning
        type="warning"
        title="AWS credentials are missing."
        message={settings?.data?.awsErrorMessage}
      />
      <Image width="50%" src={Creds} />
    </Box>
  );
}
