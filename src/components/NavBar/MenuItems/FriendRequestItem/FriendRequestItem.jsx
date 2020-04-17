import React, { Component } from "react";
import PropTypes from "prop-types";
import { EuiIcon } from "@elastic/eui";
import styles from "./FriendRequestItem.module.sass";
import add from "../../../../assets/add.svg";
import decline from "../../../../assets/delete.svg";
import { EuiButtonIcon } from "@elastic/eui";
class FriendRequestItem extends Component {

  render() {
    return (
      <div className={styles.item}>
              <EuiButtonIcon iconType={add}className={styles.item1}/>
        <div classname={styles.item2}>
              <EuiIcon className={styles.item21} type={this.props.profilePicture}/>
              <p className={styles.name}>{this.props.firstName} {this.props.lastName}</p>
        </div>
        <EuiButtonIcon iconType={decline} className={styles.item3}/>
      </div>
    );
  }
}
FriendRequestItem.propTypes = {
  profilePicture: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  read: PropTypes.bool,
  time: PropTypes.string,
  action: PropTypes.string
};
export default FriendRequestItem;
