import { format, utcToZonedTime } from "date-fns-tz";
import {
  LoadsterResponse,
  ServerMapData,
} from "../store/stress/dashboard/types";
import { convertToMilliSeconds } from "./_shared";

const getGridOptions = (options = {}) => {
  return {
    backgroundColor: "#fafafa",
    borderWidth: 0.1,
    show: true,
    shadowBlur: 0.2,
    top: 40,
    right: 8,
    bottom: 24,
    left: 56,
    ...options,
  };
};

export function getLatencyOptions(latency: LoadsterResponse[]) {
  const keyToMap = ["mean", "median", "p99", "p75", "stddev"];
  return {
    legend: {
      orient: "horizontal",
      left: "right",
      itemHeight: 15,
      textStyle: {
        color: "#171239",
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: 20,
      },
      data: keyToMap,
    },
    title: {
      text: "Response Time (MS)",
      textStyle: {
        color: "#837F9D",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    xAxis: {
      splitLine: { show: false },
      data: latency?.map((item) => {
        const someTime = utcToZonedTime(
          item.created * 1000,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );
        return format(someTime, "HH:mm:ss");
      }),
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      splitLine: { show: false },
      type: "value",
    },
    grid: getGridOptions(),
    series: keyToMap.map((key) => ({
      name: key,
      data: latency?.map((item) => convertToMilliSeconds(item[key])),
      type: "line",
    })),
  };
}

export function getServerStatsOptions(data: LoadsterResponse[], title: string) {
  const keyToMap = ["count"];
  return {
    legend: {
      orient: "horizontal",
      left: "right",
      itemHeight: 15,
      textStyle: {
        color: "#171239",
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: 20,
      },
      data: keyToMap,
    },
    title: {
      text: title,
      textStyle: {
        color: "#837F9D",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    xAxis: {
      splitLine: { show: false },
      data: data?.map((item) => {
        const someTime = utcToZonedTime(
          item.created,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );
        return format(someTime, "HH:mm:ss");
      }),
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      splitLine: { show: false },
      type: "value",
    },
    grid: getGridOptions(),
    series: keyToMap.map((key) => ({
      name: key,
      data: data?.map((item) => item[key]),
      type: "line",
    })),
  };
}

export function getRps(latencyByServer: Record<string, ServerMapData>) {
  const servers = Object.values(latencyByServer);
  const aggregate: number[] = [];
  servers.forEach((data) => {
    data.latency.forEach((load, index) => {
      if (aggregate[index]) {
        aggregate[index] += load.rps;
      } else {
        aggregate[index] = load.rps;
      }
    });
  });
  const totalRPS = {
    name: "Total RPS",
    data: aggregate,
    type: "line",
  };
  const keyToMap = ["count"];
  return {
    legend: {
      orient: "horizontal",
      left: "right",
      data: keyToMap,
    },
    xAxis: {
      data: servers[0]?.latency?.map((item) => {
        const someTime = utcToZonedTime(
          item.created,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );
        return format(someTime, "HH:mm:ss");
      }),
    },
    grid: getGridOptions(),
    title: {
      text: "Request per second Success/Failure",
      textStyle: {
        color: "#837F9D",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      splitLine: { show: false },
      type: "value",
    },
    series: [
      totalRPS,
      ...servers.map((server) => {
        return {
          name: `${server.serverId}`,
          data: server.latency?.map((item) => item.rps),
          type: "line",
        };
      }),
    ],
  };
}
