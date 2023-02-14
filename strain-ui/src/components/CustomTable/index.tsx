import React from "react";
import Item from "./item";
import Heading from "./header";
import { Flex, Box } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { Checkbox } from "@chakra-ui/checkbox";
import { useStore } from "../../utils/store/stressRequest";


export default function Table() {
  const {params} = useStore();
  console.log("params", params);
  return (
    <>
      <Heading isChecked={true} />
      {params.map(({ key, value, isSelected }) => (
        <ItemIS key={key} value={value} isSelected={isSelected} />
      ))}
    </>
  );
}

function ItemIS(props: any) {
  return (
    <Flex
      color="black"
      sx={{
        height: "2rem",
      }}
    >
      {props.isChecked && (
        <Box
          sx={{
            border: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: "1rem",
          }}
          width="10%"
        >
          <Checkbox />
        </Box>
      )}
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        width="50%"
      >
        <Input placeholder="Basic usage" value={props.key} />
      </Box>
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        width="50%"
      >
        <Input placeholder="Basic usage" value={props.value} />
      </Box>
    </Flex>
  );
}
