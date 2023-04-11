import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { ApplicationActions, ApplicationState } from "../types";
import ApiCall from "../../utils/Api";
// import { getErrorMessage } from "../../utils/errorMessage";

export const apiMiddleware: Middleware =
  (store: MiddlewareAPI<Dispatch<ApplicationActions>, ApplicationState>) =>
  (next: Dispatch<ApplicationActions>) =>
  (action: ApplicationActions) => {
    if (action.type !== "@app/API_CALL") {
      next(action);
      return;
    }
    if (action.onRequest) {
      store.dispatch(action.onRequest(action.payload));
    }
    ApiCall({
      path: action.path,
      method: action.method,
      body: action.payload,
      param: action.params,
    })
      .then((response) => {
        if (action.onSuccess) {
          store.dispatch(action.onSuccess(response));
        }
      })
      .catch((err) => {
        if (action.onFailure) {
          //   const message = getErrorMessage(action.onFailure().type, err);
          store.dispatch(action.onFailure(err.response?.data));
        }
      });
  };
