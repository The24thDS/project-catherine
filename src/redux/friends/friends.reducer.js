import { createReducer } from "@reduxjs/toolkit";

import { friendsActionTypes } from "./friends.types";

const INITIAL_STATE = {};

const friendsReducer = createReducer(INITIAL_STATE, {
  [friendsActionTypes.SET_FRIENDS_INFO]: (state, action) => action.payload,
  [friendsActionTypes.SET_FRIEND_STATUS]: (state, action) => {
    state[action.payload.id].online = action.payload.status;
  },
  [friendsActionTypes.REMOVE_FRIEND]: (state, action) => {
    delete state[action.payload];
  },
  [friendsActionTypes.ADD_FRIEND]: (state, action) => {
    state[action.payload.id] = action.payload;
  },
});

export default friendsReducer;
