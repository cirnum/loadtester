/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from "./curlParser/pare-json.js";

export const convertToCurl = (curl: string) => {
  try {
    const payload = parse(curl) as any;
    return {
      ...payload,
      url: payload.url ? payload.url : payload.location,
    };
  } catch (e) {
    throw new Error("Error while parsing curl");
  }
};
