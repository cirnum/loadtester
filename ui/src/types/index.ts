export * from "./user.types";
export * from "./stressedRequest.types";

export type TCommonResponse = {
  status: number;
  message: string;
};
export interface IAuthProvider {
  children: React.ReactNode;
  userData: any;
}
export type TAxiosWrapper = {
  path: string;
  method: string;
  param?: object;
  body?: object;
};
