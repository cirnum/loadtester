import { useMutation } from "@tanstack/react-query";
import { TLoginResponsePayLoad } from "../../types"
import ApiCall from "../Api";

export const useLogin = () => {
  const requestLogin = (payload: any) => {
    return ApiCall<TLoginResponsePayLoad>({ path: "/login", method: "POST", body: payload });
  };
  return useMutation(requestLogin);
};

export const useRegister = () => {
  const requestLogin = (payload: any) => {
    return ApiCall<TLoginResponsePayLoad>({ path: "/registration", method: "POST", body: payload });
  };
  return useMutation(requestLogin);
};
