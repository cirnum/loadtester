import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { loginAction } from "../../store/auth/actions";
import { getAuthState } from "../../store/auth/selectors";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const user = useSelector(getAuthState);

  useEffect(() => {
    if (user) {
      login(user.data);
    }
  }, [user]);
  const handleSubmit = () => {
    dispatch(loginAction({ email, password }));
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx="auto" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Sign in to your account</Heading>
          <Text fontSize="lg" color="gray.600">
            to enjoy all of our cool{" "}
            <Link color="primary.400" href="/signin">
              features
            </Link>
            ✌️
          </Text>
        </Stack>
        <Box
          rounded="lg"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align="start"
                justify="space-between"
              >
                {/* <Checkbox>Remember me</Checkbox> */}
                {/* <Link color="blue.400" href="/forgot">
                  Forgot password?
                </Link> */}
              </Stack>

              <Button onClick={handleSubmit} colorScheme="primary">
                Sign in
              </Button>
              <Text align="center">
                Don&apos;t have an account?
                <RouterLink to="/signup">
                  {" "}
                  <Button as="a" variant="link" color="primary.400">
                    Signup
                  </Button>
                </RouterLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
