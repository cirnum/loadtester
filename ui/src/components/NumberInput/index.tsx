import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import React from "react";

type INumberInputs = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: number;
};

export default function NumberInputComp(props: INumberInputs) {
  const { placeholder, onChange, value = 10 } = props;
  return (
    <NumberInput
      step={1}
      value={value && value}
      clampValueOnBlur={false}
      ml={2}
      mr={2}
      flex={2}
    >
      <NumberInputField
        placeholder={placeholder}
        onChange={onChange}
        height="36px"
      />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}
