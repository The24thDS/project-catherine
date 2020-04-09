import { createSelector } from "reselect";

const selectUser = (state) => state.user;

export const selectUserInfo = createSelector([selectUser], (user) => user.info);

export const selectLoggedIn = createSelector(
  [selectUser],
  (user) => user.loggedIn
);
