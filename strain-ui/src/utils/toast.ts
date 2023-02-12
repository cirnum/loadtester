import { useToast, UseToastOptions } from "@chakra-ui/react";

export const useToaster = () => {
  const toast = useToast();
  return {
    success: (options: UseToastOptions = {}) => {
      toast({
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
        ...options,
      });
    },
    error: (options: UseToastOptions = {}) => {
      toast({
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
        ...options,
      });
    },
  };
};
