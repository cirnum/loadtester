import { Stack, Spinner as SP } from "@chakra-ui/react";

export default function Spinner() {
  return (
    <Stack
      direction="row"
      height="400"
      display="flex"
      justifyContent="center"
      alignItems="center"
      spacing={4}
    >
      <SP size="xl" />
    </Stack>
  );
}
