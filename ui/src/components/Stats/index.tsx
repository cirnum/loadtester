import { Badge, Divider, StatGroup, Text, Tooltip } from "@chakra-ui/react";
import { ReactElement } from "react";
import { StatsFieldInterface } from "../../constants/request.const";
import { NumberFormat } from "../../utils/_shared";
import { Animate } from "./Animation";
import { CustomStats } from "./CustomStat";
import {
  LoadsterRequestedResponse,
  Jobs,
  ServerMapData,
} from "../../store/stress/dashboard/types";

export function Stats({
  fieldsToPopulate,
  children,
  data,
}: {
  data?: LoadsterRequestedResponse | Jobs | ServerMapData;
  fieldsToPopulate: StatsFieldInterface[];
  children?: ReactElement;
}) {
  if (!data) {
    return null;
  }
  return (
    <>
      <StatGroup width="100%">
        {fieldsToPopulate.map((section) => {
          const { formate = false } = section;
          if (!data[section.key] && data[section.key] !== false) return null;
          if (section.isStatus) {
            return (
              <CustomStats title={section.title}>
                <Badge color={data?.[section.key] ? "tomato" : "green"}>
                  {data?.[section.key] ? "Completed" : "Active"}
                </Badge>
              </CustomStats>
            );
          }
          if (section?.type === "string") {
            return (
              <CustomStats title={section.title}>
                <Text fontSize="18px">{data[section.key]}</Text>
              </CustomStats>
            );
          }
          return (
            <CustomStats title={section.title} color={section?.color}>
              {formate ? (
                <Tooltip label={data[section.key]} aria-label="A tooltip">
                  {NumberFormat(data[section.key])}
                </Tooltip>
              ) : (
                <Animate value={data[section.key]} />
              )}
            </CustomStats>
          );
        })}
        {children}
      </StatGroup>
      <Divider />
    </>
  );
}
