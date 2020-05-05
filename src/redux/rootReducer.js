import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

import userReducer from "./user/user.reducer";

const persistConfig = {
  key: "root",
  storage: storageSession,
};

const reducer = combineReducers({ user: userReducer });

const root = (currentState, action) => {
  if (action.type === "LOG_OUT") {
    currentState = undefined;
  }
  return reducer(currentState, action);
};

export default persistReducer(persistConfig, root);
