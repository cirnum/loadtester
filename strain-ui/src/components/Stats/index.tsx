import {
  Badge,
  Button,
  Divider,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import AnimatedNumber from "react-animated-number";
import { getLoadsterList } from "../../store/stress/dashboard/selectors";
import { RequestHistoryPayload } from "../../store/stress/dashboard/types";

const resultData = {
  finish: false,
  rps: 0,
  count: 0,
  totalRequst: 0,
  ".latency": 0,
  ".http_ok": 0,
  httpFail: 0,
  timeTaken: 0,
  max: 0,
  min: 0,
};

function Animate({ value }: { value: number }) {
  return (
    <AnimatedNumber
      value={value}
      style={{
        fontSize: 20,
      }}
      duration={1000}
      formatValue={(n) => n.toFixed(0)}
      frameStyle={(percentage) =>
        percentage > 20 && percentage < 80 ? { opacity: 0.5 } : {}
      }
    />
  );
}
export function Stats({
  isMainPage = false,
  selectedRequest,
}: {
  isMainPage?: boolean;
  selectedRequest: RequestHistoryPayload;
}) {
  const navigate = useNavigate();
  const data = useSelector(getLoadsterList);
  const result = useMemo(() => {
    const resultIs = { ...resultData };
    const stressData = data?.data?.filter((item) => item.type === "histogram");
    const isFinish = data?.data?.filter((item) => item.finish);
    if (stressData) {
      const last = stressData[stressData.length - 1];
      const [first] = stressData;
      resultIs.finish = last?.finish;
      resultIs.max = last?.max;
      resultIs.min = last?.min;
      const timeTaken = (last?.created || 0) - (first?.startTime || 0);
      resultIs.timeTaken = !isFinish?.length
        ? timeTaken
        : selectedRequest?.time || 1;
      resultIs.count = last?.count || 0;
      resultIs.rps = parseInt(
        (resultIs.count / resultIs.timeTaken).toString(),
        10
      );
      return resultIs;
    }
    return resultIs;
  }, [data?.data]);

  if (!data?.data) return null;
  return (
    <>
      <StatGroup>
        <Stat>
          <StatLabel>Status</StatLabel>
          <StatNumber>
            <Badge colorScheme={result.finish ? "red" : "green"}>
              {result.finish ? "Completed" : "Active"}
            </Badge>
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Worker</StatLabel>
          <StatNumber>{selectedRequest?.clients}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Time</StatLabel>

          <StatNumber>
            <Animate value={result.timeTaken} />
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Request</StatLabel>
          <StatNumber>
            <Animate value={result.count} />
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel>RPS</StatLabel>
          <StatNumber color="green">
            <Animate value={result.rps} />
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Failure Request</StatLabel>
          <StatNumber>{result.httpFail}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Min-Max latency</StatLabel>
          <StatNumber>
            <Animate value={result.min} />
            -
            <Animate value={result.max} /> ms
          </StatNumber>
        </Stat>
        {!isMainPage && (
          <Stat>
            <Button onClick={() => navigate(`/request/${selectedRequest?.id}`)}>
              View In Details
            </Button>
          </Stat>
        )}
      </StatGroup>
      <Divider />
    </>
  );
}
