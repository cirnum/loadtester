// eslint-disable-next-line import/no-extraneous-dependencies
import * as parse from "@bany/curl-to-json";

// TODO: @bany/curl-to-json library failed to parse header if there is no space between key and value. so added this patch
const headerFix = (payload: Record<string, string>) => {
  return Object.keys(payload || {}).reduce(
    (acc: Record<string, string>, key: string) => {
      if (!payload[key]) {
        if (key.includes(":")) {
          const [mapKey, value] = key.split(":");
          acc[mapKey] = value;
        }
      } else {
        acc[key] = payload[key];
      }
      return acc;
    },
    {} as Record<string, string>
  );
};

export const convertToCurl = (curl: string) => {
  try {
    const payload = parse(curl) as any;
    return {
      ...payload,
      header: headerFix(payload.header),
    };
  } catch (e) {
    throw new Error("Error while parsing curl");
  }
};
