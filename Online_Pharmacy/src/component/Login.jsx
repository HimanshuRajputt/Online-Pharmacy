import { useContext, useState } from "react";
import {
  Box,
  FormControl,
  Input,
  Button,
  Text,
  Flex,
  VStack,
  Heading,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Icon,
  useToast,
  Container,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { ViewIcon, ViewOffIcon, EmailIcon, LockIcon } from "@chakra-ui/icons";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useCart } from "../context/CartContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { handleUserLogin } = useContext(UserContext);
  const { fetchCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://online-pharmacy-backend.onrender.com/auth/login",
        { email, password }
      );
      // console.log(response.data.user.role)
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("authToken", response.data.token);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // handle login logout using local storage
      // localStorage.setItem("Login", "true");
      handleUserLogin();
      fetchCart();
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password.",
        error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      py={16}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgImage:
          'url(\'data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3C/g%3E%3C/svg%3E\')',
        bgSize: "24px 24px",
      }}
    >
      <Container marginTop="20" maxW="lg" position="relative">
        <VStack
          spacing={8}
          bg="white"
          boxShadow="2xl"
          rounded="xl"
          p={{ base: 6, md: 8 }}
          position="relative"
        >
          <VStack spacing={2} textAlign="center">
            <Icon viewBox="0 0 24 24" boxSize={12} color="purple.500">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
              />
            </Icon>
            <Heading
              fontSize="3xl"
              fontWeight="bold"
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
            >
              Welcome Back
            </Heading>
            <Text color="gray.500" fontSize="md">
              Sign in to access your account
            </Text>
          </VStack>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4} w="100%">
              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <EmailIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="gray.50"
                    borderColor="gray.300"
                    _hover={{ borderColor: "purple.400" }}
                    _focus={{
                      borderColor: "purple.500",
                      boxShadow: "0 0 0 1px purple.500",
                    }}
                    fontSize="md"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <LockIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="gray.50"
                    borderColor="gray.300"
                    _hover={{ borderColor: "purple.400" }}
                    _focus={{
                      borderColor: "purple.500",
                      boxShadow: "0 0 0 1px purple.500",
                    }}
                    fontSize="md"
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                      color="gray.400"
                      _hover={{ color: "purple.500" }}
                    >
                      <Icon
                        as={showPassword ? ViewOffIcon : ViewIcon}
                        boxSize={5}
                      />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                w="100%"
                size="lg"
                bgGradient="linear(to-r, #667eea, #764ba2)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, #764ba2, #667eea)",
                }}
                _active={{
                  bgGradient: "linear(to-r, #764ba2, #667eea)",
                }}
                fontSize="md"
                isLoading={isLoading}
                loadingText="Signing in..."
              >
                Sign In
              </Button>

              <Flex
                w="100%"
                justify="center"
                align="center"
                pt={4}
                borderTop="1px"
                borderColor="gray.100"
              >
                <Text fontSize="md" color="gray.600">
                  Do not have an account?{" "}
                  <Link to="/signup">
                    <Text
                      as="span"
                      color="purple.500"
                      _hover={{ textDecoration: "underline" }}
                      fontWeight="medium"
                    >
                      Sign up
                    </Text>
                  </Link>
                </Text>
              </Flex>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
