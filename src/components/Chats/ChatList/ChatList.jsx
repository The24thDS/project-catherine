import React, { useState } from "react";
import { createStructuredSelector } from "reselect";
import { EuiAvatar } from "@elastic/eui";
import { connect } from "react-redux";

import { selectFriendsFormatted } from "../../../redux/friends/friends.selectors";

import styles from "./ChatList.module.sass";

function ChatList(props) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className={styles["chat-list-container"]}>
      <h1
        onClick={() => {
          setIsChatOpen(!isChatOpen);
        }}
      >
        Chat
      </h1>
      {isChatOpen ? (
        <>
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
              {friend.firstName} {friend.lastName}
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  friends: selectFriendsFormatted,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
