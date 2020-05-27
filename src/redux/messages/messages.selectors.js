// import { createSelector } from "reselect";

export const selectChatMessages = (state, props) => state.chats[props.id];
