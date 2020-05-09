import React, { Component } from "react";
import styles from "./PostContent.module.sass";
import { EuiFlexGroup } from "@elastic/eui";
import { EuiFlexItem } from "@elastic/eui";
import { EuiIcon } from "@elastic/eui";
import PictureURL from "../../../../utils/PictureURL";
class PostContent extends Component {
  render() {
    const rowNum = () => {
      let value = Math.sqrt(this.props.image.length);
      const truncValue = Math.trunc(value);
      if (value % truncValue !== 0) {
        value = truncValue + 1;
      }
      console.log(value);
      return value;
    };
    document.documentElement.style.setProperty("--rowNum", rowNum());
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
              <p className={styles.name}>
                {this.props.firstName} {this.props.lastName}
              </p>
              <p className={styles.time_posted}>{this.props.timePosted} ago</p>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem className={styles.post_content}>
          <p className={styles.text_content}>{this.props.textContent}</p>
          <div className={styles.images}>
            {this.props.image.map( (photo, index) => {
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
