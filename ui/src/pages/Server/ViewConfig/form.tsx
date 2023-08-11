// eslint-disable-next-line import/no-extraneous-dependencies
import {
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Table,
  Tr,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getServerConfig } from "../../../store/stress/server/selectors";
import { Server } from "../../../store/stress/server/types";
import { serverConfigAction } from "../../../store/stress/server/actions";
import Spinner from "../../../components/Spinner";

export default function AddOrEdit({ server }: { server?: Server }) {
  const { loading, data } = useSelector(getServerConfig);
  const dispatch = useDispatch();
  useEffect(() => {
    if (server?.ip) {
      dispatch(serverConfigAction({ ip: server?.ip }));
    }
  }, []);

  return (
    <TableContainer>
      {loading && <Spinner />}
      <Table variant="simple">
        <TableCaption>All this config get from worker</TableCaption>
        <Tbody>
          <Tr>
            <Th>PORT</Th>
            <Td fontWeight="bold">{data?.port}</Td>
          </Tr>
          <Tr>
            <Th>Master IP</Th>
            <Td>
              {data?.masterIp ? (
                <Badge
                  css={{ textTransform: "lowercase", fontWeight: "bold" }}
                  variant="outline"
                >
                  {data?.masterIp}
                </Badge>
              ) : (
                <Text color="tomato" fontWeight="bold" fontSize="14px">
                  Please Click on Sync with master
                </Text>
              )}
            </Td>
          </Tr>
          <Tr>
            <Td>Worker</Td>
            <Td>
              {data?.hostIp ? (
                <Badge
                  css={{ textTransform: "lowercase", fontWeight: "bold" }}
                  variant="outline"
                >
                  {data?.hostIp}
                </Badge>
              ) : (
                ""
              )}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
