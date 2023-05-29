import { Box, BoxProps } from "@chakra-ui/react";

export default function MethodInfo(props: BoxProps) {
  return (
    <Box
      sx={{
        borderRadius: "2px",
        padding: "4px 8px",
        height: "28px",
        width: "64px",
        background: "#F7ECE9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      {...props}
    />
  );
}
