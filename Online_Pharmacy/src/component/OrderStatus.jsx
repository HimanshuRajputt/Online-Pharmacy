import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Text,
  VStack,
  // HStack,
  Icon,
  Progress,
  Container,
  Heading,
} from "@chakra-ui/react";
import {
  FaCheckCircle,
  FaShippingFast,
  FaTruck,
  FaBoxOpen,
} from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const statusSteps = [
  { name: "Processing", icon: FaCheckCircle },
  { name: "Shipped", icon: FaShippingFast },
  { name: "Out for Delivery", icon: FaTruck },
  { name: "Delivered", icon: FaBoxOpen },
];

const OrderStatus = () => {
  const [order, setOrder] = useState(null);
  const [statusIndex, setStatusIndex] = useState(0);

  // Fetch order details from Firebase
  useEffect(() => {
    axios
      .get("https://userstatus-9db86-default-rtdb.firebaseio.com/status.json")
      .then((response) => {
        const data = response.data;
        if (data) {
          const latestTransaction = Object.values(data).pop();
          setOrder(latestTransaction);
        }
      })
      .catch((error) => console.error("Error fetching status: ", error));
  }, []);

  // Simulate Order Progression (Every 5 Seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prevIndex) =>
        prevIndex < 3 ? prevIndex + 1 : prevIndex
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxW="lg" py={8}>
      <Heading size="lg" textAlign="center" mb={6}>
        Order Status
      </Heading>

      {order && (
        <Box
          bg="white"
          p={6}
          borderRadius="md"
          boxShadow="md"
          textAlign="center"
        >
          <Text fontSize="lg" fontWeight="bold">
            Transaction Details
          </Text>
          <Text>
            <strong>Transaction ID:</strong> {order.transactionId}
          </Text>
          <Text>
            <strong>Tracking ID:</strong> {order.trackingId}
          </Text>
          <Text>
            <strong>Amount:</strong> ₹{order.amount}
          </Text>
          <Text color="blue.500" fontWeight="bold">
            <strong>Status:</strong> {statusSteps[statusIndex].name}
          </Text>
        </Box>
      )}

      <VStack spacing={6} mt={8}>
        {statusSteps.map((step, index) => (
          <MotionBox
            key={index}
            display="flex"
            alignItems="center"
            gap={4}
            p={4}
            w="full"
            bg={index <= statusIndex ? "green.100" : "gray.100"}
            borderRadius="md"
            boxShadow="md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Icon
              as={step.icon}
              boxSize={6}
              color={index <= statusIndex ? "green.500" : "gray.500"}
            />
            <Text
              fontWeight="bold"
              color={index <= statusIndex ? "green.600" : "gray.600"}
            >
              {step.name}
            </Text>
          </MotionBox>
        ))}
      </VStack>

      {/* Progress Bar */}
      <Progress
        value={(statusIndex + 1) * 25}
        size="lg"
        colorScheme="green"
        mt={6}
        borderRadius="md"
      />
    </Container>
  );
};

export default OrderStatus;
