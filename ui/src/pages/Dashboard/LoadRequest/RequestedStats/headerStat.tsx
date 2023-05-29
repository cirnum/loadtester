import { Center, HStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
// import Stats, { STATE } from "./stats";
import { getLoadsterList } from "../../../../store/stress/dashboard/selectors";

export function HeaderStats() {
  const loadsterRespons = useSelector(getLoadsterList);
  if (!loadsterRespons) return loadsterRespons;
  return (
    <HStack
      borderRadius="8px"
      margin="12px 24px"
      paddingX="24px"
      paddingY="12px"
      width="fit-content"
    >
      <Center
        bg="#D9F2E8"
        color="#00945F"
        border="1px solid #00945F"
        borderRadius="4px"
        height="32px"
        padding="6px 12px"
        alignItems="center"
      >
        Active
      </Center>
      {/* <Stats
        state={STATE.NORMAL}
        value={loadsterRespons?.timeTaken || 0}
        text="Total RPS"
      />
      <Stats
        state={STATE.NORMAL}
        value={loadsterRespons?.totalRequest || 0}
        text="Success RPS"
      /> */}
    </HStack>
  );
}
