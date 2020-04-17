import React, { Component } from "react";
import styles from "./DropDownMenu.module.sass";
import { EuiPopover, EuiButtonIcon, EuiPopoverTitle } from "@elastic/eui";
import MessageItem from "./MenuItems/MessageItem/MessageItem.jsx";
import NotificationItem from "./MenuItems/NotificationItem/NotificationItem.jsx";
import ProfileItem from "./MenuItems/ProfileItem/ProfileItem.jsx";
import FriendRequestItem from "./MenuItems/FriendRequestItem/FriendRequestItem.jsx";
import settingsIcon from "../../../assets/settings.svg";
import logoutIcon from "../../../assets/logout.svg";
import profileIcon from "../../../assets/profile.svg";
class DropDownMenu extends Component {
  state = {
    isPopoverOpen: false,
    backGround: "#227455",
  };
  determineColor() {
    let color;
    if (this.state.isPopoverOpen) {
      color = "#227455";
    } else {
      color = "#028D68";
    }
    return color;
  }
  onButtonClick() {
    this.setState({
      isPopoverOpen: !this.state.isPopoverOpen,
      backGround: this.determineColor(),
    });
  }

  closePopover() {
    this.setState({
      isPopoverOpen: false,
      backGround: this.determineColor(),
    });
  }

  render() {
    const button = (
      <EuiButtonIcon
        className={styles.icon}
        iconType={this.props.icon}
        iconSize="l"
        onClick={this.onButtonClick.bind(this)}
        style={{ backgroundColor: this.state.backGround }}
        aria-label="Next"
      />
    );
    let item = null;
    const setItems = () => {
      switch (this.props.itemType) {
        case "message":
          item = this.props.messages.map((message, i) => {
            return (
              <MessageItem
                profilePicture={message.profilePicture}
                firstName={message.firstName}
                lastName={message.lastName}
                read={message.read}
                whoLastMessaged={message.whoLastMessaged}
                time={message.time}
                key={message.id}
              />
            );
          });
          break;
        case "notification":
          item = this.props.notifications.map((notification) => {
            return (
              <NotificationItem
                profilePicture={notification.profilePicture}
                firstName={notification.firstName}
                lastName={notification.lastName}
                read={notification.read}
                action={notification.action}
                time={notification.time}
                key={notification.id}
              />
            );
          });
          break;
        case "profile":
          item = (
            <div>
              <ProfileItem icon={profileIcon} name="View Profile"></ProfileItem>
              <ProfileItem icon={settingsIcon} name="Settings"></ProfileItem>
              <ProfileItem icon={logoutIcon} name="Log Out"></ProfileItem>
            </div>
          );
          break;
        case "friendRequest":
          item = this.props.friendRequests.map((friendRequest, index) => {
            return (
              <FriendRequestItem
                profilePicture={friendRequest.profilePicture}
                firstName={friendRequest.firstName}
                lastName={friendRequest.lastName}
                read={friendRequest.read}
                action={friendRequest.action}
                time={friendRequest.time}
                key={friendRequest.id}
              />
            );
          });
          break;
        default:
          item = null;
          break;
      }
    };
    setItems();

    return (
      <div>
        <EuiPopover
          className={styles.button}
          button={button}
          isOpen={this.state.isPopoverOpen}
          closePopover={this.closePopover.bind(this)}
        >
          <EuiPopoverTitle>{this.props.menuTitle}</EuiPopoverTitle>
          {item}
        </EuiPopover>
      </div>
    );
  }
}
export default DropDownMenu;
