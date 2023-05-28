import { Box, Heading, Text } from "@chakra-ui/react";
import { WarningTwoIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";

type InfoType = "warning" | "info" | "error";

function GetIcon({ type = "warning" }: { type?: InfoType }) {
  if (type === "info") return <InfoIcon boxSize="50px" color="blue.500" />;
  if (type === "warning")
    return <WarningTwoIcon boxSize="50px" color="orange.300" />;
  if (type === "error") return <CloseIcon boxSize="20px" color="white" />;
  return null;
}
export default function Warning({
  title = "Something went wrong.",
  message,
  type,
}: {
  title?: string;
  message?: string;
  type?: InfoType;
}) {
  return (
    <Box textAlign="center" py={10} px={6}>
      <GetIcon type={type} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {title || "Something went wrong."}
      </Heading>
      <Text color="gray.500">{message || ""}</Text>
    </Box>
  );
}
