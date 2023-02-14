import { create } from "zustand";

type TAddParams = {
  position: number;
  key: string;
  value: string;
  isSelected: boolean;
};
interface IRequest {
  params: { key: string; value: string; isSelected: boolean }[];
  addParams: ({ position, key, value, isSelected }: TAddParams) => void;
}
const intialState = {
  params: [{ key: "", value: "", isSelected: true }],
};
export const useStore = create<IRequest>((set) => ({
  params: intialState.params,
  addParams: ({ position, key, value, isSelected = false }) => {
    set((state: any) => {
      const params = state.params;
      params[position] = { ...params[position], [key]: value, isSelected };
      return { ...state, params };
    });
  },
}));
