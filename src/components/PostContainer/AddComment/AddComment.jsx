import React, { useState } from "react";
import styles from "./AddComment.module.sass";
import { EuiFieldText, EuiAvatar } from "@elastic/eui";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectUserFullName,
  selectUserProfilePicture,
} from "../../../redux/user/user.selectors";

const AddComment = (props) => {
  const [value, setValue] = useState("");

  return (
    <div className={styles.container}>
      <EuiAvatar
        className={styles.profile_picture}
        imageUrl={props.currentUserPFP}
        name={props.currentUserName}
      />
      <EuiFieldText
        value={value}
        isLoading={props.isCommentLoading}
        onKeyDown={async (e) => {
          if (await props.addCommentHandler(e)) {
            setValue("");
          }
        }}
        className={styles.comment_text_field}
        placeholder="Add a comment"
        fullWidth={true}
        onChange={(ev) => setValue(ev.target.value)}
      />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUserName: selectUserFullName,
  currentUserPFP: selectUserProfilePicture,
});

export default connect(mapStateToProps)(AddComment);
