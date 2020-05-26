import { createReducer } from "@reduxjs/toolkit";

import { messagesActionTypes } from "./messages.types";

const INITIAL_STATE = {};

const messagesReducer = createReducer(INITIAL_STATE, {
  [messagesActionTypes.SET_CHATS]: (state, action) => action.payload,
  [messagesActionTypes.SET_CHAT_MESSAGES]: (state, action) => {
    state[action.payload.id] = action.payload.messages;
  },
  [messagesActionTypes.ADD_CHAT]: (state, action) => {
    state = { ...state, [action.payload.id]: action.payload.messages };
  },
  [messagesActionTypes.DELETE_CHAT]: (state, action) => {
    delete state[action.payload];
  },
  [messagesActionTypes.ADD_CHAT_MESSAGE]: (state, action) => {
    state[action.payload.id] = [
      ...(state[action.payload.id] !== undefined
        ? state[action.payload.id]
        : []),
      action.payload.message,
    ];
  },
});

export default messagesReducer;
