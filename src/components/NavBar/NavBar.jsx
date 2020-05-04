import React, { Component } from "react";
import { EuiFieldSearch, EuiIcon, EuiFieldText } from "@elastic/eui";
import logo from "../../assets/logo-white.svg";
import friendRequests from "../../assets/friendRequests-white.svg";
import messages from "../../assets/chat-white.svg";
import notifications from "../../assets/notifications-white.svg";
import styles from "./NavBar.module.sass";
import DropdownMenu from "./DropDownMenu/DropDownMenu.jsx";
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
                menuTitle="Friend Requests"
                itemType="friendRequest"
                className={styles.icons}
                icon={friendRequests}
                friendRequests={this.props.friendRequests}
              />
              <DropdownMenu
                menuTitle="Your Messages"
                itemType="message"
                className={styles.icons}
                icon={messages}
                messages={this.props.messages}
              />
              <DropdownMenu
                menuTitle="Notification center"
                itemType="notification"
                className={styles.icons}
                icon={notifications}
                notifications={this.props.notifications}
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
            <DropdownMenu
              className={styles.item3}
              menuTitle="Account Management"
              itemType="profile"
              icon="arrowDown"
            />
          </div>
          </div>
        </div>
      </nav>
    );
  }
}
export default NavBar;
