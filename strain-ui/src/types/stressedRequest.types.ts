export type TStressedRequestPayload = {};

export type TRequest = {
  clients: number;
  created: number;
  headers: any;
  id: string;
  ips: string[];
  requests: number;
  time: number;
  url: string;
  userId: string;
};

export type TCommonResponseBody = {
  status: number;
  message: string;
};
export type TStressedResponsePayload = TCommonResponseBody & {
  data: TRequest[];
};

export type TAddParams = {
  key: string;
  value: string;
  isSelected?: boolean;
};
export type TMethodParams = TAddParams & { position: number };

export type TRestAPIMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface IRequest {
  params: TAddParams[];
  headers: TAddParams[];
  body: object;
  addParams: ({ position, key, value, isSelected }: TMethodParams) => void;
  addHeader: ({ position, key, value, isSelected }: TMethodParams) => void;
  addBody: (payload: object) => void;
  getConstructedUrl: (url: string) => string;
  getHeader: () => object
}

export interface TRequestPayload {
  clients: number;
  headers: object;
  keepAlive: boolean;
  method: TRestAPIMethods;
  postData: object;
  time: number;
  url: string;
}
