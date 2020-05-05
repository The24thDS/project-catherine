import React, { Component } from "react";
import { EuiFieldSearch, EuiIcon } from "@elastic/eui";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

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

import logo from "../../assets/logo-white.svg";
import profilePicturePlaceholder from "../../assets/logo-black.svg";
import friendRequestsIcon from "../../assets/friendRequests-white.svg";
import messagesIcon from "../../assets/chat-white.svg";
import notificationsIcon from "../../assets/notifications-white.svg";
import settingsIcon from "../../assets/settings.svg";
import logoutIcon from "../../assets/logout.svg";
import profileIcon from "../../assets/profile.svg";

import styles from "./NavBar.module.sass";
import { setLoggedIn, setUserInfo } from "../../redux/user/user.actions.js";

class NavBar extends Component {
  showFriendRequests = () => {};
  showMessages = () => {};
  showNotifications = () => {};
  logout = () => {
    this.props.setLoggedIn(false);
    this.props.setUserInfo(null);
    window.localStorage.removeItem("token");
    window.sessionStorage.removeItem("token");
  };
  // test data
  messagesData = [
    {
      profilePicture: profilePicturePlaceholder,
      firstName: "Zina",
      lastName: "Postica",
      message: "Hello",
      userIsMessageAuthor: true,
      date: "12:56",
    },
    {
      profilePicture: profilePicturePlaceholder,
      firstName: "Misa",
      lastName: "Postica",
      isNew: true,
      message: "Miau",
      userIsMessageAuthor: false,
      date: "13:08",
    },
  ];
  friendRequestsData = [
    {
      profilePicture: profilePicturePlaceholder,
      firstName: "Zina",
      lastName: "Postica",
      date: "12:56",
    },
    {
      profilePicture: profilePicturePlaceholder,
      firstName: "Aurel",
      lastName: "Mercenarul",
      isNew: true,
      date: "13:08",
    },
  ];
  notificationsData = [
    {
      profilePicture: profilePicturePlaceholder,
      firstName: "Aurel",
      lastName: "Mercenarul",
      isNew: true,
      date: "13:08",
      action: "Liked your post",
    },
    {
      profilePicture: profilePicturePlaceholder,
      firstName: "Aurel",
      lastName: "Mercenarul",
      isNew: false,
      date: "15:08",
      action: "Liked your post",
    },
  ];
  profileDropdownItems = [
    {
      name: "View profile",
      icon: profileIcon,
    },
    {
      name: "Settings",
      icon: settingsIcon,
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
        <div className={styles.brand}>
          <EuiIcon type={logo} size="xxl" />
          <h1>Project Catherine</h1>
        </div>
        <EuiFieldSearch placeholder="Search in Project Catherine" />
        <div className={styles.userActions}>
          <DropdownMenu
            MenuItemComponent={FriendRequestItem}
            menuItemsData={this.friendRequestsData}
            menuButtonIcon={friendRequestsIcon}
            menuTitle="Friend Requests"
            className={styles.icons}
          />
          <DropdownMenu
            MenuItemComponent={MessageItem}
            menuItemsData={this.messagesData}
            menuButtonIcon={messagesIcon}
            menuTitle="Your Messages"
            className={styles.icons}
          />
          <DropdownMenu
            MenuItemComponent={NotificationItem}
            menuItemsData={this.notificationsData}
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
  setLoggedIn: (loggedIn) => dispatch(setLoggedIn(loggedIn)),
  setUserInfo: (info) => dispatch(setUserInfo(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
