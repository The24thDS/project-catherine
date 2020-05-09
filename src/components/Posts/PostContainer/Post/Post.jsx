import React, { Component } from "react";
import styles from "./Post.module.sass";
import { EuiFlexGroup } from "@elastic/eui";
import { EuiFlexItem } from "@elastic/eui";
import PostContent from "../PostContent";
class Post extends Component {
  render() {
    return (
      <EuiFlexGroup className={styles.post_container}>
        <EuiFlexItem className={styles.profile_details}>
          <PostContent
            className={styles.post_content}
            profilePicture={this.props.profilePicture}
            firstName={this.props.firstName}
            lastName={this.props.lastName}
            timePosted={this.props.timePosted}
            textContent={this.props.textContent}
            image={this.props.image}
          />
        </EuiFlexItem>
        <div className={styles.button_top_numbers_container}>
          <button className={styles.button_top_numbers}>{this.props.likes}</button>
          <button className={styles.button_top_numbers}>{this.props.comments}</button>
          <button className={styles.button_top_numbers}>{this.props.shares}</button>
        </div>
        <div className={styles.buttton_container}>
          <button className={styles.buttons}>Like</button>
          <button className={styles.buttons}>Comm</button>
          <button className={styles.buttons}>Share</button>
        </div>
      </EuiFlexGroup>
    );
  }
}
export default Post;
