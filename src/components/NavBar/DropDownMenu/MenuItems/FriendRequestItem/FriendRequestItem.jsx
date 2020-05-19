import React, { Component } from "react";
import PropTypes from "prop-types";
import { EuiAvatar, EuiButtonIcon } from "@elastic/eui";
import { connect } from "react-redux";

import ServerRequest from "../../../../../utils/ServerRequest";
import { setFriendsInfo } from "../../../../../redux/friends/friends.actions";
import { getUserFriends } from "../../../../../utils/user";

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

  addFriend = async () => {
    const userFriends = (await getUserFriends()).reduce(
      (acc, value) => ({ [value.id]: { ...value }, ...acc }),
      {}
    );
    this.props.setFriendsInfo(userFriends);
  };

  acceptButtonClick = async () => {
    const path = `/user/acceptFriendRequest/${this.props.id}`;
    const request = new ServerRequest(path, "POST").useAuthorization();
    const response = await request.send();
    if (response.status === 200) {
      await response.json();
      this.setState({
        message: `You're now friends with ${this.props.firstName} ${this.props.lastName}`,
        accepted: true,
      });
      window.setTimeout(() => {
        this.props.removeRequest(this.props.id);
      }, 2000);
      await this.addFriend();
    }
  };

  refuseButtonClick = async () => {
    const path = "/user/refuseFriendRequest/" + this.props.id;
    const request = new ServerRequest(path, "POST").useAuthorization();
    const response = await request.send();
    if (response.status === 200) {
      await response.json();
      this.setState({
        message: `Refused the friend request from ${this.props.firstName} ${this.props.lastName}`,
        refused: true,
      });
      window.setTimeout(() => {
        this.props.removeRequest(this.props.id);
      }, 2000);
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
            <div className={styles["user-details"]}>
              <EuiAvatar
                className={styles["profile-picture"]}
                imageUrl={this.props.profilePicture}
                name={this.props.firstName + " " + this.props.lastName}
              />
              <h2>
                {this.props.firstName} {this.props.lastName}
              </h2>
            </div>
            <EuiButtonIcon
              iconType="check"
              className={styles["accept-button"]}
              aria-label="Accept friend request"
              onClick={this.acceptButtonClick}
            />
            <EuiButtonIcon
              iconType="cross"
              className={styles["refuse-button"]}
              aria-label="Refuse friend request"
              onClick={this.refuseButtonClick}
            />
          </>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setFriendsInfo: (friends) => dispatch(setFriendsInfo(friends)),
});

export default connect(null, mapDispatchToProps)(FriendRequestItem);
