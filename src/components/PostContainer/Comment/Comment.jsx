import React from "react";

import Post from "../Post";

import styles from "./Comment.module.sass";

const Comment = ({ user, commentData }) => {
  return (
    <div className={styles.comment}>
      <Post
        className={styles.postContent}
        author={{
          ...user,
        }}
        postData={{
          date: commentData.date,
          content: commentData.text,
          imageNames: [],
        }}
      />
    </div>
  );
};

export default Comment;
