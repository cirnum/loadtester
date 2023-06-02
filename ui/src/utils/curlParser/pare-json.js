/* eslint-disable import/no-import-module-exports */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-shadow */
// eslint-disable-next-line import/no-extraneous-dependencies
import minimistParser from "minimist";
import convertor from "./convertor";
import options from "./option";
import matcher from "./matcher";

export function parse(data) {
  if (typeof data === "string" || data instanceof String) {
    // minimistParser cannot parse from string
    // parse string to argvs array for minimistParser
    data = matcher.matchArgv(data);
  }
  const argv = minimistParser(data);

  const result = {};

  if (argv._[1]) {
    result.url = argv._[1].replace(/'/g, "");
  }

  options.forEach((element) => {
    const { alias } = element;
    const value = alias
      .map((element) => argv[element])
      .filter((element) => element)[0];
    if (value) {
      if (element.convertor) {
        result[element.name] = element.convertor(value);
      } else {
        result[element.name] = value;
      }
    }
  });

  if (result.url) {
    const url = new URL(result.url);
    result.url = url.origin + url.pathname;
    const params = new URLSearchParams(url.search);
    if (Array.from(params).length) {
      result.params = convertor.parseParamsField(params.toString());
    }
  }

  if (!result.method) {
    // When there is a "data" parameter, the default is "post" request mode
    result.method = result.data ? "POST" : "GET";
  }

  return result;
}
