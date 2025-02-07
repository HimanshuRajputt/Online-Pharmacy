import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  Divider,
  Flex,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItem } = useCart();
  const toast = useToast();

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const estimatedTax = subtotal * 0.05; // Assuming 5% tax
  const total = subtotal + estimatedTax;

  return (
    <Flex h="100vh" mx="auto" p={6} gap={8}>
      {/* Left Side: Cart Items */}
      <Box flex="2" bg="white" p={6} borderRadius="lg" boxShadow="md">
        <Heading size="lg" mb={4}>
          Your Shopping Cart
        </Heading>

        {cartItems.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            Your cart is empty.
          </Text>
        ) : (
          <VStack spacing={6} align="stretch" maxH="80%" overflowY="auto">
            {cartItems.map((item) => (
              <Flex
                key={item.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                align="center"
                justify="space-between"
                bg="gray.50"
              >
                <HStack spacing={4}>
                  <Image
                    src={item.img || "https://via.placeholder.com/80"}
                    alt={item.name}
                    boxSize="80px"
                    borderRadius="md"
                    objectFit="cover"
                  />
                  <Box>
                    <Text fontSize="md" fontWeight="bold">
                      {item.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Price: ₹{item.price.toFixed(2)}
                    </Text>
                  </Box>
                </HStack>

                <HStack>
                  <IconButton
                    icon={<FaMinus />}
                    size="sm"
                    colorScheme="blue"
                    isDisabled={item.quantity <= 1}
                    onClick={() => updateCartItem(item.id, item.quantity - 1)}
                  />
                  <Text fontSize="md" fontWeight="bold">
                    {item.quantity}
                  </Text>
                  <IconButton
                    icon={<FaPlus />}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => updateCartItem(item.id, item.quantity + 1)}
                  />
                </HStack>

                <IconButton
                  icon={<FaTrash />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => {
                    removeFromCart(item.id);
                    toast({
                      title: "Item Removed",
                      description: `${item.name} has been removed from your cart.`,
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                />
              </Flex>
            ))}
          </VStack>
        )}
      </Box>

      {/* Right Side: Order Summary */}
      <Box flex="1" bg="white" p={6} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={4}>
          Order Summary
        </Heading>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Text>Subtotal:</Text>
            <Text fontWeight="bold">₹{subtotal.toFixed(2)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Estimated Tax (5%):</Text>
            <Text fontWeight="bold">₹{estimatedTax.toFixed(2)}</Text>
          </HStack>
          <Divider />
          <HStack justify="space-between" fontSize="lg">
            <Text fontWeight="bold">Total:</Text>
            <Text fontWeight="bold" color="green.500">
              ₹{total.toFixed(2)}
            </Text>
          </HStack>
          <Button colorScheme="green" w="full" mt={4}>
            Proceed to Checkout
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Cart;
