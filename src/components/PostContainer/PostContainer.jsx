import React, { useState } from "react";
import { EuiHorizontalRule, EuiIcon } from "@elastic/eui";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import AddComment from "./AddComment";
import Post from "./Post";
import Comment from "./Comment";
import ServerRequest from "../../utils/ServerRequest";
import { selectUserInfo } from "../../redux/user/user.selectors";

import styles from "./PostContainer.module.sass";

const PostContainer = (props) => {
  const [state, setState] = useState({
    isCommentPosting: false,
    areCommentsOpen: false,
    commentsData: [],
    commentsNumber: props.postInfo.comments,
    commentsPage: 0,
    isLastCommentsPage: false,
    isLikedByCurrentUser: props.postInfo.isLiked,
    likesNumber: props.postInfo.likes,
  });

  const fetchComments = async () => {
    if (!state.isLastCommentsPage && state.commentsNumber > 0) {
      const req = new ServerRequest(
        "/posts/" +
          props.postInfo.postId +
          "/comments?page=" +
          state.commentsPage
      )
        .useAuthorization()
        .useJsonBody();
      const response = await req.send();
      if (response.status === 200) {
        const data = await response.json();
        if (data.comments !== null) {
          setState({
            ...state,
            areCommentsOpen: true,
            commentsData: [...state.commentsData, ...data.comments],
            commentsPage: state.commentsPage + 1,
            isLastCommentsPage: data.last,
          });
        }
      }
    }
  };

  const likeClickHandler = async () => {
    const config = {
      method: state.isLikedByCurrentUser ? "DELETE" : "POST",
      amount: state.isLikedByCurrentUser ? -1 : 1,
    };
    const req = new ServerRequest(
      "/posts/" + props.postInfo.postId + "/like",
      config.method
    );
    req.useAuthorization().useJsonBody();
    const response = await req.send();

    if (response.status === 200) {
      setState({
        ...state,
        likesNumber: state.likesNumber + config.amount,
        isLikedByCurrentUser: !state.isLikedByCurrentUser,
      });
    }
  };

  const commentClickHandler = () => {
    if (state.commentsNumber > 0) {
      if (state.areCommentsOpen !== true && state.commentsData.length === 0) {
        fetchComments();
      }
      setState({
        ...state,
        areCommentsOpen: !state.areCommentsOpen,
      });
    }
  };

  const addCommentHandler = async (e) => {
    if (e.key === "Enter") {
      const text = e.target.value;
      setState({
        ...state,
        isCommentPosting: true,
      });
      const req = new ServerRequest(
        "/posts/" + props.postInfo.postId + "/comments",
        "POST",
        undefined,
        { text }
      );
      req.useAuthorization().useJsonBody();
      const response = await req.send();
      if (response.status === 200) {
        setState({
          ...state,
          commentsNumber: state.commentsNumber + 1,
          isCommentPosting: false,
        });
        if (state.areCommentsOpen) {
          const UTCnow = moment.utc().format("YYYY-MM-DD HH:mm:ss");
          setState({
            ...state,
            commentsData: [
              {
                user: {
                  profilePicture: props.currentUser.profilePicture,
                  firstName: props.currentUser.firstName,
                  lastName: props.currentUser.lastName,
                  id: props.currentUser.id,
                },
                comment: {
                  date: UTCnow,
                  text,
                },
              },
              ...state.commentsData,
            ],
          });
        }
        return true;
      }
    }
    return false;
  };

  let commentsContainer = [];
  if (state.areCommentsOpen) {
    commentsContainer = (
      <div className={styles.commentsContainer}>
        {state.commentsData.map((el, index) => {
          return (
            <Comment
              key={index}
              className={styles.comment}
              user={{
                ...el.user,
              }}
              commentData={{
                ...el.comment,
              }}
            />
          );
        })}
      </div>
    );
  }

  const showSeeMoreButton = () => {
    if (!state.isLastCommentsPage && state.areCommentsOpen) {
      return (
        <button onClick={fetchComments} className={styles.seeMoreButton}>
          See More
        </button>
      );
    } else if (state.isLastCommentsPage && state.areCommentsOpen) {
      return (
        <button onClick={commentClickHandler} className={styles.seeMoreButton}>
          See Less
        </button>
      );
    } else {
      return null;
    }
  };

  return (
    <section className={styles.postContainer}>
      <Post
        author={props.author}
        postData={{
          content: props.postInfo.content,
          date: props.postInfo.date,
          imageNames: props.postInfo.imageNames,
        }}
      />
      <EuiHorizontalRule margin="xxl" />
      <div className={styles.postActions}>
        <div
          title="Like"
          className={
            styles.button +
            " " +
            (state.isLikedByCurrentUser ? styles.active : null)
          }
          onClick={likeClickHandler}
        >
          <EuiIcon
            type="https://upload.wikimedia.org/wikipedia/commons/8/87/Symbol_thumbs_up.svg"
            size="l"
            style={{
              transform: "rotateY(180deg)",
            }}
          />
          <div className={styles.counter}>{state.likesNumber}</div>
        </div>
        <div
          title="Comment"
          className={
            styles.button + " " + (state.areCommentsOpen ? styles.active : null)
          }
          onClick={commentClickHandler}
        >
          <EuiIcon type="editorComment" size="l" />
          <div className={styles.counter}>{state.commentsNumber}</div>
        </div>
        <div title="Share" className={styles.button + " " + styles.disabled}>
          <div className={styles.counter}>0</div>
        </div>
      </div>
      <AddComment
        isCommentLoading={state.isCommentPosting}
        className={styles.add_comment}
        addCommentHandler={addCommentHandler}
      />
      {state.areCommentsOpen ? <EuiHorizontalRule margin="s" /> : null}
      {commentsContainer}
      {showSeeMoreButton()}
    </section>
  );
};

PostContainer.propTypes = {
  postInfo: PropTypes.shape({
    postId: PropTypes.number.isRequired,
    content: PropTypes.string,
    date: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired,
    imageNames: PropTypes.arrayOf(PropTypes.string),
    isLiked: PropTypes.bool.isRequired,
  }).isRequired,
  author: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectUserInfo,
});

export default connect(mapStateToProps)(PostContainer);
