/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Progress,
  Container,
  Heading,
  Flex,
  Image,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useColorModeValue,
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
  { name: "Processing", icon: FaCheckCircle, color: "blue" },
  { name: "Shipped", icon: FaShippingFast, color: "purple" },
  { name: "Out for Delivery", icon: FaTruck, color: "orange" },
  { name: "Delivered", icon: FaBoxOpen, color: "green" },
];

// Map status from backend to our UI status
const getStatusIndex = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return 0;
    case "shipped":
      return 1;
    case "out for delivery":
      return 2;
    case "delivered":
      return 3;
    default:
      return 0;
  }
};

// Format date
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardBg = useColorModeValue("white", "gray.700");
  const token = localStorage.getItem("authToken");

  // Fetch all orders from the backend
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios
      .get("https://online-pharmacy-backend.onrender.com/orders/", {
        headers: { token },
      })
      .then((response) => {
        if (response.data.length > 0) {
          // Sort orders by timestamp (newest first)
          const sortedOrders = response.data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setOrders(sortedOrders);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8} centerContent>
        <Progress size="xs" isIndeterminate w="100%" colorScheme="blue" />
        <Text mt={4}>Loading your orders...</Text>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxW="container.xl" py={8} centerContent>
        <Heading size="lg" mb={6}>
          My Orders
        </Heading>
        <Box
          p={8}
          bg={cardBg}
          borderRadius="lg"
          boxShadow="md"
          textAlign="center"
        >
          <Icon as={FaBoxOpen} boxSize={12} color="gray.400" mb={4} />
          <Text fontSize="xl">You haven't placed any orders yet.</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={6}>
        My Orders
      </Heading>

      <Accordion allowMultiple defaultIndex={[0]}>
        {orders.map((order, orderIndex) => {
          const statusIndex = getStatusIndex(order.status);
          const totalItems = order.items.reduce(
            (acc, item) => acc + item.quantity,
            0
          );

          return (
            <AccordionItem
              key={order._id}
              mb={4}
              border="none"
              as={MotionBox}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: orderIndex * 0.1 }}
            >
              <Box
                bg={cardBg}
                borderRadius="lg"
                boxShadow="md"
                overflow="hidden"
                borderWidth="1px"
              >
                <AccordionButton _hover={{ bg: "gray.50" }} p={4}>
                  <Box flex="1" textAlign="left">
                    <Flex justify="space-between" align="center" wrap="wrap">
                      <HStack spacing={3}>
                        <Icon
                          as={statusSteps[statusIndex].icon}
                          color={`${statusSteps[statusIndex].color}.500`}
                          boxSize={6}
                        />
                        <Box>
                          <Text fontWeight="bold">
                            Order #{order.transactionId}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {formatDate(order.timestamp)}
                          </Text>
                        </Box>
                      </HStack>

                      <HStack>
                        <Badge
                          colorScheme={statusSteps[statusIndex].color}
                          fontSize="sm"
                          py={1}
                          px={2}
                          borderRadius="full"
                        >
                          {statusSteps[statusIndex].name}
                        </Badge>
                        <Text fontWeight="bold">₹{order.amount}</Text>
                      </HStack>
                    </Flex>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4} pt={0}>
                  <Box p={4}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Box>
                        <Text fontWeight="semibold" mb={2}>
                          Order Details
                        </Text>
                        <VStack align="start" spacing={1}>
                          <Text>
                            <strong>Transaction ID:</strong>{" "}
                            {order.transactionId}
                          </Text>
                          <Text>
                            <strong>Tracking ID:</strong> {order.trackingId}
                          </Text>
                          <Text>
                            <strong>Date:</strong> {formatDate(order.timestamp)}
                          </Text>
                          <Text>
                            <strong>Items:</strong> {totalItems}
                          </Text>
                          <Text>
                            <strong>Amount:</strong> ₹{order.amount}
                          </Text>
                        </VStack>
                      </Box>

                      <Box>
                        <Text fontWeight="semibold" mb={2}>
                          Delivery Status
                        </Text>
                        <VStack spacing={1} align="stretch">
                          {statusSteps.map((step, index) => (
                            <HStack
                              key={index}
                              opacity={index <= statusIndex ? 1 : 0.5}
                            >
                              <Icon
                                as={step.icon}
                                color={
                                  index <= statusIndex
                                    ? `${step.color}.500`
                                    : "gray.300"
                                }
                              />
                              <Text>{step.name}</Text>
                              {index === statusIndex && (
                                <Badge colorScheme={step.color} ml="auto">
                                  Current
                                </Badge>
                              )}
                            </HStack>
                          ))}
                        </VStack>
                        <Progress
                          value={(statusIndex + 1) * 25}
                          size="sm"
                          colorScheme={statusSteps[statusIndex].color}
                          mt={2}
                          borderRadius="full"
                        />
                      </Box>
                    </SimpleGrid>

                    <Divider my={4} />

                    <Text fontWeight="semibold" mb={2}>
                      Products
                    </Text>
                    <VStack spacing={4} align="stretch">
                      {order.items.map((item) => (
                        <Box
                          key={item._id}
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                          bg="gray.50"
                        >
                          <Flex
                            direction={{ base: "column", sm: "row" }}
                            align="center"
                          >
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              boxSize="80px"
                              objectFit="cover"
                              borderRadius="md"
                              mr={{ base: 0, sm: 4 }}
                              mb={{ base: 3, sm: 0 }}
                              fallbackSrc="https://via.placeholder.com/80"
                            />

                            <Box flex="1">
                              <Flex
                                justify="space-between"
                                wrap="wrap"
                                align="start"
                              >
                                <Box flex="1" mr={4}>
                                  <Text fontWeight="bold">
                                    {item.product.name}
                                  </Text>
                                  <Text fontSize="sm" color="gray.600">
                                    {item.product.brand}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    Category: {item.product.category}
                                  </Text>

                                  {item.product.prescriptionRequired && (
                                    <Badge
                                      colorScheme="red"
                                      fontSize="xs"
                                      mt={1}
                                    >
                                      Prescription Required
                                    </Badge>
                                  )}
                                </Box>

                                <StatGroup gap="10px">
                                  <Stat size="sm">
                                    <StatLabel>Price</StatLabel>
                                    <StatNumber>
                                      ₹{item.product.price}
                                    </StatNumber>
                                  </Stat>

                                  <Stat size="sm">
                                    <StatLabel>Qty</StatLabel>
                                    <StatNumber>{item.quantity}</StatNumber>
                                  </Stat>

                                  <Stat size="sm">
                                    <StatLabel>Total</StatLabel>
                                    <StatNumber>
                                      ₹{item.product.price * item.quantity}
                                    </StatNumber>
                                  </Stat>
                                </StatGroup>
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                      ))}
                    </VStack>

                    <Flex justify="flex-end" mt={4}>
                      <Box textAlign="right">
                        <Text fontSize="sm">Subtotal: ₹{order.amount}</Text>
                        <Text fontSize="sm">Shipping: ₹0</Text>
                        <Text fontWeight="bold">Total: ₹{order.amount}</Text>
                      </Box>
                    </Flex>
                  </Box>
                </AccordionPanel>
              </Box>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Container>
  );
};

export default OrderStatus;
