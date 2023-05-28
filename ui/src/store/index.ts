import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";

import rootReducer from "./rootReducer";
import { rootSaga } from "./saga/index";
import { apiMiddleware } from "./middleware/api";
import { toastMiddleware } from "./middleware/toast";

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();
const allMiddleware = [apiMiddleware, toastMiddleware, sagaMiddleware];

console.log("import.meta.env.NODE_ENV", import.meta.env.VITE_ENV);
if (import.meta.env.VITE_ENV === "dev") {
  allMiddleware.push(logger);
}
// Mount it on the Store
const store = createStore(rootReducer, applyMiddleware(...allMiddleware));

// Run the saga
sagaMiddleware.run(rootSaga);

export default store;
