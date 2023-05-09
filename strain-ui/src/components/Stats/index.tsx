import {
  Badge,
  Button,
  Divider,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Tooltip,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLoadsterList } from "../../store/stress/dashboard/selectors";
import { RequestHistoryPayload } from "../../store/stress/dashboard/types";
import { StatFields } from "../../constants/request.const";
import { getRequestStats, NumberFormat } from "../../utils/request";
import { Animate } from "./Animation";
import { CustomStats } from "./CustomStat";

export function Stats({
  isMainPage = false,
  selectedRequest,
  fieldsToPopulate,
}: {
  isMainPage?: boolean;
  selectedRequest: RequestHistoryPayload;
  fieldsToPopulate: typeof StatFields;
}) {
  const navigate = useNavigate();
  const data = useSelector(getLoadsterList);
  const result = useMemo(() => {
    return getRequestStats(data?.data, selectedRequest);
  }, [data?.data]);

  if (!data?.data) return null;
  return (
    <>
      <StatGroup width="100%">
        <Stat borderRight="1px solid #e2e8f0" mr={2}>
          <StatLabel>Status</StatLabel>
          <StatNumber>
            <Badge colorScheme={result.finish ? "red" : "green"}>
              {result.finish ? "Completed" : "Active"}
            </Badge>
          </StatNumber>
        </Stat>
        {fieldsToPopulate.map((section) => {
          const { formate = false } = section;
          if (!result[section.key]) return null;
          return (
            <CustomStats title={section.title} color={section?.color}>
              {formate ? (
                <Tooltip label={result[section.key]} aria-label="A tooltip">
                  {NumberFormat(result[section.key])}
                </Tooltip>
              ) : (
                <Animate value={result[section.key]} />
              )}
            </CustomStats>
          );
        })}
        {isMainPage && (
          <Stat borderRight="1px solid #e2e8f0" mr={2}>
            <StatLabel>Min-Max latency</StatLabel>
            <StatNumber>
              <Animate value={result.min} />
              -
              <Animate value={result.max} /> ms
            </StatNumber>
          </Stat>
        )}
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
