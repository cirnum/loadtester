import { combineReducers } from "redux";

import authReducer from "./auth/reducer";
import dashBoardReducer from "./stress/dashboard/reducer";
import requestReducer from "./stress/request/reducer";
import serverReducer from "./stress/server/reducer";
import awsReducer from "./stress/aws/reducer";
import commonReducer from "./stress/common/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashBoardReducer,
  requestReport: requestReducer,
  server: serverReducer,
  aws: awsReducer,
  common: commonReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
