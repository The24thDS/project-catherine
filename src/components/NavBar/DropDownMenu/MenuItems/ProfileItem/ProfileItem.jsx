import React from "react";
import PropTypes from "prop-types";
import { EuiIcon } from "@elastic/eui";

import styles from "./ProfileItem.module.sass";

const ProfileItem = (props) => {
  return (
    <div className={styles.item} onClick={props.onClick}>
      <EuiIcon type={props.icon} />
      <p className={styles.name}>{props.name}</p>
    </div>
  );
};
ProfileItem.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
};
export default ProfileItem;
