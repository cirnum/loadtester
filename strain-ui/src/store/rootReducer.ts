import { combineReducers } from "redux";

import authReducer from "./auth/reducer";
import dashBoardReducer from "./stress/dashboard/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashBoardReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
