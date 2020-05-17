import { createReducer } from "@reduxjs/toolkit";

import { friendsActionTypes } from "./friends.types";

const INITIAL_STATE = {};

const friendsReducer = createReducer(INITIAL_STATE, {
  [friendsActionTypes.SET_FRIENDS_INFO]: (state, action) => action.payload,
  [friendsActionTypes.SET_FRIEND_STATUS]: (state, action) => {
    state[action.payload.id].online = action.payload.status;
  },
});

export default friendsReducer;
