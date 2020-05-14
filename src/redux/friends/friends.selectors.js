import { createSelector } from "reselect";

import PictureURL from "../../utils/PictureURL";

export const selectFriendsRaw = (state) => state.friends;

export const selectFriendsFormatted = createSelector(
  [selectFriendsRaw],
  (friends) =>
    friends.map((friend) => ({
      ...friend,
      profilePicture: new PictureURL(friend.profilePicture).url,
    }))
);
