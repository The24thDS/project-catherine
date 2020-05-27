import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { EuiAvatar, EuiFilePicker, EuiPopover, EuiButton } from "@elastic/eui";
import Picker from "react-emojipicker";
import { emojify } from "react-emojione";
import { createStructuredSelector } from "reselect";
import moment from "moment";

import PictureURL from "../../utils/PictureURL";
import { selectUserInfo } from "../../redux/user/user.selectors";
import ServerRequest from "../../utils/ServerRequest";

import styles from "./AddPost.module.sass";

function AddPost(props) {
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState("");
  const [postState, setPostState] = useState({
    isLoading: false,
    content: "Post",
  });
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const inputRef = useRef(null);

  const onEmojiClick = (emojiObject) => {
    setContent(content + emojiObject.shortname);
  };

  const onFilePickerChange = (files) => {
    setFiles(files);
  };

  const onPostClick = async (ev) => {
    ev.preventDefault();

    if (content === "" && files.length === 0) {
      return false;
    }

    setPostState({
      isLoading: true,
      content: "Posting",
    });

    let photos = null;

    if (files.length !== 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append("photos", file);
      }

      let req = new ServerRequest(
        "/photos",
        "POST",
        undefined,
        formData
      ).useAuthorization();
      let response = await req.send();
      let data = await response.json();
      if (response.status === 200) {
        photos = data.photos;
      }
    }
    const body = {};
    if (content !== "") {
      body.content = content;
    }
    if (photos !== null) {
      body.photos = photos;
    }
    const req = new ServerRequest("/posts", "POST", undefined, body)
      .useAuthorization()
      .useJsonBody();
    const response = await req.send();

    if (response.status === 200) {
      const postObj = {
        liked: false,
        post: {
          postId: (await response.json()).id,
          content: content !== "" ? content : null,
          date: moment().format("YYYY-MM-DD HH:mm:ss"),
          imageNames: photos !== null ? photos : [],
          likes: 0,
          comments: 0,
        },
        user: {
          ...props.currentUser,
        },
      };
      console.log(postObj);
      props.insertPost(postObj);
      setContent("");
      setFiles([]);
      setPostState({
        isLoading: false,
        content: "Done",
      });
      inputRef.current.fileInput.value = "";
      inputRef.current.handleChange(null);
      setTimeout(() => {
        setPostState({
          isLoading: false,
          content: "Post",
        });
      }, 1500);
    }
  };

  return (
    <div className={styles["add-post-container"]}>
      <h1>Post something</h1>
      <div className={styles["content-area"]}>
        <EuiAvatar
          className={styles["profile-picture"]}
          imageUrl={new PictureURL(props.currentUser.profilePicture).url}
          name="user"
          data-private
        />
        <textarea
          name="add-post-content"
          id="add-post-content"
          className={styles.textarea}
          placeholder="Speak your mind..."
          onChange={(ev) => {
            setContent(ev.target.value);
          }}
          value={emojify(content, { output: "unicode" })}
          data-private="lipsum"
        ></textarea>
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
          anchorPosition="downRight"
          panelPaddingSize="none"
          repositionOnScroll={true}
          hasArrow={true}
          zIndex={1}
          panelClassName={styles["emoji-picker"]}
          display="block"
        >
          <Picker onEmojiSelected={onEmojiClick} />
        </EuiPopover>
      </div>
      <div className={styles.actions}>
        <EuiFilePicker
          id="post-images"
          multiple
          initialPromptText="Add images"
          onChange={onFilePickerChange}
          display="default"
          accept=".png, .jpg, .jpeg"
          className={styles["image-picker"]}
          ref={inputRef}
        />
        <EuiButton
          fill
          color="secondary"
          onClick={onPostClick}
          isLoading={postState.isLoading}
        >
          {postState.content}
        </EuiButton>
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectUserInfo,
});

export default connect(mapStateToProps, null)(AddPost);
