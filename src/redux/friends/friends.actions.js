import { friendsActionTypes } from "./friends.types";

export const setFriendsInfo = (friendsArray) => ({
  type: friendsActionTypes.SET_FRIENDS_INFO,
  payload: friendsArray,
});

export const setFriendStatus = (friend) => ({
  type: friendsActionTypes.SET_FRIEND_STATUS,
  payload: friend,
});
