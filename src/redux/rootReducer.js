import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user/user.reducer";

const persistConfig = {
  key: "root",
  storage
};

const reducer = combineReducers({ user: userReducer });

export default persistReducer(persistConfig, reducer);
