import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  Button,
  Stack,
  Divider,
  Tag,
  Tooltip,
} from "@chakra-ui/react";
import { EditIcon, ViewIcon } from "@chakra-ui/icons";
import { RequestHistoryPayload } from "../../store/stress/dashboard/types";

export default function CustomTable({
  headers,
  data,
}: {
  headers: { name: string; isNumaric?: boolean }[];
  data: RequestHistoryPayload[];
}) {
  const textColor = useColorModeValue("white", "grey.700");

  return (
    <TableContainer>
      <Divider />
      <Table bg={textColor} variant="simple">
        {/* <TableCaption placement="top">
          All the request made so far.
        </TableCaption> */}
        <Thead>
          <Tr>
            {headers.map(({ name }) => {
              return <Th key="name">{name}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {data?.map(({ url, clients, time }, index) => {
            return (
              <Tr key={url}>
                <Td> {index + 1} </Td>
                <Td>
                  <Tag isTruncated>{url.slice(0, 60)}</Tag>
                </Td>
                <Td> {clients} </Td>
                <Td> {time} </Td>
                <Td gap="10">
                  <Tooltip label="Edit Request">
                    <EditIcon margin="3" />
                  </Tooltip>
                  <Tooltip label="View Result">
                    <ViewIcon />
                  </Tooltip>
                </Td>
              </Tr>
            );
          })}
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
  );
}
