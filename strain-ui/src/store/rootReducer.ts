import { combineReducers } from "redux";

import authReducer from "./auth/reducer";
import dashBoardReducer from "./stress/dashboard/reducer";
import requestReducer from "./stress/request/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashBoardReducer,
  requestReport: requestReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
