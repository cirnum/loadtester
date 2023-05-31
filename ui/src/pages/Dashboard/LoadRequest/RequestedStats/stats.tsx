import { Text, VStack } from "@chakra-ui/react";
import { Animate } from "../../../../components/Stats/Animation";

export enum STATE {
  POSITIVE,
  NAGATIVE,
  NORMAL,
}
const getColorCode = (state: STATE) => {
  switch (state) {
    case STATE.NORMAL: {
      return "#0066FF";
    }
    case STATE.POSITIVE: {
      return "#6BAA44";
    }
    case STATE.NAGATIVE: {
      return "tomato";
    }
    default:
      return "#0066FF";
  }
};

const getColorCodeForNumber = (state: STATE) => {
  switch (state) {
    case STATE.POSITIVE: {
      return "#6BAA44";
    }
    case STATE.NAGATIVE: {
      return "tomato";
    }
    default:
      return "#171239";
  }
};
export default function Stats({
  text,
  value,
  state,
}: {
  text: string;
  value: number | string;
  state: STATE;
}) {
  const color = getColorCode(state);
  return (
    <VStack
      gap={1}
      minWidth="200px"
      maxWidth="200px"
      borderLeft={`2px solid ${color}`}
      padding="12px 0"
      margin="12px"
      justifyContent="start"
      bg="#F8F8F8"
      flex={1}
    >
      <Text>{text}</Text>
      <Text color={getColorCodeForNumber(state)} fontWeight="600">
        {typeof value === "number" ? <Animate value={value} /> : value}
      </Text>
    </VStack>
  );
}
