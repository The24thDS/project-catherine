import React from "react";
import styles from "./AddComment.module.sass";
import { EuiFlexGroup } from "@elastic/eui";
import { EuiFlexItem } from "@elastic/eui";
import { EuiFieldText } from "@elastic/eui";
import { EuiIcon } from "@elastic/eui";

const AddComment = (props) => {
  return (
    <EuiFlexGroup className={styles.container}>
      <EuiFlexItem className={styles.profile_picture_container}>
        <EuiIcon
          className={styles.profile_picture}
          type={props.profilePicture}
          size="l"
        />
      </EuiFlexItem>
      <EuiFlexItem className={styles.text_field_container}>
        <EuiFieldText
          className={styles.comment_text_field}
          placeholder="Add a comment"
          fullWidth={true}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
export default AddComment;
