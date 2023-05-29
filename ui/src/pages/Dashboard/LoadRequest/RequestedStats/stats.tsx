import { HStack, Text } from "@chakra-ui/react";
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
  value: number;
  state: STATE;
}) {
  const color = getColorCode(state);
  return (
    <HStack
      gap={3}
      minWidth="150px"
      borderLeft={`2px solid ${color}`}
      paddingLeft="12px"
      flex={1}
    >
      <Text color={getColorCodeForNumber(state)} fontWeight="600">
        <Animate value={value} />
      </Text>
      <Text>{text}</Text>
    </HStack>
  );
}
