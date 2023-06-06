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
  loading: false,
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
