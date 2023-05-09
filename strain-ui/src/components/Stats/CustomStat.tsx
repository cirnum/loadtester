import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";

export function CustomStats({
  children,
  title,
  color = "black",
}: {
  children: any;
  title: string;
  color?: string;
}) {
  return (
    <Stat borderRight="1px solid #e2e8f0" mr={2}>
      <StatLabel>{title}</StatLabel>
      <StatNumber color={color}>{children}</StatNumber>
    </Stat>
  );
}
