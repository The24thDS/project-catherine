import { friendsActionTypes } from "./friends.types";

export const setFriendsInfo = (friendsArray) => ({
  type: friendsActionTypes.SET_FRIENDS_INFO,
  payload: friendsArray,
});
