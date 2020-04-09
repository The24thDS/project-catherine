import { userActionTypes } from "./user.types";

const INITIAL_STATE = {
  loggedIn: false,
  info: null,
};

const userReducer = (currentState = INITIAL_STATE, action) => {
  switch (action.type) {
    case userActionTypes.SET_USER_INFO:
      return {
        ...currentState,
        info: action.payload,
      };
    case userActionTypes.SET_LOGGED_IN:
      return {
        ...currentState,
        loggedIn: action.payload,
      };
    default:
      return currentState;
  }
};

export default userReducer;
