import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { TRegisterPayload } from "../../types";
import { clearSingupState, singupAction } from "../../store/auth/actions";
import { getSignupState } from "../../store/auth/selectors";
// import { useToaster } from "../../utils/toast";

export default function SignupCard() {
  const navigate = useNavigate();
  // const toast = useToaster();
  const dispatch = useDispatch();
  const { data, loading } = useSelector(getSignupState);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmit, setSubmit] = useState(false);

  const [signupState, setSignupState] = useState<TRegisterPayload>({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
  });
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignupState((state) => ({ ...state, [name]: value }));
  };

  const validateEmail = (email: string) => {
    if (/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    if (data && !data?.error) {
      dispatch(clearSingupState());
      navigate("/signin");
    }
  }, [data?.error]);
  const onRegister = () => {
    if (
      !validateEmail(signupState.email) ||
      !signupState.password ||
      !signupState.firstName
    ) {
      setSubmit(true);
      return;
    }
    const paylod = {
      name: `${signupState.firstName} ${signupState.lastName}`,
      email: signupState.email,
      password: signupState.password,
    };
    dispatch(singupAction(paylod));
  };
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl" textAlign="center">
            Sign up
          </Heading>

          <Text fontSize="lg" color="gray.600">
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded="lg"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    errorBorderColor="crimson"
                    placeholder="Enter your Name."
                    onChange={onChange}
                    isInvalid={isSubmit && !signupState.firstName}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" name="lastName" onChange={onChange} />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                errorBorderColor="crimson"
                placeholder="Enter your Email."
                onChange={onChange}
                isInvalid={isSubmit && !validateEmail(signupState.email)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  isInvalid={isSubmit && !signupState.password}
                  errorBorderColor="crimson"
                  placeholder="Enter your password."
                  _placeholder={{ opacity: 0.6, color: "inherit" }}
                  onChange={onChange}
                />
                <InputRightElement h="full">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setShowPassword((showPasswordParam) => !showPasswordParam)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg="tomato"
                color="white"
                _hover={{
                  bg: "orange.500",
                }}
                onClick={onRegister}
              >
                {loading ? <Spinner size="md" /> : "Sign up"}
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align="center">
                Already a user?{" "}
                <RouterLink to="/signin">
                  <Button as="a" variant="link" color="tomato">
                    Login
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
