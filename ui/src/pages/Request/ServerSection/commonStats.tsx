import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { Stats } from "../../../components/Stats";
import { Animate } from "../../../components/Stats/Animation";
import { StatFields } from "../../../constants/request.const";
import { convertToMilliSeconds } from "../../../utils/_shared";
import { LoadsterRequestedResponse } from "../../../store/stress/dashboard/types";

export default function CommonStats({
  data,
}: {
  data: LoadsterRequestedResponse | undefined;
}) {
  if (!data) {
    return null;
  }
  return (
    <Stats fieldsToPopulate={StatFields} data={data}>
      <>
        <Stat borderRight="1px solid #e2e8f0" mr={2}>
          <StatLabel>Total Worker Running</StatLabel>
          <StatNumber>
            <Animate value={(data?.workers?.length || 0) + 1} />
          </StatNumber>
        </Stat>
        <Stat borderRight="1px solid #e2e8f0" mr={2}>
          <StatLabel>Min-Max latency</StatLabel>
          <StatNumber>
            <Animate value={convertToMilliSeconds(data?.minLatency)} />
            -
            <Animate value={convertToMilliSeconds(data?.maxLatency)} /> ms
          </StatNumber>
        </Stat>
      </>
    </Stats>
  );
}
