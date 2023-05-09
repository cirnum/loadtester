export const StatFields = [
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
    key: "count",
    toShowInWidget: true,
    formate: true,
  },
  {
    title: "Success",
    key: "httpSuccess",
    toShowInWidget: false,
    formate: true,
  },
  {
    title: "Failed",
    key: "httpFail",
    toShowInWidget: false,
    formate: true,
  },
  {
    title: "Failure %",
    key: "failedPer",
    toShowInWidget: true,
  },
  {
    title: "Failed RPS",
    key: "failedRPS",
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
    key: "rps",
    color: "tomato",
    toShowInWidget: true,
  },
];

export const TypeOfStatFields = typeof StatFields;
