import {
  Box,
  Flex,
  Image,
  Text,
  VStack,
  Icon,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

function UUpload() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const toast = useToast();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (file) {
      setFileUrl(URL.createObjectURL(file));
    }
  }, [file]);

  function handleInput(event) {
    const uploadedFile = event.target.files[0];

    if (!uploadedFile) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(uploadedFile.type)) {
      showToast(
        "Invalid File Type",
        "Only PNG and JPG images are allowed.",
        "error"
      );
      return;
    }

    if (uploadedFile.size > 5 * 1024 * 1024) {
      showToast("File Too Large", "File size must be less than 5MB.", "error");
      return;
    }

    setFile(uploadedFile);
    uploadFile(uploadedFile);
  }

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("prescription", file);
    setIsUploading(true);

    try {
      await axios.post(
        "https://online-pharmacy-backend.onrender.com/prescriptions/upload",
        formData,
        {
          headers: { token },
        }
      );

      setIsUploaded(true);
      showToast(
        "Upload Successful",
        "Your prescription has been uploaded.",
        "success"
      );

      setTimeout(() => {
        setFile(null);
        setFileUrl(null);
      }, 2000);
    } catch (error) {
      showToast(
        "Upload Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  }

  function showToast(title, description, status) {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      handleInput({ target: { files: [droppedFile] } });
    }
  }

  return (
    <Flex
      justify="center"
      align="center"
      minH="50vh"
      w="100%"
      bg="gray.100"
      p={6}
    >
      <VStack spacing={6} w="100%" maxW="500px">
        {isUploaded ? (
          <Box
            textAlign="center"
            p={6}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
          >
            <Text fontSize="lg" fontWeight="bold" color="green.600">
              Thank you! 🎉
            </Text>
            <Text fontSize="md" color="gray.600">
              Our team will contact you for more details.
            </Text>
          </Box>
        ) : (
          <Box
            as="label"
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            w="100%"
            p={6}
            border="2px dashed"
            borderColor="gray.300"
            borderRadius="lg"
            bg="white"
            cursor="pointer"
            _hover={{ borderColor: "blue.400", bg: "gray.50" }}
            transition="all 0.3s"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              style={{ display: "none" }}
              onChange={handleInput}
            />
            {isUploading ? (
              <Spinner color="blue.400" size="lg" />
            ) : (
              <>
                <Icon as={FiUploadCloud} boxSize={10} color="blue.400" />
                <Text fontWeight="medium" color="gray.700" mt={2}>
                  Click or Drag & Drop to Upload
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Only PNG, JPG (Max 5MB)
                </Text>
              </>
            )}
          </Box>
        )}

        {file && fileUrl && (
          <Image
            src={fileUrl}
            alt="Uploaded Preview"
            borderRadius="lg"
            boxShadow="lg"
            maxH="300px"
            objectFit="cover"
          />
        )}
      </VStack>
    </Flex>
  );
}

export default UUpload;
