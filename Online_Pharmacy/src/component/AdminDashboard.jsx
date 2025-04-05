import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  // Stack,
  Text,
  VStack,
  Select,
  useToast,
  Spinner,
  Divider,
  Badge,
  Flex,
  Icon,
  // Tag,
  // TagLabel,
  Container,
  Collapse,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaShoppingBag,
  FaUser,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState({});
  const toast = useToast();

  const token = localStorage.getItem("authToken"); // Get the admin token

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://online-pharmacy-backend.onrender.com/admin/users",
        {
          headers: { token },
        }
      );
      console.log(response.data)
      // Ensure each user has an orders array to prevent the mapping error
      const usersWithOrders = response.data.map((user) => ({
        ...user,
        orders: user.orders || [],
      }));
      setUsers(usersWithOrders);
    } catch (err) {
      toast({
        title: `Error fetching users: ${err.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    axios
      .patch(
        `https://online-pharmacy-backend.onrender.com/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { token },
        }
      )
      .then(() => {
        toast({
          title: "Order status updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        // Make sure orders is defined before mapping
        setUsers((prevUsers) =>
          prevUsers.map((user) => ({
            ...user,
            orders: user.orders
              ? user.orders.map((order) =>
                  order._id === orderId
                    ? { ...order, status: newStatus }
                    : order
                )
              : [],
          }))
        );
      })
      .catch((error) => {
        toast({
          title: "Failed to update order",
          status: "error",
          description: error.message,
          duration: 2000,
          isClosable: true,
        });
      });
  };

  const fetchUserOrders = async (userId) => {
    // Toggle expansion state
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));

    // Only fetch if we're expanding and there are no orders yet
    if (!expandedUsers[userId]) {
      try {
        const res = await axios.get(
          `https://online-pharmacy-backend.onrender.com/admin/orders/${userId}`,
          {
            headers: { token },
          }
        );
        console.log(res.data)
        // Ensure orders is an array
        const orders = Array.isArray(res.data) ? res.data : [];

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, orders } : user
          )
        );
      } catch (err) {
        toast({
          title: `Error fetching orders`,
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "yellow";
      case "Shipped":
        return "blue";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  if (loadingUsers) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text fontSize="lg" fontWeight="medium">
            Loading user data...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6} size="lg" color="gray.700">
        Admin Dashboard
      </Heading>
      <VStack spacing={6} align="stretch">
        {users.map((user) => (
          <Card
            key={user._id}
            boxShadow="sm"
            borderRadius="lg"
            overflow="hidden"
          >
            <CardHeader bg="blue.50" py={4}>
              <Flex alignItems="center">
                <Icon as={FaUser} boxSize={5} color="blue.500" mr={3} />
                <Box>
                  <Heading size="md" color="gray.700">
                    {user.name}
                  </Heading>
                  <Flex alignItems="center" mt={1}>
                    <Icon as={FaEnvelope} color="gray.500" boxSize={3} mr={2} />
                    <Text fontSize="sm" color="gray.500">
                      {user.email}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </CardHeader>
            <CardBody pt={4} pb={5}>
              <Button
                onClick={() => fetchUserOrders(user._id)}
                colorScheme="blue"
                size="sm"
                leftIcon={
                  expandedUsers[user._id] ? <FaChevronUp /> : <FaChevronDown />
                }
                mb={4}
                boxShadow="sm"
                rightIcon={<FaShoppingBag />}
              >
                {expandedUsers[user._id] ? "Hide Orders" : "View Orders"}
              </Button>

              <Collapse in={expandedUsers[user._id]} animateOpacity>
                {user.orders && user.orders.length > 0 ? (
                  <VStack spacing={4} align="stretch" mt={2}>
                    {user.orders.map((order) => (
                      <Box
                        key={order._id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        bg="white"
                        boxShadow="sm"
                      >
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                          mb={3}
                        >
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            color="gray.600"
                          >
                            Order: {order._id.substring(order._id.length - 8)}
                          </Text>
                          <Badge
                            colorScheme={getStatusColor(order.status)}
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {order.status}
                          </Badge>
                        </Flex>

                        <Divider my={2} />

                        <Flex flexWrap="wrap" gap={4} mt={3}>
                          <Box minW="120px">
                            <Text fontSize="xs" color="gray.500">
                              Amount
                            </Text>
                            <Text fontWeight="medium">₹{order.amount}</Text>
                          </Box>

                          <Box minW="120px">
                            <Text fontSize="xs" color="gray.500">
                              Tracking ID
                            </Text>
                            <Text fontWeight="medium" fontSize="sm">
                              {order.trackingId || "-"}
                            </Text>
                          </Box>

                          <Box minW="150px">
                            <Text fontSize="xs" color="gray.500">
                              Date
                            </Text>
                            <Text fontWeight="medium" fontSize="sm">
                              {new Date(order.timestamp).toLocaleString()}
                            </Text>
                          </Box>
                        </Flex>

                        <Box mt={4}>
                          <Text fontSize="xs" mb={1} color="gray.500">
                            Update Status
                          </Text>
                          <Select
                            size="sm"
                            borderRadius="md"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusUpdate(order._id, e.target.value)
                            }
                            bg="white"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </Select>
                        </Box>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Box textAlign="center" py={4} color="gray.500">
                    No orders found for this user
                  </Box>
                )}
              </Collapse>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Container>
  );
};

export default AdminDashboard;
