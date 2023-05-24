// eslint-disable-next-line import/no-extraneous-dependencies
import ReactEcharts from "echarts-for-react";

export function ELoadChart({ options }: { options: any }) {
  return (
    <ReactEcharts
      style={{ width: "50%", height: "350px" }}
      option={options}
      theme="dark"
    />
  );
}
