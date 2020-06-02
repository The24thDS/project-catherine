import React from "react";
import PropTypes from "prop-types";
import { EuiIcon } from "@elastic/eui";

import PictureURL from "../../../../../utils/PictureURL";

import styles from "./NotificationItem.module.sass";

const NotificationItem = (props) => {
  return (
    <div
      className={`${styles["notification-item"]} ${
        props.isNew ? styles.new : null
      }`}
    >
      <EuiIcon
        className={styles["profile-picture"]}
        size="l"
        type={new PictureURL(props.profilePicture).url}
      />
      <div className={styles["notification-details"]}>
        <h2>
          {props.firstName} {props.lastName}
        </h2>
        <time
          title={props.date.local().format("YYYY-DD-MM HH:mm")}
          dateTime={props.date.local().format("YYYY-DD-MM HH:mm")}
        >
          {props.date.local().fromNow()}
        </time>
        <p>{props.action}</p>
        {props.isNew ? <EuiIcon type="dot" color="#490" /> : null}
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  profilePicture: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  isNew: PropTypes.bool,
  date: PropTypes.string,
  action: PropTypes.string.isRequired,
};
export default NotificationItem;
