import { useMutation } from "@tanstack/react-query";
import { TRequestPayload, TCommonResponseBody } from "../../types"
import ApiCall from "../Api";

export const useRequest = () => {
  const callStressRequest = (payload: TRequestPayload) => {
      console.log("payload", payload)
    return ApiCall<TCommonResponseBody>({ path: "/request", method: "POST", body: payload });
  };
  return useMutation(callStressRequest);
};
