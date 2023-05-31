import { ReactNode } from "react";
import { Flex, useColorModeValue } from "@chakra-ui/react";

export default function Login({ children }: { children: ReactNode }) {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      {children}
    </Flex>
  );
}
