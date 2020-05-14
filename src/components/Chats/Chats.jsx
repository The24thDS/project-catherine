import React, { Component } from "react";

import ChatList from "./ChatList/";
import ChatWindow from "./ChatWindow/";

import styles from "./Chats.module.sass";

export default class Chats extends Component {
  state = {
    chatWindows: [],
  };

  onFriendItemClick = (friendInfo) => {
    this.setState((prevState) => ({
      chatWindows: [...prevState.chatWindows, friendInfo],
    }));
  };

  render() {
    const { onFriendItemClick } = this;
    return (
      <div className={styles["chats-container"]}>
        {this.state.chatWindows.map((chatWindow) => (
          <ChatWindow
            name={`${chatWindow.firstName} ${chatWindow.lastName}`}
            profilePicture={chatWindow.profilePicture}
          />
        ))}
        <ChatList {...{ onFriendItemClick }} />
      </div>
    );
  }
}
