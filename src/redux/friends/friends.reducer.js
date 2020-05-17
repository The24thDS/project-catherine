import { friendsActionTypes } from "./friends.types";

const INITIAL_STATE = {};

const friendsReducer = (currentState = INITIAL_STATE, action) => {
  switch (action.type) {
    case friendsActionTypes.SET_FRIENDS_INFO:
      return action.payload;
    default:
      return currentState;
  }
};

export default friendsReducer;
