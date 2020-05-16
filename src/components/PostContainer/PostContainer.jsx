import React, { useState } from "react";
import styles from "./PostContainer.module.sass";
import { EuiFlexGroup } from "@elastic/eui";
import { EuiFlexItem } from "@elastic/eui";
import AddComment from "./AddComment";
import Post from "./Post";
import Comment from "./Comment";
import ServerRequest from "../../utils/ServerRequest";
import PictureURL from "../../utils/PictureURL";
import moment from "moment";
import moreIcon from "../../assets/more.svg";
import deleteIcon from "../../assets/delete.svg";
import ProfileItem from "../NavBar/DropDownMenu/MenuItems/ProfileItem";
import DropdownMenu from "../NavBar/DropDownMenu/DropDownMenu.jsx";
const PostContainer = (props) => {
  const [state, setState] = useState({
    isCommentLoading: false,
    areCommentsLoaded: false,
    comments: [],
    commentNr: props.comments,
    commentPageNr: 0,
    islastPage: false,
    value: "",
  });

  const postDropdownItems = [
    {
      name: "Delete Post",
      icon: deleteIcon,
      onClick: () => props.deletePost(props.postID),
    },
  ];

  const fetchComments = async () => {
    if (!state.islastPage && state.commentNr > 0) {
      const req = new ServerRequest(
        "/posts/" + props.postID + "/comments?page=" + state.commentPageNr
      );
      req.useAuthorization().useJsonBody();
      const response = await req.send();

      if (response.status === 200) {
        let data = await response.json();
        if (data.comments.length > 0) {
          data.comments.map((comment) => {
            comment.user.profilePicture = new PictureURL(
              comment.user.profilePicture
            ).url;
          });
          setState({
            ...state,
            areCommentsLoaded: true,
            comments: [...state.comments, ...data.comments],
            commentPageNr: state.commentPageNr + 1,
            islastPage: data.last,
          });
        }
      }
    }
  };
  const commentClickHandler = () => {
    if (state.commentNr > 0) {
      setState({
        ...state,
        areCommentsLoaded: !state.areCommentsLoaded,
      });
    }
    if (state.commentPageNr === 0) {
      fetchComments();
    }
  };
  const onChangeCommentHandler = (e) => {
    setState({ ...state, value: e.target.value });
  };
  const addCommentHandler = async (e) => {
    if (e.key == "Enter") {
      const text = e.target.value;
      setState({ ...state, isCommentLoading: true });
      const req = new ServerRequest(
        "/posts/" + props.postID + "/comments",
        "POST",
        undefined,
        { text: text }
      );
      req.useAuthorization().useJsonBody();
      const response = await req.send();
      if (response.status === 200) {
        setState({
          ...state,
          commentNr: state.commentNr + 1,
          isCommentLoading: false,
          value: "",
        });
        if (state.areCommentsLoaded) {
          let now = new moment();
          const timeZoneOffset = now.utcOffset();
          now = now.subtract(timeZoneOffset, "minutes");
          setState({
            ...state,
            comments: [
              {
                user: {
                  profilePicture: props.reduxuserPFP,
                  firstName: props.reduxuserName,
                  lastName: "",
                },
                comment: {
                  date: now,
                  text: text,
                },
              },
              ...state.comments,
            ],
          });
        }
      }
    } else {
      setState({ ...state, value: e.target.value });
    }
  };
  let comments = [];
  let commBackGround = "white";
  if (state.areCommentsLoaded) {
    commBackGround = "#dde6e4";
    console.log(state.comments);
    comments = (
      <div className={styles.commentContainer}>
        {state.comments.map((comment, index) => {
          return (
            <Comment
              key={index}
              className={styles.comment}
              profilePicture={comment.user.profilePicture}
              name={comment.user.firstName + " " + comment.user.lastName}
              timePosted={comment.comment.date}
              textContent={comment.comment.text}
            />
          );
        })}
      </div>
    );
  }
  const showSeeMoreButton = () => {
    if (!state.islastPage && state.areCommentsLoaded) {
      return (
        <button onClick={fetchComments} className={styles.seeMoreButton}>
          See More
        </button>
      );
    } else if (state.islastPage && state.areCommentsLoaded) {
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
    <EuiFlexGroup className={styles.postContainer}>
      <div className={styles.moreButton}>
        <DropdownMenu
          className={styles.moreButton}
          MenuItemComponent={ProfileItem}
          menuItemsData={postDropdownItems}
          menuButtonIcon={moreIcon}
          menuTitle="Post Settings"
          isPostItem={true}
        />
      </div>
      <EuiFlexItem className={styles.post}>
        <Post
          profilePicture={props.profilePicture}
          name={props.name}
          timePosted={props.timePosted}
          textContent={props.textContent}
          image={props.image}
          likes={props.likes}
          shares={props.shares}
          postID={props.postID}
          comments={state.commentNr}
          isLikedBySignedInUser={props.isLikedBySignedInUser}
          commentClickHandler={commentClickHandler}
          commBackGround={commBackGround}
        />
      </EuiFlexItem>
      <EuiFlexItem className={styles.add_comment_container}>
        <AddComment
          value={state.value}
          onChangeCommentHandler={onChangeCommentHandler}
          isCommentLoading={state.isCommentLoading}
          className={styles.add_comment}
          profilePicture={props.reduxuserPFP}
          addCommentHandler={addCommentHandler}
        />
      </EuiFlexItem>
      <EuiFlexItem>{comments}</EuiFlexItem>
      {showSeeMoreButton()}
    </EuiFlexGroup>
  );
};

export default PostContainer;
