import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";

import rootReducer from "./rootReducer";
import { rootSaga } from "./saga/index";
import { apiMiddleware } from "./middleware/api";
import { toastMiddleware } from "./middleware/toast";

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Mount it on the Store
const store = createStore(
  rootReducer,
  applyMiddleware(apiMiddleware, toastMiddleware, sagaMiddleware, logger)
);

// Run the saga
sagaMiddleware.run(rootSaga);

export default store;
