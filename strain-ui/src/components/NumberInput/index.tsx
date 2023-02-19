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
};
export default function NumberInputComp(props: INumberInputs) {
  const { placeholder, onChange } = props;
  return (
    <NumberInput clampValueOnBlur={false} ml={2} mr={2}>
      <NumberInputField
        placeholder={placeholder}
        onChange={onChange}
      />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}
