import { Box, Flex,Input, Checkbox  } from "@chakra-ui/react";


interface IItem {
  isSelected?: boolean;
  position: number;
  value: string;
  keyName: string;
  savePair: (value:string,postion: number, key: string) => void;
}
export default function Item(props: IItem) {
  return (
    <Flex color="black">
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          lineHeight: "1rem",
          height: "60px",
          padding: "10px",
        }}
        width="10%"
      >
        <Checkbox height="40px" width="40px" isChecked={props.isSelected} />
      </Box>
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60px",
          padding: "10px",
        }}
        width="50%"
      >
        <Input
          placeholder="Key"
          value={props.keyName}
          onChange={(e) =>
            props.savePair(e.target.value, props.position, "key")
          }
        />
      </Box>
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60px",
          padding: "10px",
        }}
        width="50%"
      >
        <Input
          placeholder="Value"
          value={props.value}
          onChange={(e) =>
            props.savePair(e.target.value, props.position, "value")
          }
        />
      </Box>
    </Flex>
  );
}
