import React, { Component } from "react";
import SockJsClient from "react-stomp";
import moment from "moment";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import ChatList from "./ChatList/";
import ChatWindow from "./ChatWindow/";
import ServerRequest from "../../utils/ServerRequest";
import { setFriendStatus } from "../../redux/friends/friends.actions";
import { selectFriendsFormatted } from "../../redux/friends/friends.selectors";

import styles from "./Chats.module.sass";

class Chats extends Component {
  state = {
    chatWindows: {},
  };

  onFriendItemClick = (friendInfo) => {
    this.setState((prevState) => ({
      chatWindows: {
        ...prevState.chatWindows,
        [friendInfo.email]: { ...friendInfo, receivedMessage: null },
      },
    }));
  };

  sendMessage = (message) => {
    this.clientRef.sendMessage("/app/chat", JSON.stringify(message));
  };

  receivedMessage = (msg, topic) => {
    if (topic === "/user/queue/chat") {
      let hasChatWindow = true;
      if (this.state[msg.sender] === undefined) {
        hasChatWindow = false;
      }
      this.setState((prevState) => ({
        chatWindows: {
          ...prevState.chatWindows,
          [msg.sender]: {
            ...(hasChatWindow
              ? prevState.chatWindows[msg.sender]
              : this.props.friends.find((f) => f.email === msg.sender)),
            receivedMessage: {
              moment: moment().valueOf(),
              content: msg.message,
            },
          },
        },
      }));
    } else if (topic === "/user/queue/online") {
      const friend = {
        id: msg.id,
        status: msg.type === "CONNECTED" ? true : false,
      };
      const friendChatWindow = Object.values(this.state.chatWindows).find(
        (cw) => cw.id === friend.id
      );
      if (friendChatWindow) {
        this.setState((prevState) => ({
          chatWindows: {
            ...prevState.chatWindows,
            [friendChatWindow.email]: {
              ...friendChatWindow,
              online: friend.status,
            },
          },
        }));
      }
      this.props.setFriendStatus(friend);
    }
  };

  render() {
    const { onFriendItemClick } = this;
    return (
      <div className={styles["chats-container"]}>
        {Object.values(this.state.chatWindows).map((chatWindow) => (
          <ChatWindow
            key={chatWindow.id}
            sendMessage={this.sendMessage}
            {...chatWindow}
          />
        ))}
        <ChatList {...{ onFriendItemClick }} friends={this.props.friends} />
        <SockJsClient
          url="https://localhost:8443/ws"
          topics={["/user/queue/chat", "/user/queue/online"]}
          headers={{ ...new ServerRequest().useAuthorization().headers }}
          onMessage={this.receivedMessage}
          ref={(client) => {
            this.clientRef = client;
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  friends: selectFriendsFormatted,
});

const mapDispatchToProps = (dispatch) => ({
  setFriendStatus: (friend) => dispatch(setFriendStatus(friend)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chats);
