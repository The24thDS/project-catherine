import React, { Component } from "react";
import PropTypes from "prop-types";
import { EuiIcon, EuiButtonIcon } from "@elastic/eui";

import styles from "./FriendRequestItem.module.sass";
import ServerRequest from "../../../../../utils/ServerRequest";

class FriendRequestItem extends Component {
  state = {
    accepted: false,
    refused: false,
  };

  static propTypes = {
    id: PropTypes.number.isRequired,
    profilePicture: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    isNew: PropTypes.bool,
    date: PropTypes.string,
  };

  acceptButtonClick = async () => {
    const path = `/user/acceptFriendRequest/${this.props.id}`;
    const request = new ServerRequest(path, "POST").useAuthorization();
    const response = await request.send();
    if (response.status === 200) {
      const data = await response.json();
      this.setState({
        message: `You're now friends with ${this.props.firstName} ${this.props.lastName}`,
        accepted: true,
      });
    }
  };

  render() {
    return (
      <div
        className={
          styles["friend-request-item"] +
          " " +
          (this.state.accepted || this.state.refused
            ? styles["friend-request-message"]
            : null)
        }
      >
        {this.state.accepted || this.state.refused ? (
          this.state.message
        ) : (
          <>
            <EuiButtonIcon
              iconType="check"
              className={styles["accept-button"]}
              aria-label="Accept friend request"
              onClick={this.acceptButtonClick}
            />
            <div className={styles["user-details"]}>
              <EuiIcon
                className={styles["profile-picture"]}
                type={this.props.profilePicture}
              />
              <h2>
                {this.props.firstName} {this.props.lastName}
              </h2>
            </div>
            <EuiButtonIcon
              iconType="cross"
              className={styles["refuse-button"]}
              aria-label="Refuse friend request"
            />
          </>
        )}
      </div>
    );
  }
}

export default FriendRequestItem;
