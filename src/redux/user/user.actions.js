import { userActionTypes } from "./user.types";

export const setUserInfo = (userInfo) => ({
  type: userActionTypes.SET_USER_INFO,
  payload: userInfo,
});

export const setLoggedIn = (loggedIn) => ({
  type: userActionTypes.SET_LOGGED_IN,
  payload: loggedIn,
});
