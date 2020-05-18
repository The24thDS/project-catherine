import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { EuiAvatar, EuiButton } from "@elastic/eui";

import PostContainer from "../../components/PostContainer";
import ServerRequest from "../../utils/ServerRequest";
import { selectUserInfo } from "../../redux/user/user.selectors.js";
import AddPost from "../../components/AddPost/AddPost";
import PictureURL from "../../utils/PictureURL";

import styles from "./ProfilePage.module.sass";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    let userInfo = undefined;
    if (props.match.params.userID === "" + props.currentUser.id) {
      userInfo = props.currentUser;
      document.title =
        "Project Catherine | " +
        props.currentUser.firstName +
        " " +
        props.currentUser.lastName;
    }
    this.state = {
      isMyProfile: userInfo !== undefined ? true : false,
      arePostsLoaded: false,
      postsData: [],
      isLastPostsPage: false,
      postsPage: 0,
      userInfo,
    };
  }
  // deletePost = async (postID) => {
  //   if (this.props.userID === this.props.reduxUserID) {
  //     const req = new ServerRequest("/posts/" + postID, "DELETE");
  //     req.useAuthorization().useJsonBody();
  //     const response = await req.send();
  //     if (response.status === 200) {
  //       this.setState((prevState) => ({
  //         p: prevState.p.filter((post) => post.postId !== postID),
  //       }));
  //     }
  //   }
  // };

  fetchPosts = async () => {
    const request = new ServerRequest(
      "/posts/user/" + this.state.userInfo.id + "?page=" + this.state.postsPage
    ).useAuthorization();
    const response = await request.send();
    if (response.status === 200) {
      const data = await response.json();
      this.setState((prevState) => ({
        postsData: [...prevState.postsData, ...data.posts],
        arePostsLoaded: true,
        isLastPostsPage: data.last,
      }));
    } else {
      return false;
    }
  };

  scrollListener = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (!this.state.isLastPostsPage) {
        this.setState(
          (prevState) => ({
            postsPage: prevState.postsPage + 1,
          }),
          this.fetchPosts
        );
      }
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.scrollListener);
    if (this.state.userInfo !== undefined) {
      this.fetchPosts();
    } else {
      const req = new ServerRequest(
        "/user/details?user=" + this.props.match.params.userID
      )
        .useAuthorization()
        .useJsonBody();
      req
        .send()
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return false;
          }
        })
        .then((data) => {
          if (data !== false) {
            this.setState({
              userInfo: data.user,
            });
            document.title =
              "Project Catherine | " +
              data.user.firstName +
              " " +
              data.user.lastName;
            this.fetchPosts();
          }
        });
    }
  }

  componentDidUpdate() {
    if (this.state.userInfo === undefined) {
      const req = new ServerRequest(
        "/user/details?user=" + this.props.match.params.userID
      )
        .useAuthorization()
        .useJsonBody();
      req
        .send()
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return false;
          }
        })
        .then((data) => {
          if (data !== false) {
            this.setState({
              userInfo: data.user,
            });
            document.title =
              "Project Catherine | " +
              data.user.firstName +
              " " +
              data.user.lastName;
            this.fetchPosts();
          }
        });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  }

  render() {
    const { userInfo, isMyProfile, postsData } = this.state;

    if (userInfo !== undefined) {
      const friendButton =
        userInfo.email !== undefined ? (
          <EuiButton color="danger">Remove friend</EuiButton>
        ) : (
          <EuiButton color="secondary" fill>
            Send friend request
          </EuiButton>
        );
      const name = userInfo.firstName + " " + userInfo.lastName;

      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "120px",
            paddingBottom: "50px",
          }}
        >
          <div className={styles["user-hero"]}>
            <div className={styles["user-info"]}>
              <EuiAvatar
                name={name}
                imageUrl={new PictureURL(userInfo.profilePicture).url}
                className={styles.pfp}
              />
              <h1>{name}</h1>
              {userInfo.email ? (
                <>
                  <p>
                    <b>email</b>
                  </p>
                  <p style={{ marginBottom: "10px" }}>{userInfo.email}</p>
                </>
              ) : null}
              {userInfo.birthDate ? (
                <>
                  <p>
                    <b>birthdate</b>
                  </p>
                  <p style={{ marginBottom: "10px" }}>{userInfo.birthDate}</p>
                </>
              ) : null}
              {isMyProfile ? null : friendButton}
            </div>
          </div>
          {isMyProfile ? <AddPost /> : null}
          {postsData.map((postInfo) => (
            <PostContainer
              key={"pfposts" + postInfo.post.postId}
              author={userInfo}
              postInfo={{ ...postInfo.post, isLiked: postInfo.liked }}
            />
          ))}
        </div>
      );
    } else {
      return null;
    }
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: selectUserInfo,
});
export default connect(mapStateToProps, null)(ProfilePage);
