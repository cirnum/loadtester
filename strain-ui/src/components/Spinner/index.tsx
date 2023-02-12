import { Stack, Spinner as SP } from "@chakra-ui/react";

export default function Spinner() {
  return (
    <Stack direction="row" spacing={4}>
      <SP size="xl" />
    </Stack>
  );
}
