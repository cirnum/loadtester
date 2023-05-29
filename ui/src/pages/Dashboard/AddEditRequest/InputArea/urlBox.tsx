import { Box, HStack, Input } from "@chakra-ui/react";
import React from "react";
import { InputWrap } from "./inputWrap";

export function URLInput() {
  return (
    <HStack borderRight="1px solid #EBEBEB" flex={6} height="60px">
      <Box height="24px" borderLeft="2px solid #171239" />
      <InputWrap>
        <Input
          _focusVisible={{
            outline: "none",
            caretColor: "secondary.500",
          }}
          border="0"
          type="number"
          placeholder="Enter request url"
        />
      </InputWrap>
    </HStack>
  );
}
