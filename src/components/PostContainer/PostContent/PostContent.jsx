import React, { Component } from "react";
import styles from "./PostContent.module.sass";
import { EuiFlexGroup } from "@elastic/eui";
import { EuiFlexItem } from "@elastic/eui";
import { EuiIcon } from "@elastic/eui";
import PictureURL from "../../../utils/PictureURL";
import moment from "moment";
class PostContent extends Component {
  constructor(props){
    super(props);
    this.state={
      durationText: "",
      duration: 0
    };
  }
  getTime() {
    let now = new moment();
    const timeZoneOffset = now.utcOffset();
    now = now.subtract(timeZoneOffset, "minutes");
    let duration = Math.trunc(
      moment.duration(now.diff(this.props.timePosted)).asMinutes()
    );
    if (duration === 0) {
      return "Just Now";
    } else if (duration < 60) {
      if (duration === 1) return duration + " minute ago";
      else return duration + " minutes ago";
    } else if (duration < 60 * 24) {
      duration = Math.trunc(duration / 60);
      if (duration === 1) return duration + " hour ago";
      else return duration + " hours ago";
    } else {
      duration = Math.trunc(duration / (60 * 24));
      if (duration === 1) return duration + " day ago";
      else return duration + " days ago";
    }
  }
  rowNum = () => {
    let value = Math.sqrt(this.props.image.length);
    const truncValue = Math.trunc(value);
    if (value % truncValue !== 0) {
      value = truncValue + 1;
    }
    return value;
  };

  render() {
    document.documentElement.style.setProperty("--rowNum", this.rowNum());
    return (
      <EuiFlexGroup className={styles.root_container}>
        <EuiFlexItem>
          <EuiFlexGroup className={styles.profile_details}>
            <EuiFlexItem className={styles.profile_icon_container}>
              <EuiIcon
                className={styles.profile_icon}
                type={this.props.profilePicture}
                size="l"
              />
            </EuiFlexItem>
            <EuiFlexItem className={styles.profile_details_name_and_time}>
              <p className={styles.name}>{this.props.name}</p>
              <p className={styles.time_posted}>{this.getTime()}</p>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem className={styles.post_content}>
          <p className={styles.text_content}>{this.props.textContent}</p>
          <div className={styles.images}>
            {this.props.image.map((photo, index) => {
              return (
                <img
                  key={index}
                  className={styles.image}
                  src={new PictureURL(photo).url}
                  alt="Post Picture"
                />
              );
            })}
          </div>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
}
export default PostContent;
