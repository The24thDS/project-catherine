import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/";

import userReducer from "./user/user.reducer";
import friendsReducer from "./friends/friends.reducer";
import messagesReducer from "./messages/messages.reducer";

const persistConfig = {
  key: "root",
  storage: storage,
};

const reducer = combineReducers({
  user: userReducer,
  friends: friendsReducer,
  chats: messagesReducer,
});

const root = (currentState, action) => {
  if (action.type === "LOG_OUT") {
    currentState = undefined;
  }
  return reducer(currentState, action);
};

export default persistReducer(persistConfig, root);
