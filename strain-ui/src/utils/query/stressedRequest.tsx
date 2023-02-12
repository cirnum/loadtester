import { useQuery } from "@tanstack/react-query";
import { TStressedResponsePayload } from "../../types";
import ApiCall from "../Api";

export const useStressedRequest = (payload: any) => {
  const getStressedRequest = (payload: any) => {
    return ApiCall<TStressedResponsePayload>({
      path: "/request",
      method: "GET",
      param: payload,
    });
  };
  return useQuery(["requests", payload], () => getStressedRequest(payload));
};
