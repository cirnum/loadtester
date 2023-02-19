import { create } from "zustand";
import { IRequest, TAddParams, TMethodParams } from "../../../types";

const IntialRootState = {
  params: [{ key: "", value: "", isSelected: true }],
  headers: [{ key: "", value: "", isSelected: true }],
  body: {},
  addParams: (_: TMethodParams) => {},
  addHeader: (_: TMethodParams) => {},
  addBody: (_: object) => {},
};

function validURL(str: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

const constructUrl = (url: string, params: TAddParams[]) => {
  if (validURL(url)) {
    let updatedUrl = new URL(url);
    for (let val in params) {
      if (params[val].key && params[val].value) {
        updatedUrl.searchParams.set(
          params[val].key,
          params[val].value.toString()
        );
      }
    }
    return updatedUrl.toString();
  }
  return url;
};

export type StressRootState = typeof IntialRootState;
export const useStore = create<IRequest>((set, get) => ({
  params: IntialRootState.params,
  headers: IntialRootState.headers,
  body: {},
  addParams: ({ position, key, value, isSelected = true }: TMethodParams) => {
    set((state: IRequest) => {
      const params = state.params;
      if(key && value) {
        params[position] = { ...params[position], [key]: value, isSelected };
      } else {
        params[position] = { ...params[position], isSelected };
      }
      if (!params[position + 1]) {
        params[position + 1] = { key: "", value: "", isSelected: false };
      }
      return { ...state, params };
    });
  },
  addHeader: ({ position, key, value, isSelected = true }: TMethodParams) => {
    set((state: IRequest) => {
      const params = state.headers;
      if(key && value) {
        params[position] = { ...params[position], [key]: value, isSelected };
      } else {
        params[position] = { ...params[position], isSelected };
      };
      if (!params[position + 1]) {
        params[position + 1] = { key: "", value: "", isSelected: false };
      }
      return { ...state, params };
    });
  },
  addBody: (payload: object) => {
    set((state: IRequest) => {
      return { ...state, body: payload };
    });
  },
  getHeader: () => {
    const headers = get().headers;
    return headers.reduce((acc: any, header: TAddParams) => {
      const { key, value } = header;
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {});
  },
  getConstructedUrl: (url: string) => {
    const params = get().params;
    return constructUrl(url, params);
  },
}));
