import { friendsActionTypes } from "./friends.types";

export const setFriendsInfo = (friends) => ({
  type: friendsActionTypes.SET_FRIENDS_INFO,
  payload: friends,
});

export const setFriendStatus = (friend) => ({
  type: friendsActionTypes.SET_FRIEND_STATUS,
  payload: friend,
});

export const removeFriend = (id) => ({
  type: friendsActionTypes.REMOVE_FRIEND,
  payload: id,
});

export const addFriend = (friend) => ({
  type: friendsActionTypes.ADD_FRIEND,
  payload: friend,
});
