import axios from "axios";
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from "js-cookie";
import { TAxiosWrapper } from "../types";

const getToken = (TOKEN) => {
  return Cookies.get(TOKEN);
};

const TOKEN = "__session";
const PATH_PREFIX = "/api/v1/";
const Instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? import.meta.env.VITE_BASE_URL
    : window.location.origin + PATH_PREFIX,
  timeout: 15000,
  headers: {
    Authorization: `Bearer ${getToken(TOKEN)}`,
    "Content-Type": "application/json",
  },
});


export default function ApiCall<T>({
  path,
  method,
  param = {},
  body = {},
  token = "",
}: TAxiosWrapper): Promise<T> {
  return Instance({
    url: path,
    method,
    params: param,
    data: body,
    transformResponse: [
      function (response) {
        if (response && response.data) {
          response.data = JSON.parse(response.data);
        }
        return response;
      },
    ],
    headers: {
      Authorization: `Bearer ${getToken() || token}`,
    },
  });
}

Instance.interceptors.response.use(
  function (response) {
    const data = JSON.parse(response.data);
    return data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401) {
      localStorage.removeItem(TOKEN);
      if (!error.request.responseURL.includes("user/signin")) {
        window.location.reload();
      }
    }
    const errorObj = JSON.parse(error.response.data);
    return Promise.reject(errorObj);
  }
);
