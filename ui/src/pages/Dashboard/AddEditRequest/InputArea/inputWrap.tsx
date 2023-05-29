import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

export function InputWrap(props: FlexProps) {
  return (
    <Flex
      borderRight="1px solid #EBEBEB"
      height="full"
      alignItems="center"
      justifyContent="center"
      {...props}
    />
  );
}
