export const NumberFormat = (value: number) => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export const convertToMilliSeconds = (value) => {
  if (value > 0) {
    return Math.ceil(value / 1000);
  }
  return value;
};
