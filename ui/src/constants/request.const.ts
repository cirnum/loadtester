export interface StatsFieldInterface {
  title: string;
  key: string;
  isStatus?: boolean;
  toShowInWidget?: boolean;
  formate?: boolean;
  color?: string;
  type?: string;
}
export const StatFields: StatsFieldInterface[] = [
  {
    title: "Server Alias",
    key: "alias",
    type: "string",
  },
  {
    title: "Status",
    key: "finish",
    isStatus: true,
  },
  {
    title: "Worker",
    key: "clients",
    toShowInWidget: true,
  },
  {
    title: "Time",
    key: "timeTaken",
    toShowInWidget: true,
  },
  {
    title: "Total Request",
    key: "totalRequest",
    toShowInWidget: true,
    formate: true,
  },
  {
    title: "Success",
    key: "totalSuccessRequest",
    toShowInWidget: false,
    formate: true,
  },
  {
    title: "Failed",
    key: "totalFailRequest",
    toShowInWidget: false,
    formate: true,
  },
  {
    title: "Failure %",
    key: "failPercentage",
    toShowInWidget: true,
  },
  {
    title: "Failed RPS",
    key: "totalFailRPS",
    color: "red",
    toShowInWidget: false,
  },
  {
    title: "Success RPS",
    key: "successRPS",
    color: "green",
    toShowInWidget: false,
  },
  {
    title: "RPS",
    key: "totalRPS",
    color: "tomato",
    toShowInWidget: true,
  },
];

export const WorkerFields: StatsFieldInterface[] = [
  {
    title: "Status",
    key: "status",
    isStatus: true,
  },
  {
    title: "Alias",
    key: "alias",
    type: "string",
  },
  {
    title: "Description",
    key: "description",
    type: "string",
  },
  {
    title: "Server URL",
    key: "ip",
    type: "string",
  },
];
