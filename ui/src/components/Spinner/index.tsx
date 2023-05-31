import { Stack, Spinner as SP, BoxProps } from "@chakra-ui/react";

export default function Spinner(props: BoxProps) {
  return (
    <Stack
      direction="row"
      height="400"
      display="flex"
      justifyContent="center"
      alignItems="center"
      spacing={4}
      {...props}
    >
      <SP size="xl" />
    </Stack>
  );
}
