import React from "react";
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
  Tag
} from "@chakra-ui/react";
import { TRequest } from "../../types";

export default function CustomTable({
  headers,
  data,
}: {
  headers: { name: string; isNumaric?: boolean }[];
  data: TRequest[];
}) {
  const textColor = useColorModeValue("white", "grey.700");

  return (
    <TableContainer>
      <Divider />
      <Table bg={textColor} size="lg" variant="simple">
        {/* <TableCaption placement="top">
          All the request made so far.
        </TableCaption> */}
        <Thead>
          <Tr>
            {headers.map(({ name, isNumaric = false }) => {
              return <Th>{name}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {data?.map(({ url, clients, time, requests }, index) => {
            return (
              <Tr>
                <Td> {index + 1} </Td>
                <Td>
                <Tag>
                      {url}
                      </Tag>
                
                </Td>
                <Td> {clients} </Td>
                <Td> {time} </Td>
                <Td> {requests} </Td>
                <Td>
                  <Button>Edit</Button>
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
