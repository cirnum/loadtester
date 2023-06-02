/* eslint-disable prefer-destructuring */
/**
 * Parse header field.
 */

function parseField(s) {
  return s.replace(/:(\s+)/, ":").split(/:(.+)/);
}

function parseFieldWithEqual(s) {
  return s.split(/=(.+)/);
}

function pareString(s, pareCallBack = parseField) {
  const result = {};
  const field = pareCallBack(s);
  result[field[0]] = field[1];
  return result;
}

function parseParamsField(s) {
  if (s === "") return null;
  const object = {};
  const allParamsArr = s.split(/&/);
  allParamsArr.forEach((element) => {
    const field = element.split(/=/);
    object[field[0]] = field[1];
  });

  return object;
}

const option = {
  header: (data) => {
    let ouput = {};
    if (typeof data === "string") {
      ouput = pareString(data);
    } else {
      data.forEach((element) => {
        ouput = {
          ...ouput,
          ...pareString(element, parseField),
        };
      });
      return ouput;
    }
    return ouput;
  },
  body: (data) => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        try {
          return parseParamsField(data);
        } catch {
          return data;
        }
      }
    } else {
      let ouput = {};
      data.forEach((element) => {
        ouput = {
          ...ouput,
          ...pareString(element, parseFieldWithEqual),
        };
      });
      return ouput;
    }
  },
  parseParamsField,
};

export default option;
