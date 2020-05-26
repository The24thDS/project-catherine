import React, { useState } from "react";
import styles from "./AddComment.module.sass";
import { EuiAvatar, EuiPopover, EuiLoadingSpinner } from "@elastic/eui";
import Picker from "react-emojipicker";
import TextareaAutosize from "react-autosize-textarea";
import { emojify } from "react-emojione";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectUserFullName,
  selectUserProfilePicture,
} from "../../../redux/user/user.selectors";

const AddComment = (props) => {
  const [value, setValue] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const onEmojiClick = (emojiObject) => {
    setValue(value + emojiObject.shortname);
  };

  return (
    <div className={styles.container}>
      <EuiAvatar
        className={styles.profile_picture}
        imageUrl={props.currentUserPFP}
        name={props.currentUserName}
        data-private
      />
      <TextareaAutosize
        value={emojify(value, { output: "unicode" })}
        onKeyDown={(ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            props.addCommentHandler(ev).then((d) => {
              setValue("");
            });
          }
        }}
        className={
          styles.comment_text_field + " euiFieldText euiFieldText--fullWidth"
        }
        onChange={(ev) => setValue(ev.target.value)}
        data-private="lipsum"
      />
      {props.isCommentLoading ? (
        <EuiLoadingSpinner className={styles["comment-posting-spinner"]} />
      ) : null}
      <EuiPopover
        button={
          <span
            className={
              styles["emoji-button"] +
              " " +
              (isEmojiPickerOpen ? styles["emoji-active"] : null)
            }
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            role="img"
            aria-label="emoji picker"
          >
            😊
          </span>
        }
        isOpen={isEmojiPickerOpen}
        closePopover={() => setIsEmojiPickerOpen(false)}
        anchorPosition="upCenter"
        panelPaddingSize="none"
        repositionOnScroll={true}
        hasArrow={true}
        zIndex={1}
        panelClassName={styles["emoji-picker"]}
      >
        <Picker onEmojiSelected={onEmojiClick} />
      </EuiPopover>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUserName: selectUserFullName,
  currentUserPFP: selectUserProfilePicture,
});

export default connect(mapStateToProps)(AddComment);
