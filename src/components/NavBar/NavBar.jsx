import React, { Component } from "react";
import { EuiIcon } from "@elastic/eui";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";
import SockJsClient from "react-stomp";
import moment from "moment";

import DropdownMenu from "./DropDownMenu/DropDownMenu.jsx";
import MessageItem from "./DropDownMenu/MenuItems/MessageItem/";
import FriendRequestItem from "./DropDownMenu/MenuItems/FriendRequestItem/";
import NotificationItem from "./DropDownMenu/MenuItems/NotificationItem/";
import ProfileItem from "./DropDownMenu/MenuItems/ProfileItem/";
import {
  selectUserFullName,
  selectUserID,
  selectUserProfilePicture,
} from "../../redux/user/user.selectors.js";
import { addFriend } from "../../redux/friends/friends.actions.js";
import { logOut } from "../../redux/user/user.actions.js";
import SearchBar from "./SearchBar/SearchBar.jsx";
import ServerRequest from "../../utils/ServerRequest.js";
import PictureURL from "../../utils/PictureURL.js";

import logo from "../../assets/logo-white.svg";
import friendRequestsIcon from "../../assets/friendRequests-white.svg";
import messagesIcon from "../../assets/chat-white.svg";
import notificationsIcon from "../../assets/notifications-white.svg";
import settingsIcon from "../../assets/settings.svg";
import logoutIcon from "../../assets/logout.svg";
import profileIcon from "../../assets/profile.svg";

import styles from "./NavBar.module.sass";

class NavBar extends Component {
  state = {
    friendRequests: [],
    messages: [],
    notifications: [],
    attentionGrabberFriendRequests: false,
    attentionGrabberNotifications: false,
  };

  removeFriendRequest = (id) => {
    this.setState((prevState) => ({
      friendRequests: prevState.friendRequests.filter((el) => el.id !== id),
    }));
  };

  getFriendRequests = async () => {
    const request = new ServerRequest("/user/friendRequests");
    request.useAuthorization();
    const response = await request.send();
    if (response.status === 200) {
      const data = await response.json();
      const friendRequests = data.users.map((user) => ({
        ...user,
        profilePicture: new PictureURL(user.profilePicture).url,
      }));
      this.setState({
        friendRequests: friendRequests.map((el) => ({
          ...el,
          removeRequest: this.removeFriendRequest,
        })),
        attentionGrabberFriendRequests: friendRequests.length ? true : false,
      });
    }
  };
  showMessages = () => {};
  showNotifications = () => {};
  logout = () => {
    this.props.logOut();
    window.localStorage.removeItem("token");
    window.sessionStorage.removeItem("token");
  };

  receivedMessage = async (msg, topic) => {
    if (msg.type === "SENT") {
      // I received a friend request
      this.getFriendRequests();
    } else if (msg.type === "ACCEPTED") {
      // Someone accepted my friend request
      const req = new ServerRequest(
        "/user/details?user=" + msg.id
      ).useAuthorization();
      const response = await req.send();
      const data = await response.json();
      const friend = { ...data.user, online: data.online };
      this.props.addFriend(friend);
      // Create notification object
      const notification = {
        ...data.user,
        isNew: true,
        date: moment.utc(),
        action: "accepted your friend request.",
      };
      this.setState((prevState) => ({
        notifications: [...prevState.notifications, notification],
        attentionGrabberNotifications: true,
      }));
    }
  };

  componentDidMount() {
    this.getFriendRequests();
  }

  profileDropdownItems = [
    {
      name: "View profile",
      icon: profileIcon,
      onClick: () => {
        this.props.history.push("/user/" + this.props.userID);
      },
      style: { cursor: "pointer" },
    },
    // {
    //   name: "Settings",
    //   icon: settingsIcon,
    //   style: { cursor: "pointer" },
    // },
    {
      name: "Logout",
      icon: logoutIcon,
      onClick: this.logout,
      style: { cursor: "pointer" },
    },
    {
      name: "Logout",
      icon: logoutIcon,
      onClick: this.logout,
    },
  ];
  render() {
    return (
      <nav className={styles.navBar}>
        <div
          className={styles.brand}
          onClick={() => {
            this.props.history.push("/feed");
          }}
        >
          <EuiIcon type={logo} size="xxl" />
          <h1>Project Catherine</h1>
        </div>

        <SearchBar />

        <div className={styles.userActions}>
          <DropdownMenu
            MenuItemComponent={FriendRequestItem}
            menuItemsData={this.state.friendRequests}
            menuButtonIcon={friendRequestsIcon}
            menuTitle="Friend Requests"
            className={
              this.state.attentionGrabberFriendRequests
                ? styles["attention-grabber"]
                : null
            }
            onClick={() => {
              this.setState({
                attentionGrabberFriendRequests: false,
              });
            }}
          />
          <DropdownMenu
            MenuItemComponent={MessageItem}
            menuItemsData={this.state.messages}
            menuButtonIcon={messagesIcon}
            menuTitle="Your Messages"
          />
          <DropdownMenu
            MenuItemComponent={NotificationItem}
            menuItemsData={this.state.notifications}
            menuButtonIcon={notificationsIcon}
            menuTitle="Notifications"
            className={
              this.state.attentionGrabberNotifications
                ? styles["attention-grabber"]
                : null
            }
            onClick={() => {
              this.setState({
                attentionGrabberNotifications: false,
              });
            }}
            onPopoverClose={() => {
              this.setState((prevState) => ({
                notifications: prevState.notifications.map((el) => ({
                  ...el,
                  isNew: false,
                })),
              }));
            }}
          />

          <div className={styles.user}>
            <EuiIcon
              className={styles.profilePicture}
              type={this.props.userPFP}
            />
            <div className={styles.userInfo}>
              <p className={styles.userName}>{this.props.userName}</p>
              <span className={styles.status}>Custom status</span>
            </div>
            <DropdownMenu
              MenuItemComponent={ProfileItem}
              menuItemsData={this.profileDropdownItems}
              menuButtonIcon="arrowDown"
              menuTitle="Account Management"
            />
          </div>
        </div>
        <SockJsClient
          url={process.env.REACT_APP_WS_URL}
          topics={["/user/queue/notification"]}
          headers={{ ...new ServerRequest().useAuthorization().headers }}
          onMessage={this.receivedMessage}
        />
      </nav>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  userName: selectUserFullName,
  userPFP: selectUserProfilePicture,
  userID: selectUserID,
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(logOut()),
  addFriend: (friend) => dispatch(addFriend(friend)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
