export const commonRequestHeader = {
  key: "",
  value: "",
  isChecked: false,
};
export const selectedRequestConst = {
  requestHeader: [{ ...commonRequestHeader }],
  requestParams: [{ ...commonRequestHeader }],
  requestCookies: [{ ...commonRequestHeader }],
  requestBody: {},
};
export const newRequestStruct = {
  request: undefined,
  requestHeader: [
    {
      ...commonRequestHeader,
    },
  ],
  requestParams: [
    {
      ...commonRequestHeader,
    },
  ],
  requestCookies: [
    {
      ...commonRequestHeader,
    },
  ],
  requestBody: {},
  response: undefined,
};
