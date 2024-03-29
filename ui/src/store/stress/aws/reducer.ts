import {
  COMMON_FAILURE,
  COMMON_REQUEST,
  CREATE_EC2_SUCCESS,
  CREATE_PEM_FILE_REQUEST,
  CREATE_PEM_FILE_SUCCESS_AND_FAIL,
  DELETE_EC2_SUCCESS,
  GET_EC2_SERVERS_FAILURE,
  GET_EC2_SERVERS_REQUEST,
  GET_EC2_SERVERS_SUCCESS,
  GET_PEM_FILES_REQUEST,
  GET_PEM_FILES_SUCCESS,
  SELECT_DELETE_EC2,
  TOGGLE_CREATE_EC2_FORM,
} from "./actionTypes";
import { IAWS, AWSAction } from "./types";

const initialState: IAWS = {
  list: {
    loading: false,
    data: undefined,
  },
  common: {
    loading: false,
    data: undefined,
  },
  pem: {
    loading: false,
    data: undefined,
  },
  createPem: {
    loading: false,
    data: undefined,
  },
  willDelete: undefined,
  actions: {
    openCreateEC2Form: false,
  },
};

export default (state = initialState, action: AWSAction) => {
  switch (action.type) {
    case CREATE_PEM_FILE_REQUEST:
      return {
        ...state,
        createPem: {
          ...state.createPem,
          loading: true,
        },
      };
    case CREATE_PEM_FILE_SUCCESS_AND_FAIL:
      return {
        ...state,
        createPem: {
          ...state.createPem,
          loading: false,
          data: action.payload,
        },
      };

    case GET_PEM_FILES_REQUEST:
      return {
        ...state,
        pem: {
          ...state.pem,
          loading: true,
        },
      };
    case GET_PEM_FILES_SUCCESS:
      return {
        ...state,
        pem: {
          ...state.pem,
          loading: false,
          data: action.payload,
        },
      };

    case COMMON_REQUEST:
      return {
        ...state,
        common: {
          loading: true,
        },
      };
    case COMMON_FAILURE:
      return {
        ...state,
        common: {
          loading: false,
          data: action.payload,
        },
      };
    case GET_EC2_SERVERS_REQUEST:
      return {
        ...state,
        list: {
          ...state.list,
          loading: true,
        },
      };
    case GET_EC2_SERVERS_SUCCESS: {
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
          data: action.payload.data,
        },
        actions: {
          openCreateEC2Form: false,
        },
      };
    }
    case GET_EC2_SERVERS_FAILURE:
      return {
        ...state,
        list: {
          ...state.list,
          data: action.payload.data,
          loading: false,
        },
      };
    case TOGGLE_CREATE_EC2_FORM: {
      return {
        ...state,
        actions: {
          openCreateEC2Form: action.payload,
        },
      };
    }
    case SELECT_DELETE_EC2: {
      return {
        ...state,
        willDelete: action.payload,
      };
    }
    case DELETE_EC2_SUCCESS: {
      return {
        ...state,
        willDelete: undefined,
        common: {
          ...state.common,
          loading: false,
        },
      };
    }
    case CREATE_EC2_SUCCESS: {
      return {
        ...state,
        common: {
          ...state.common,
          loading: false,
        },
      };
    }
    default:
      return {
        ...state,
      };
  }
};
