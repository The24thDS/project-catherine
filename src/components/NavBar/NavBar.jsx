import React, { Component } from "react";
import {
  EuiFieldSearch,
  EuiIcon,
  EuiFieldText,
} from "@elastic/eui";
import logo from "../../assets/logo-white.svg";
import friendRequests from "../../assets/friendRequests-white.svg";
import messages from "../../assets/chat-white.svg";
import notifications from "../../assets/notifications-white.svg";
import styles from "./NavBar.module.sass";
import MessageDropdown from "./DropDownMenus/MessageDropDown/MessageDropDown.jsx";
class NavBar extends Component {
  showFriendRequests = () => {};
  showMessages = () => {};
  showNotifications = () => {};
  messages = [
    {
      firstName: "Zina",
      lastName: "Postica",
      read: false,
      lastMessage: "Hello",
      whoLastMessaged: false,
      time: "12:56",
    },
    {
      firstName: "Misa",
      lastName: "Postica",
      read: false,
      lastMessage: "Miau",
      whoLastMessaged: true,
      time: "13:08",
    },
  ];
  render() {
    return (
      <header className={styles.navBar}>
        <div className={styles.nav}>
          <div className={styles.left}>
            <EuiIcon type={logo} size="xxl" />
            <p className={styles.logo}>Project Catherine</p>
          </div>
          <div className={styles.search}></div>
          <EuiFieldSearch placeholder="Search in Project Catherine" />
          <div className={styles.right} />
          <div className={styles.rightComponents}>
            <MessageDropdown
              menuTitle="Friend Requests"
              itemType="friendRequest"
              className={styles.icons}
              icon={friendRequests}
              friendRequests={this.props.friendRequests}
            />
            <MessageDropdown
              menuTitle="Your Messages"
              itemType="message"
              className={styles.icons}
              icon={messages}
              messages={this.props.messages}
            />
            <MessageDropdown
              menuTitle="Notification center"
              itemType="notification"
              className={styles.icons}
              icon={notifications}
              notifications={this.props.notifications}
            />
          </div>

          <div className={styles.item}>
            <EuiIcon
              className={styles.item1}
              type={this.props.profilePicture}
            />
            <div className={styles.item2}>
              <p className={styles.name}>
                {this.props.firstName} {this.props.lastName}
              </p>
              <EuiFieldText
                className={styles.status}
                placeholder="Custom status"
              />
              </div>
              <MessageDropdown
                className={styles.item3}
                menuTitle="Account Management"
                itemType="profile"
                icon="arrowDown"
              />
          </div>
        </div>
      </header>
    );
  }
}
export default NavBar;
