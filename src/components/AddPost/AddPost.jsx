import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { EuiAvatar, EuiFilePicker } from "@elastic/eui";
import { createStructuredSelector } from "reselect";

import { selectUserProfilePicture } from "../../redux/user/user.selectors";
import ServerRequest from "../../utils/ServerRequest";

import styles from "./AddPost.module.sass";
import { EuiButton } from "@elastic/eui";

function AddPost(props) {
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState("");
  const [postState, setPostState] = useState({
    isLoading: false,
    content: "Post",
  });
  const inputRef = useRef(null);

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
          imageUrl={props.userPFP}
          name="user"
        />
        <textarea
          name="add-post-content"
          id="add-post-content"
          className={styles.textarea}
          placeholder="Speak your mind..."
          onChange={(ev) => {
            setContent(ev.target.value);
          }}
          value={content}
        ></textarea>
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
  userPFP: selectUserProfilePicture,
});

export default connect(mapStateToProps, null)(AddPost);
