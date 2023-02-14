import { Box, Center, Flex, Square, Text } from "@chakra-ui/react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";

import React from "react";

const h = ["KEY", "VALUE"];
interface IItem {
  isChecked?: boolean;
}
export default function Item({ isChecked = true }: IItem) {
  return (
    <Flex
      color="black"
      sx={{
        height: "2rem",
      }}
    >
      {isChecked && (
        <Box
          sx={{
            border: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: "1rem",
          }}
          width="10%"
        >
          <Text as='b' fontSize="sm" color="gray.500">
            #
          </Text>
        </Box>
      )}

      {h.map((value) => {
        return (
          <Box
            sx={{
              border: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            width="50%"
          >
            <Text as='b' fontSize="sm" color="gray.500">
              {value}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
}
