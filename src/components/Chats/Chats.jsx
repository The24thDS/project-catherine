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
        [friendInfo.email]: {
          ...friendInfo,
          receivedMessage: null,
          order: Object.keys(prevState.chatWindows).length,
        },
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

  closeWindow = (email) => {
    const windows = this.state.chatWindows;
    delete windows[email];
    this.setState({
      chatWindows: windows,
    });
  };

  componentDidUpdate(prevProps) {
    /* Stackoverflow magic */
    function comparer(otherArray) {
      return function (current) {
        return (
          otherArray.filter(function (other) {
            return other.id === current.id;
          }).length === 0
        );
      };
    }
    const difference = prevProps.friends
      .filter(comparer(this.props.friends))
      .map((el) => el.email);
    if (difference.length) {
      const chatWindows = this.state.chatWindows;
      difference.forEach((email) => {
        delete chatWindows[email];
      });
      this.setState({
        chatWindows: chatWindows,
      });
    }
  }

  render() {
    const { onFriendItemClick } = this;
    return (
      <div className={styles["chats-container"]}>
        {Object.values(this.state.chatWindows)
          .sort((a, b) => b.order - a.order)
          .map((chatWindow) => (
            <ChatWindow
              key={chatWindow.id}
              sendMessage={this.sendMessage}
              closeWindow={this.closeWindow}
              {...chatWindow}
            />
          ))}
        <ChatList {...{ onFriendItemClick }} friends={this.props.friends} />
        <SockJsClient
          url={process.env.REACT_APP_WS_URL}
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
