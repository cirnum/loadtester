import React from "react";
import { useSelector } from "react-redux";
// import { Box } from "@chakra-ui/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { utcToZonedTime, format } from "date-fns-tz";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getLoadsterList } from "../../store/stress/dashboard/selectors";

export function LoadChart() {
  const data = useSelector(getLoadsterList);
  if (!data?.data) return null;
  return (
    <ResponsiveContainer width="100%" height="40%">
      <LineChart
        title="Response Times (ms)"
        width={1500}
        height={300}
        data={data?.data}
        margin={{
          top: 5,
          bottom: 5,
        }}
      >
        <text
          x={500 / 2}
          y={20}
          fill="black"
          textAnchor="middle"
          dominantBaseline="central"
        >
          <tspan fontSize="16">Response Times (ms)</tspan>
        </text>
        <CartesianGrid strokeDasharray="0 0" opacity={0.5} />
        <XAxis
          dataKey="created"
          domain={["auto", "auto"]}
          name="Time"
          tickFormatter={(unixTime) => {
            const someTime = utcToZonedTime(unixTime, "utc");
            return format(someTime, "h:m:s");
          }}
          type="number"
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          dot={{ strokeWidth: 1, r: 1, strokeDasharray: "", stroke: "#8884d8" }}
          type="monotone"
          dataKey="p75"
          activeDot={{ r: 1 }}
        />
        <Line
          dot={{ strokeWidth: 1, r: 1, strokeDasharray: "", stroke: "#82ca9d" }}
          type="monotone"
          dataKey="p99"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
