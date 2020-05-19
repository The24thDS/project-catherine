import React, { Component } from "react";
import PropTypes from "prop-types";
import { EuiIcon } from "@elastic/eui";

import styles from "./MessageItem.module.sass";

class MessageItem extends Component {
  static propTypes = {
    profilePicture: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    isNew: PropTypes.bool,
    message: PropTypes.string,
    userIsMessageAuthor: PropTypes.bool.isRequired,
    date: PropTypes.string,
  };

  render() {
    return (
      <div
        className={`${styles["message-item-container"]} ${
          this.props.isNew ? styles["new"] : ""
        }`}
      >
        <EuiIcon
          size="xl"
          className={styles["profile-picture"]}
          type={this.props.profilePicture}
        />
        <div className={styles["message-details"]}>
          <h2 className="contact-name">
            {this.props.firstName} {this.props.lastName}
          </h2>
          <time dateTime={this.props.date}>{this.props.date}</time>
          <span className="message-content">
            {this.props.userIsMessageAuthor ? "You" : this.props.firstName}
            {": " + this.props.message}
          </span>
          {this.props.isNew ? <EuiIcon type="dot" color="#490" /> : null}
        </div>
      </div>
    );
  }
}

export default MessageItem;
