import React, { Component } from "react";
import { EuiFieldSearch, EuiIcon, EuiFieldText } from "@elastic/eui";

import DropdownMenu from "./DropDownMenu/DropDownMenu.jsx";
import MessageItem from "./DropDownMenu/MenuItems/MessageItem/";
import FriendRequestItem from "./DropDownMenu/MenuItems/FriendRequestItem/";
import NotificationItem from "./DropDownMenu/MenuItems/NotificationItem/";

import logo from "../../assets/logo-white.svg";
import profilePicturePlaceholder from "../../assets/logo-black.svg";
import friendRequestsIcon from "../../assets/friendRequests-white.svg";
import messagesIcon from "../../assets/chat-white.svg";
import notifications from "../../assets/notifications-white.svg";

import styles from "./NavBar.module.sass";

class NavBar extends Component {
  showFriendRequests = () => {};
  showMessages = () => {};
  showNotifications = () => {};
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
  notificationsData = [{}, {}];
  render() {
    return (
      <nav className={styles.navBar}>
        <div className={styles.nav}>
          <div className={styles.leftComponents}>
            <EuiIcon type={logo} size="xxl" />
            <p className={styles.logo}>Project Catherine</p>
          </div>
          <EuiFieldSearch placeholder="Search in Project Catherine" />
          <div className={styles.userActions}>
            <div className={styles.rightComponents}>
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
                menuItemsData={[]}
                menuTitle="Notifications"
                className={styles.icons}
              />
            </div>

            <div className={styles.item}>
              <EuiIcon
                className={styles.profilePicture}
                type={this.props.profilePicture}
              />
              <div className={styles.item2}>
                <p className={styles.userName}>
                  {this.props.firstName} {this.props.lastName}
                </p>
                <EuiFieldText
                  className={styles.status}
                  placeholder="Custom status"
                />
              </div>
              {/* <DropdownMenu
                className={styles.item3}
                menuTitle="Account Management"
                itemType="profile"
                icon="arrowDown"
              /> */}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
export default NavBar;
