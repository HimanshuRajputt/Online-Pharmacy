import { useState } from "react";
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
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cartItems } = useCart();
  // eslint-disable-next-line no-unused-vars
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Button as={Link} to="/login" colorScheme="white" variant="ghost">
            Login
          </Button>
          <Button as={Link} to="/dashboard" colorScheme="white" variant="ghost">
            Dashboard
          </Button>
          <Button
            as={Link}
            to="/cart"
            colorScheme="white"
            variant="ghost"
            leftIcon={<FiShoppingCart />}
          >
            Cart{" "}
            <Badge rounded="xl" position="absolute" right="1" top="-1"  ml={2} colorScheme="red">
              {cartItems.length}
            </Badge>
          </Button>
        </Flex>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "block", md: "none" }}
          icon={isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </Flex>

      {/* Mobile Drawer Menu */}
      <Drawer placement="right" onClose={onClose} isOpen={isMenuOpen}>
        <DrawerOverlay />
        <DrawerContent bg="blue.700">
          <DrawerCloseButton onClick={() => setIsMenuOpen(false)} />
          <DrawerBody>
            <VStack spacing={4} mt={10}>
              <Button
                as={Link}
                to="/"
                colorScheme="whiteAlpha"
                onClick={onClose}
              >
                Home
              </Button>
              <Button
                as={Link}
                to="/login"
                colorScheme="whiteAlpha"
                onClick={onClose}
              >
                Login
              </Button>
              <Button
                as={Link}
                to="/dashboard"
                colorScheme="whiteAlpha"
                onClick={onClose}
              >
                Dashboard
              </Button>
              <Button
                as={Link}
                to="/cart"
                colorScheme="whiteAlpha"
                leftIcon={<FiShoppingCart />}
                onClick={onClose}
              >
                Cart{" "}
                <Badge ml={2} colorScheme="red">
                  {cartItems.length}
                </Badge>
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
