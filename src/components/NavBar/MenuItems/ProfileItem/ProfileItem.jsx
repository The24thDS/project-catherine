import React, { Component } from "react";
import PropTypes from "prop-types";
import { EuiIcon } from "@elastic/eui";
import styles from "./ProfileItem.module.sass";
class ProfileItem extends Component {
  render() {
    return (
      <div className={styles.item}>
        <EuiIcon type={this.props.icon} />
        <p className={styles.name}>{this.props.name}</p>
      </div>
    );
  }
}
ProfileItem.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
};
export default ProfileItem;
