import {
  ADD_OR_EDIT_SERVER,
  ADD_SERVER_FAILURE,
  ADD_SERVER_REQUEST,
  ADD_SERVER_SUCCESS,
  CLEAR_SERVER_STATE,
  DELETE_DIALOG_STATE,
  DELETE_SERVER_FAILURE,
  DELETE_SERVER_REQUEST,
  DELETE_SERVER_SUCCESS,
  GET_ALL_SERVER_FAILURE,
  GET_ALL_SERVER_REQUEST,
  GET_ALL_SERVER_SUCCESS,
  SELECT_DELETE_REQUEST,
  SERVER_CONFIG_FAILURE,
  SERVER_CONFIG_REQUEST,
  SERVER_CONFIG_SUCCESS,
  SYNC_WITH_MASTER,
  SYNC_WITH_MASTER_REQUEST,
} from "./actionTypes";
import { IServer, ServerAction } from "./types";

const initialState: IServer = {
  syncWithMaster: {
    loading: false,
  },
  serverConfig: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  serverList: {
    loading: false,
    data: undefined,
    error: undefined,
  },
  server: {
    addOrEdit: {
      actionState: undefined,
      server: undefined,
    },
    loading: false,
    data: undefined,
    error: undefined,
  },
  deleteRequest: {
    alertState: false,
    selectedRequest: undefined,
    loading: false,
    data: undefined,
    error: undefined,
  },
};

export default (state = initialState, action: ServerAction) => {
  switch (action.type) {
    case SYNC_WITH_MASTER:
      return {
        ...state,
        syncWithMaster: {
          loading: false,
        },
      };
    case SYNC_WITH_MASTER_REQUEST:
      return {
        ...state,
        syncWithMaster: {
          loading: true,
        },
      };
    case SERVER_CONFIG_REQUEST:
      return {
        ...state,
        serverConfig: {
          ...state.serverConfig,
          loading: true,
        },
      };
    case SERVER_CONFIG_SUCCESS: {
      return {
        ...state,
        serverConfig: {
          error: undefined,
          loading: false,
          data: action.payload.data,
        },
      };
    }
    case SERVER_CONFIG_FAILURE: {
      return {
        ...state,
        server: {
          loading: false,
          data: action.payload.data,
        },
      };
    }
    case ADD_SERVER_REQUEST:
      return {
        ...state,
        server: {
          ...state.server,
          loading: true,
        },
      };
    case ADD_SERVER_SUCCESS: {
      return {
        ...state,
        server: {
          error: undefined,
          loading: false,
          data: action.payload.data,
        },
      };
    }
    case ADD_SERVER_FAILURE:
      return {
        ...state,
        server: {
          loading: false,
          data: undefined,
          error: action.payload.error,
        },
      };
    case GET_ALL_SERVER_REQUEST:
      return {
        ...state,
        serverList: {
          ...state.serverList,
          loading: true,
        },
      };
    case GET_ALL_SERVER_SUCCESS: {
      return {
        ...state,
        serverList: {
          error: undefined,
          loading: false,
          data: action.payload.data,
        },
      };
    }
    case GET_ALL_SERVER_FAILURE:
      return {
        ...state,
        serverList: {
          loading: false,
          data: undefined,
          error: action.payload.error,
        },
      };
    case CLEAR_SERVER_STATE:
      return {
        ...state,
        server: {
          loading: false,
          data: undefined,
          error: undefined,
        },
      };
    case DELETE_SERVER_REQUEST:
      return {
        ...state,
        deleteRequest: {
          ...state.deleteRequest,
          loading: true,
        },
      };
    case DELETE_SERVER_SUCCESS: {
      return {
        ...state,
        deleteRequest: {
          error: undefined,
          loading: false,
          data: action.payload.data,
        },
      };
    }
    case DELETE_SERVER_FAILURE:
      return {
        ...state,
        deleteRequest: {
          loading: false,
          data: undefined,
          error: action.payload.error,
        },
      };
    case DELETE_DIALOG_STATE:
      return {
        ...state,
        deleteRequest: {
          ...state.deleteRequest,
          alertState: action.payload,
        },
      };
    case SELECT_DELETE_REQUEST:
      return {
        ...state,
        deleteRequest: {
          ...state.deleteRequest,
          selectedRequest: action.payload || undefined,
        },
      };
    case ADD_OR_EDIT_SERVER:
      return {
        ...state,
        server: {
          ...state.server,
          addOrEdit: action.payload,
        },
      };
    default:
      return {
        ...state,
      };
  }
};
