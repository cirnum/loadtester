import axios from "axios";
import { TAxiosWrapper } from "../types";

const TOKEN = "token";
const Instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem(TOKEN),
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
    method: method,
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
      Authorization: localStorage.getItem(TOKEN),
      "Content-Type": "application/json",
    },
  });
}

Instance.interceptors.response.use(
  function (response) {
    response = JSON.parse(response.data);
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // if (error.response.status === 401) {
    //   localStorage.removeItem(TOKEN);
    //   window.location.reload();
    // }
    error.response.data = JSON.parse(error.response.data);
    return Promise.reject(error);
  }
);
