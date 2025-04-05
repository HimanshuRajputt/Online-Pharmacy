import { useState, useEffect } from "react";
import axios from "axios";
import { marked } from "marked";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  IconButton,
  Image,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
// import { useCart } from "../context/CartContext";

export const AI_Bot = () => {
  const [response, setResponse] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [medicineData, setMedicineData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const {fetchCart} = useCart()
  
  // Responsive values based on screen size
  const chatBoxWidth = useBreakpointValue({ base: "90vw", md: "400px" });
  const chatBoxPosition = useBreakpointValue({
    base: { right: "5%", bottom: "80px" },
    md: { right: "80px", bottom: "50px" },
  });
  const buttonPosition = useBreakpointValue({
    base: { right: "20px", bottom: "20px" },
    md: { right: "20px", bottom: "20px" },
  });

  // Fetch medicine data from API
  useEffect(() => {
    // fetchCart()
    axios
      .get("https://online-pharmacy-backend.onrender.com/products/")
      .then((res) => {
        if (res.data) {
          setMedicineData(res.data);
        }
      })
      .catch((err) => console.error("Error fetching medicine data:", err));
  }, []);

  const toggleContentBox = () => {
    setIsActive(!isActive);
  };

  const handleSubmit = () => {
    setInputValue("");
    setLoading(true); // Start loading

    const payload = {
      prompt: `You are Mea, a personal AI assistant created and trained by Himanshu Rajput. Answer in a structured, concise, 
      and visually appealing manner.  
      User query: "${inputValue}"  
      Here are the available medicines: ${medicineData
        .map(
          (med) =>
            `- **${med.name}** (ID: ${med.id}) | Price: ₹${med.price} | Category: ${med.category}`
        )
        .join("\n")}  

        If the query is about medication suggestions, provide at least one or two relevant options with medicens in shortest response .   `,
    };

    console.log(payload);
    axios
      .post("https://custom-ai-th78.onrender.com/res", payload)
      .then((res) => {
        setResponse(marked(res.data));
        // console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  return (
    <>
      {/* Floating Button */}
      <IconButton
        icon={
          <Image
            src="https://ik.imagekit.io/m9qnay09g/original-dc01dfdccd03f05f33170d84d32deffd.gif?updatedAt=1739169670744"
            alt="Animated GIF"
            border="2px solid pink"
            borderRadius="full"
          />
        }
        position="fixed"
        bottom={buttonPosition.bottom}
        right={buttonPosition.right}
        borderRadius="full"
        border="3px solid black"
        w="60px"
        h="50px"
        transform="scale(1.2)"
        bg="teal.400"
        boxShadow="md"
        _hover={{ transform: "scale(1.5)", transition: "0.4s ease-in-out" }}
        onClick={toggleContentBox}
        zIndex="1001"
      />

      {/* Content Box */}
      <Box
        position="fixed"
        bottom={chatBoxPosition.bottom}
        right={chatBoxPosition.right}
        w={chatBoxWidth}
        maxW="100vw"
        p="5"
        bg="gray.100"
        boxShadow="md"
        borderRadius="lg"
        transform={isActive ? "scale(1)" : "scale(0)"}
        transformOrigin="bottom right"
        transition="transform 0.4s ease-in-out"
        zIndex="1000"
        maxH={{ base: "70vh", md: "auto" }}
        overflowY="auto"
      >
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          {response ? "Mea Responded" : "Hi, I am Mea, your Personal AI:"}
        </Text>

        {/* Response Box */}
        <Box
          mt="2"
          minH="50px"
          textAlign="left"
          p="2"
          borderRadius="md"
          dangerouslySetInnerHTML={{ __html: response }}
          wordBreak="break-word"
          sx={{
            "& img": {
              maxWidth: "100%",
              height: "auto",
            },
          }}
        />

        {/* Show Spinner when Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" my="3">
            <Spinner size="lg" color="blue.500" />
          </Box>
        )}

        {/* Input & Button */}
        <VStack mt="3">
          <Input
            placeholder="Enter something..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            isDisabled={loading} // Disable input while loading
          />
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            w="full"
            _hover={{ bg: "green.500" }}
            isLoading={loading} // Show loading state in button
            loadingText="Please wait....."
          >
            Submit
          </Button>
        </VStack>
      </Box>
    </>
  );
};
