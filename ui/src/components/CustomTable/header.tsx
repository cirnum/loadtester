import { Box, Flex, Text } from "@chakra-ui/react";
import { RequestBodyHeadings } from "../constants";

interface IItem {
  isChecked?: boolean;
}
export default function Item({ isChecked = true }: IItem) {
  return (
    <Flex color="black">
      {isChecked && (
        <Box
          boxSize="24px"
          sx={{
            border: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: "1rem",
          }}
          width="10%"
        >
          <Text as="b" fontSize="sm" color="gray.500">
            #
          </Text>
        </Box>
      )}

      {RequestBodyHeadings.map((value) => {
        return (
          <Box
            key={value}
            boxSize="24px"
            sx={{
              border: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            width="50%"
          >
            <Text as="b" fontSize="sm" color="gray.500">
              {value}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
}
