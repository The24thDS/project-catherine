import React from "react";
import styles from "./PostContainer.module.sass";
import { EuiFlexGroup } from "@elastic/eui";
import { EuiFlexItem } from "@elastic/eui";
import AddComment from "./AddComment";
import Post from "./Post";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  selectUserFullName,
  selectUserID,
  selectUserProfilePicture,
} from "../../../redux/user/user.selectors.js";
const PostContainer = (props) => {
    return (
      <EuiFlexGroup className={styles.postContainer}>
        <EuiFlexItem className={styles.post}>
          <Post
            profilePicture={props.profilePicture}
            firstName={props.firstName}
            lastName={props.lastName}
            timePosted={props.timePosted}
            textContent={props.textContent}
            image={props.image}
            likes={props.likes}
            comments={props.comments}
            shares={props.shares}
          />
        </EuiFlexItem>
        <EuiFlexItem className={styles.add_comment_container}>
          <AddComment
            className={styles.add_comment}
            profilePicture={props.profilePicture}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
const mapStateToProps = createStructuredSelector({
  userName: selectUserFullName,
  userPFP: selectUserProfilePicture,
  userID: selectUserID,
});
export default connect(mapStateToProps)(PostContainer);
