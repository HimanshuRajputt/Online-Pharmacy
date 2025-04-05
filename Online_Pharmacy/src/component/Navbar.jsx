import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Spacer,
  Button,
  IconButton,
  Heading,
  Badge,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  // useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { cartItems } = useCart();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { handleUserLogOut } = useContext(UserContext);

  // This ensures the navbar reacts to authentication changes
  const isLoggedIn = !!localStorage.getItem("authToken");
  const role= localStorage.getItem("role")
  // console.log(role)
  // Close mobile menu when changing routes
  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <Box bg="blue.600" px={6} py={4} color="white">
      <Flex align="center">
        <Heading as="h1" size="lg" letterSpacing="wide">
          <Link to="/">Online Pharmacy</Link>
        </Heading>

        <Spacer />

        {/* Desktop Menu */}
        <Flex display={{ base: "none", md: "flex" }} gap={6}>
          <Button as={Link} to="/" colorScheme="white" variant="ghost">
            Home
          </Button>
          {!isLoggedIn && (
            <Button as={Link} to="/login" colorScheme="white" variant="ghost">
              Login
            </Button>
          )}
          {isLoggedIn && role === "admin" ? (
            <Button
              as={Link}
              to="/AdminDashboard"
              colorScheme="white"
              variant="ghost"
            >
              AdminPanel
            </Button>
          ) : (
            ""
          )}
          {isLoggedIn && (
            <>
              <Button
                as={Link}
                to="/dashboard"
                colorScheme="white"
                variant="ghost"
              >
                Medicines
              </Button>

              <Button
                as={Link}
                to="/order-status"
                colorScheme="white"
                variant="ghost"
              >
                Orders
              </Button>

              <Button
                as={Link}
                to="/cart"
                colorScheme="white"
                variant="ghost"
                leftIcon={<FiShoppingCart />}
                position="relative"
              >
                Cart{" "}
                {cartItems.length > 0 && (
                  <Badge
                    rounded="xl"
                    position="absolute"
                    right="1"
                    top="-1"
                    ml={2}
                    colorScheme="red"
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
              <Button
                onClick={handleUserLogOut}
                as={Link}
                to="/"
                colorScheme="white"
                backgroundColor="red.500"
              >
                Logout
              </Button>
            </>
          )}
        </Flex>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "block", md: "none" }}
          icon={isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        />
      </Flex>

      {/* Mobile Drawer Menu */}
      <Drawer
        placement="right"
        onClose={() => setIsMenuOpen(false)}
        isOpen={isMenuOpen}
      >
        <DrawerOverlay />
        <DrawerContent
          // w="50%"
          maxW="200px"
          h={isLoggedIn ? "52%" : "28%"}
          borderRadius="2xl"
          bg="blue.600"
        >
          <DrawerCloseButton onClick={() => setIsMenuOpen(false)} />
          <DrawerBody>
            <VStack spacing={4} mt={8}>
              <Button
                as={Link}
                p="9%"
                to="/"
                colorScheme="whiteAlpha"
                onClick={handleMenuItemClick}
              >
                Home
              </Button>
              {!isLoggedIn && (
                <Button
                  as={Link}
                  to="/login"
                  p="9%"
                  colorScheme="whiteAlpha"
                  onClick={handleMenuItemClick}
                >
                  Login
                </Button>
              )}
              {isLoggedIn && (
                <>
                  <Button
                    as={Link}
                    to="/dashboard"
                    p="3%"
                    colorScheme="whiteAlpha"
                    onClick={handleMenuItemClick}
                  >
                    Medicines
                  </Button>
                  <Button
                    p="9%"
                    as={Link}
                    to="/order-status"
                    colorScheme="whiteAlpha"
                    onClick={handleMenuItemClick}
                  >
                    Orders
                  </Button>
                  <Button
                    p="9%"
                    as={Link}
                    to="/cart"
                    colorScheme="whiteAlpha"
                    leftIcon={<FiShoppingCart />}
                    onClick={handleMenuItemClick}
                    position="relative"
                  >
                    Cart{" "}
                    {cartItems.length > 0 && (
                      <Badge
                        rounded="xl"
                        position="absolute"
                        right="-0.1"
                        top="1"
                        ml={2}
                        colorScheme="red"
                      >
                        {cartItems.length}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      handleUserLogOut();
                      handleMenuItemClick();
                    }}
                    as={Link}
                    to="/"
                    p="9%"
                    colorScheme="white"
                    backgroundColor="red.500"
                  >
                    Logout
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
