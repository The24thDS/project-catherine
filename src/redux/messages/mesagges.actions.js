import { messagesActionTypes } from "./messages.types";

export const setChats = (chats) => ({
  type: messagesActionTypes.SET_CHATS,
  payload: chats,
});

export const addChat = (chat) => ({
  type: messagesActionTypes.ADD_CHAT,
  payload: chat,
});

export const deleteChat = (chat) => ({
  type: messagesActionTypes.DELETE_CHAT,
  payload: chat,
});

export const setChatMessages = (data) => ({
  type: messagesActionTypes.SET_CHAT_MESSAGES,
  payload: data,
});

export const addChatMessage = (data) => ({
  type: messagesActionTypes.ADD_CHAT_MESSAGE,
  payload: data,
});
