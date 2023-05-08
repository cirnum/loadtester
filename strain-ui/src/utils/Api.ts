import axios from "axios";
import { TAxiosWrapper } from "../types";

const TOKEN = "token";

const getToken = (token: string) => {
  const xo = window.localStorage.getItem(token);
  if (xo) {
    return JSON.parse(xo).xo;
  }
  return "";
};
const Instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
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
      Authorization: `Bearer ${getToken(TOKEN)}`,
      "Content-Type": "application/json",
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
      window.location.reload();
    }
    const errorObj = JSON.parse(error.response.data);
    return Promise.reject(errorObj);
  }
);
