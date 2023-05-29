import { Center } from "@chakra-ui/react";
import React from "react";

export default function StatusInfo({
  positive,
  text,
}: {
  positive: boolean;
  text: string;
}) {
  const bgColor = positive ? "#D9F2E8" : "tomato.100";
  const borderAndText = positive ? "##00945F" : "tomato";

  return (
    <Center
      bg={bgColor}
      color={borderAndText}
      border="1px"
      borderColor={borderAndText}
      borderRadius="4px"
      height="32px"
      padding="6px 12px"
      alignItems="center"
    >
      {text}
    </Center>
  );
}
