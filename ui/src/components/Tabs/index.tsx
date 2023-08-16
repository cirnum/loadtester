import { Box, Center, HStack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

function Tab({
  isSelected,
  text,
  onClick,
}: {
  isSelected: boolean;
  text: string;
  onClick: (val) => void;
}) {
  return (
    <Center
      flex={1}
      cursor="pointer"
      onClick={onClick}
      py={5}
      boxShadow={isSelected ? "md" : "none"}
      borderBottom={isSelected ? "2px" : 0}
      borderColor={isSelected ? "primary.500" : ""}
      width="100%"
      alignItems="Center"
      borderRight="1px solid #EBEBEB"
    >
      <Text as="b">{text}</Text>
    </Center>
  );
}

interface TabsProps {
  list: { alias: string; id: string }[];
  selected: string | null;
  setSelected: (_val) => void;
  children: ReactNode;
}
export default function Tabs({
  list,
  selected,
  setSelected,
  children,
}: TabsProps) {
  if (!selected) return null;
  return (
    <Box height="100%" bg="white">
      <HStack bg="white" borderBottom="1px solid #EBEBEB">
        {list.map((tab) => (
          <Tab
            key={tab?.alias}
            isSelected={selected === tab?.id}
            text={tab?.alias}
            onClick={() => setSelected(tab?.id)}
          />
        ))}
      </HStack>
      {children}
    </Box>
  );
}
