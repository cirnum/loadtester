import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

export default function OutlineButton(props: BoxProps) {
  return (
    <Box
      cursor="pointer"
      sx={{
        padding: "8px 12px",
        display: "flex",
        width: "fit-content",
        height: "36px",
        border: "1px",
        borderColor: "#EBEBEB",
        borderRadius: "40px",
        alignItems: "center",
        justifyContent: "center",
      }}
      {...props}
    />
  );
}
