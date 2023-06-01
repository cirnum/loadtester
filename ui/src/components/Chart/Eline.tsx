// eslint-disable-next-line import/no-extraneous-dependencies
import ReactEcharts from "echarts-for-react";

export function ELoadChart({ options }: { options: any }) {
  return (
    <ReactEcharts
      style={{ width: "100%", height: "300px" }}
      option={options}
      theme="light"
    />
  );
}
