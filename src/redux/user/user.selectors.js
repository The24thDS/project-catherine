import { createSelector } from "reselect";

import PictureURL from "../../utils/PictureURL";

const selectUser = (state) => state.user;

export const selectLoggedIn = createSelector(
  [selectUser],
  (user) => user.loggedIn
);

export const selectUserInfo = createSelector([selectUser], (user) => user.info);

export const selectUserFirstName = createSelector(
  [selectUserInfo],
  (info) => info.firstName
);

export const selectUserLastName = createSelector(
  [selectUserInfo],
  (info) => info.lastName
);
export const selectUserEmail = createSelector(
  [selectUserInfo],
  (info) => info.email
);
export const selectUserID = createSelector([selectUserInfo], (info) => info.id);

export const selectUserProfilePicture = createSelector(
  [selectUserInfo],
  (info) => new PictureURL(info.profilePicture).url
);

export const selectUserBirthDate = createSelector(
  [selectUserInfo],
  (info) => info.birthDate
);

export const selectUserFullName = createSelector(
  [selectUserFirstName, selectUserLastName],
  (firstName, lastName) => `${firstName} ${lastName}`
);

export const selectUserFormattedInfo = createSelector(
  [selectUserInfo, selectUserProfilePicture],
  (userInfo, userPFP) => ({ ...userInfo, profilePicture: userPFP })
);
