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

export function parseCookie(cookie) {
  const cookieObj = {};
  const trimCookie = cookie.replace(/['"]+/g, "");
  const cookieArray = trimCookie.split(";");

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cookieArray.length; i++) {
    const cookieItem = cookieArray[i].trim().split("=");
    const cookieName = cookieItem[0];
    const cookieValue = decodeURIComponent(cookieItem[1]);
    cookieObj[cookieName] = cookieValue;
  }

  return cookieObj;
}
