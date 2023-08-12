import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  useColorModeValue,
  Divider,
  Box,
} from "@chakra-ui/react";
import { ReactNode } from "react";

export default function CustomTable({
  headers,
  children,
}: {
  headers: { name: string; isNumaric?: boolean }[];
  children: ReactNode;
}) {
  const textColor = useColorModeValue("white", "grey.700");

  return (
    <Box overflow="scroll">
      <TableContainer overflow="scroll">
        <Divider />
        <Table bg={textColor} size="md">
          <Thead>
            <Tr>
              {headers.map(({ name }) => {
                return <Th key={name}>{name}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>{children}</Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
