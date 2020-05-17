import React, { useState } from "react";
import { createStructuredSelector } from "reselect";
import { EuiAvatar } from "@elastic/eui";
import { connect } from "react-redux";

import { selectFriendsFormatted } from "../../../redux/friends/friends.selectors";

import styles from "./ChatList.module.sass";

function ChatList(props) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div
      className={styles["chat-list-container"]}
      style={{ height: isChatOpen ? "50vh" : "40px" }}
    >
      <h1
        onClick={() => {
          setIsChatOpen(!isChatOpen);
        }}
      >
        Chat
      </h1>
      <div className={styles["friends-list"]}>
        {props.friends.map((friend) => (
          <div
            className={styles["friend-item"]}
            key={friend.id}
            onClick={() => {
              props.onFriendItemClick(friend);
            }}
          >
            <EuiAvatar
              name={`${friend.firstName} ${friend.lastName}`}
              imageUrl={friend.profilePicture}
              className={styles["friend-avatar"]}
            />
            <span className={styles["friend-name"]}>
              {friend.firstName} {friend.lastName}
            </span>
            <span
              className={`${styles["status-dot"]} ${
                friend.online ? styles.online : styles.offline
              }`}
            ></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;
