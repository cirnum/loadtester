import { Box, Flex, Input, Checkbox } from "@chakra-ui/react";

interface IItem {
  isSelected?: boolean;
  position: number;
  value: string;
  keyName: string;
  savePair: (value: string, postion: number, key: string) => void;
  onCheck: (postion: number, isChecked: boolean) => void;
}
export default function Item(props: IItem) {
  const { isSelected, position, savePair, keyName, value, onCheck } = props;
  return (
    <Flex color="black">
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          lineHeight: "1rem",
          height: "40px",
          padding: "10x",
        }}
        width="10%"
      >
        <Checkbox
          isChecked={isSelected}
          onChange={(e) => onCheck(position, e.target.checked)}
        />
      </Box>
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "40px",
          padding: "5px",
        }}
        width="50%"
      >
        <Input
          placeholder="Key"
          size="sm"
          variant="filled"
          value={keyName}
          onChange={(e) => savePair(e.target.value, position, "key")}
        />
      </Box>
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "40px",
          padding: "5px",
        }}
        width="50%"
      >
        <Input
          placeholder="Value"
          size="sm"
          variant="filled"
          value={value}
          onChange={(e) => savePair(e.target.value, position, "value")}
        />
      </Box>
    </Flex>
  );
}
