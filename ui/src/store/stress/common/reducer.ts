import { GET_SETTINGS } from "./actionTypes";
import { CommonAction, ICommon } from "./types";

const initialState: ICommon = {
  settings: {
    loading: false,
    data: undefined,
  },
};

export default (state = initialState, action: CommonAction) => {
  switch (action.type) {
    case GET_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          data: action.payload,
        },
      };

    default:
      return {
        ...state,
      };
  }
};
