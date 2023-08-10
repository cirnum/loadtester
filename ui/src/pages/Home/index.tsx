import { Container, Heading, Stack, Text, Button, Box } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { WithSubnavigation } from "./Nav";
import FloatingButton from "./floatingButton";

export default function CallToActionWithIllustration() {
  return (
    <Box bg="white" height="100vh">
      <WithSubnavigation />
      <Container maxW="5xl">
        <Stack
          textAlign="center"
          align="center"
          spacing={{ base: 8, md: 10 }}
          py={{ base: 8, md: 14 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
            lineHeight="110%"
          >
            Open source tool for{" "}
            <Text as="span" color="primary.500">
              Stress Testing
            </Text>
          </Heading>
          <Text color="gray.500" maxW="2xl">
            Loadtester allows for the distribution of load tests across numerous
            computers, making it possible to simulate millions of concurrent
            users.
          </Text>
          <Stack spacing={6} direction="row">
            <RouterLink to="signin">
              <Button rounded="full" px={6} colorScheme="primary">
                Login
              </Button>
            </RouterLink>
            <RouterLink to="signup">
              <Button rounded="full" px={6}>
                Register
              </Button>
            </RouterLink>
          </Stack>
        </Stack>
        <FloatingButton />
      </Container>
    </Box>
  );
}
