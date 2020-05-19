import React, { Component } from "react";
import { EuiIcon } from "@elastic/eui";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

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
import SearchBar from "./SearchBar/SearchBar.jsx";
import { logOut } from "../../redux/user/user.actions.js";
import ServerRequest from "../../utils/ServerRequest.js";

import logo from "../../assets/logo-white.svg";
import friendRequestsIcon from "../../assets/friendRequests-white.svg";
import messagesIcon from "../../assets/chat-white.svg";
import notificationsIcon from "../../assets/notifications-white.svg";
import settingsIcon from "../../assets/settings.svg";
import logoutIcon from "../../assets/logout.svg";
import profileIcon from "../../assets/profile.svg";

import styles from "./NavBar.module.sass";
import PictureURL from "../../utils/PictureURL.js";

class NavBar extends Component {
  state = {
    friendRequests: [],
    messages: [],
    notifications: [],
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
        friendRequests,
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
            className={styles.icons}
          />
          <DropdownMenu
            MenuItemComponent={MessageItem}
            menuItemsData={this.state.messages}
            menuButtonIcon={messagesIcon}
            menuTitle="Your Messages"
            className={styles.icons}
          />
          <DropdownMenu
            MenuItemComponent={NotificationItem}
            menuItemsData={this.state.notifications}
            menuButtonIcon={notificationsIcon}
            menuTitle="Notifications"
            className={styles.icons}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
