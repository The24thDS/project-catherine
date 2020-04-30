import React, { Component } from "react";
import PropTypes from "prop-types";
import { EuiIcon, EuiButtonIcon } from "@elastic/eui";

import add from "../../../../../assets/add.svg";
import decline from "../../../../../assets/delete.svg";

import styles from "./FriendRequestItem.module.sass";

class FriendRequestItem extends Component {
  static propTypes = {
    profilePicture: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    isNew: PropTypes.bool,
    date: PropTypes.string,
  };

  render() {
    return (
      <div className={styles["friend-request-item"]}>
        <EuiButtonIcon iconType="check" className={styles["accept-button"]} />
        <div className={styles["user-details"]}>
          <EuiIcon
            className={styles["profile-picture"]}
            type={this.props.profilePicture}
          />
          <h2>
            {this.props.firstName} {this.props.lastName}
          </h2>
        </div>
        <EuiButtonIcon iconType="cross" className={styles["refuse-button"]} />
      </div>
    );
  }
}

export default FriendRequestItem;
