import React from "react";
import PostContent from "../PostContent";
import styles from "./Comment.module.sass";
import { EuiFlexGroup } from "@elastic/eui";
import { EuiFlexItem } from "@elastic/eui";
const Comment = (props) => {
  return (
    <EuiFlexGroup className={styles.content}>
      <EuiFlexItem>
        <PostContent
          className={styles.postContent}
          profilePicture={props.profilePicture}
          name={props.name}
          timePosted={props.timePosted}
          textContent={props.textContent}
          image={[]}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default Comment;
