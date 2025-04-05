/* eslint-disable no-unused-vars */
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
  useMediaQuery,
} from "@chakra-ui/react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartItem, fetchCart } = useCart();
  const toast = useToast();
  const token = localStorage.getItem("authToken");

  // Check for mobile screens
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  // useEffect(() => {

  //   fetchCart();
  //   console.log(cartItems)
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);
  useEffect(() => {
    // Only fetch cart if token exists
    if (token) {
      fetchCart();

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [token]); // Add token as a dependency

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const estimatedTax = subtotal * 0.05;
  const total = subtotal + estimatedTax;

  const handleSubmit = (totalAmount) => {
    if (!window.Razorpay) {
      toast({
        title: "Error",
        description:
          "Razorpay SDK failed to load. Check your internet connection.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const userId = uuidv4();
    const trackingId = uuidv4();
    const status = "Processing";

    var options = {
      key: "rzp_test_mWVKJchEpzXZ2A",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Online Pharmacy",
      description: "For testing purpose",
      handler: function (response) {
        toast({
          title: "Payment Successful!",
          description: `Transaction ID: ${response.razorpay_payment_id}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        const transactionData = {
          userId,
          trackingId,
          transactionId: response.razorpay_payment_id,
          amount: totalAmount,
          status,
          timestamp: new Date().toISOString(),
        };

        axios
          .post(
            "https://online-pharmacy-backend.onrender.com/orders/place",
            transactionData,
            {
              headers: { token },
            }
          )
          .then(() => {
            toast({
              title: "Transaction Stored",
              description: "Transaction details saved successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            fetchCart();
            navigate("/order-status");
          })
          .catch((error) => {
            toast({
              title: "Error",
              description: "Failed to store transaction",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            console.error("Error storing transaction: ", error);
          });
      },
      prefill: {
        name: "Aadithyan",
        email: "adithyanas@gmail.com",
        contact: "8848673615",
      },
      notes: { address: "Ooruttambalam" },
      theme: { color: "#3399cc" },
    };

    const pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <Flex
      direction={isMobile ? "column" : "row"}
      h={isMobile ? "auto" : "100vh"}
      mx="auto"
      p={6}
      gap={8}
    >
      {/* Cart Items */}
      <Box
        flex="2"
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="md"
        w={isMobile ? "100%" : "auto"}
      >
        <Heading size="lg" mb={4} textAlign={isMobile ? "center" : "left"}>
          Your Shopping Cart
        </Heading>
        {cartItems.length === 0 ? (
          <Text textAlign="center" fontSize="lg">
            Your cart is empty.
          </Text>
        ) : (
          <VStack
            spacing={6}
            align="stretch"
            maxH="80%"
            overflowY="auto"
            maxW={isMobile ? "100%" : "auto"}
          >
            {cartItems.map((item, idx) => (
              <Flex
                key={idx}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                align="center"
                justify="space-between"
                bg="gray.50"
                flexDirection={isMobile ? "column" : "row"}
                textAlign={isMobile ? "center" : "left"}
              >
                <HStack spacing={8}>
                  <Image
                    src={item.product.imageUrl || ""}
                    alt={item.product.name}
                    boxSize="80px"
                    borderRadius="md"
                    objectFit="cover"
                  />
                  <Box>
                    <Text fontSize="md" fontWeight="bold">
                      {item.product.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Price: ₹{item.product.price}
                    </Text>
                  </Box>
                </HStack>
                <HStack>
                  <IconButton
                    icon={<FaMinus />}
                    size="sm"
                    colorScheme="blue"
                    isDisabled={item.quantity <= 1}
                    onClick={() =>
                      updateCartItem(item.product._id, item.quantity - 1)
                    }
                  />
                  <Text fontSize="md" fontWeight="bold">
                    {item.quantity}
                  </Text>
                  <IconButton
                    icon={<FaPlus />}
                    size="sm"
                    colorScheme="blue"
                    onClick={() =>
                      updateCartItem(item.product._id, item.quantity + 1)
                    }
                  />
                  <IconButton
                    icon={<FaTrash />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => removeFromCart(item.product._id)}
                  />
                </HStack>
              </Flex>
            ))}
          </VStack>
        )}
      </Box>

      {/* Order Summary */}
      <Box
        flex="1"
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="md"
        w={isMobile ? "100%" : "auto"}
      >
        <Heading size="md" mb={4} textAlign={isMobile ? "center" : "left"}>
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
          <Button
            onClick={() => handleSubmit(total.toFixed(2))}
            colorScheme="green"
            w="full"
            mt={4}
          >
            Proceed to Checkout
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Cart;
