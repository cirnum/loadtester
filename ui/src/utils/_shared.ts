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

export const paginationHandler = (
  action: "next" | "prev",
  total: number,
  paginate: any,
  paginateHandler: (page: any) => void
) => {
  const isPaginated = total >= (paginate?.page || 1) * paginate.limit;
  if (action === "next" && isPaginated) {
    paginateHandler((pagint) => {
      return { ...pagint, page: pagint.page + 1 };
    });
  } else if (action === "prev" && paginate.page > 1) {
    paginateHandler((pagint) => {
      return { ...pagint, page: pagint.page - 1 };
    });
  }
};
