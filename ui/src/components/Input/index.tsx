import { Box, FormControl, Input, Text, InputGroup } from "@chakra-ui/react";
import { useState } from "react";

interface InputProps {
  value: string | number;
  setValue: (str: string) => void;
  placeholder: string;
  type: string;
}
export default function InputBox({
  type,
  value,
  setValue,
  placeholder,
}: InputProps) {
  const [isActive, setIsActive] = useState(false);
  function handleChange(e) {
    const text = e.target.value;
    setValue(text);
  }
  return (
    <Box flex={6}>
      <Box pos="relative">
        <FormControl isRequired colorScheme="green">
          <InputGroup>
            <Input
              type={type}
              outline="none"
              onFocus={() => setIsActive(true)}
              onBlur={() =>
                value === "" ? setIsActive(false) : setIsActive(true)
              }
              value={value}
              onChange={handleChange}
            />
          </InputGroup>
        </FormControl>
        <Text
          top={isActive ? "0%" : "50%"}
          left={isActive ? "5px" : "50%"}
          transform={
            isActive
              ? "translate(10px,-45%) scale(0.8)"
              : "translate(-50%,-50%) scale(1)"
          }
          p="0 12px"
          bg="#fff"
          transformOrigin="top left"
          transition="all .2s ease-out"
          color="#999"
          pointerEvents="none"
          pos="absolute"
          w="fit-content"
          h="fit-content"
          zIndex="5"
        >
          {placeholder}
        </Text>
      </Box>
    </Box>
  );
}
