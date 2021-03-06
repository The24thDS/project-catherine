import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { EuiAvatar, EuiButton, EuiFilePicker } from "@elastic/eui";

import PostContainer from "../../components/PostContainer";
import ServerRequest from "../../utils/ServerRequest";
import { selectUserInfo } from "../../redux/user/user.selectors.js";
import { setUserInfo } from "../../redux/user/user.actions";
import { removeFriend } from "../../redux/friends/friends.actions";
import AddPost from "../../components/AddPost";
import PictureURL from "../../utils/PictureURL";
import Spinner from "../../components/Spinner";

import styles from "./ProfilePage.module.sass";
import { selectFriendsRaw } from "../../redux/friends/friends.selectors";

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
      loadingPosts: false,
      isMyProfile: userInfo !== undefined ? true : false,
      arePostsLoaded: false,
      postsData: [],
      isLastPostsPage: false,
      postsPage: 0,
      userInfo,
      friendButtonText: "",
    };
  }

  removePostById = (postId) => {
    this.setState((prevState) => ({
      postsData: prevState.postsData.filter((el) => el.post.postId !== postId),
    }));
  };

  insertPost = (postObj) => {
    this.setState((prevState) => ({
      postsData: [postObj, ...prevState.postsData],
    }));
  };

  updatePFP = async (files) => {
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
        const photo = data.photos[0];
        req = new ServerRequest("/user/update", "POST", undefined, {
          profilePicture: photo,
        })
          .useAuthorization()
          .useJsonBody();
        response = await req.send();
        if (response.status === 200) {
          this.setState((prevState) => ({
            userInfo: { ...prevState.userInfo, profilePicture: photo },
          }));
          this.props.setUserInfo({
            ...this.state.userInfo,
            profilePicture: photo,
          });
        }
      }
    }
  };

  sendFriendRequest = async () => {
    this.setState({
      friendButtonText: "Sending...",
    });
    const req = new ServerRequest(
      "/user/sendFriendRequest/" + this.state.userInfo.id,
      "POST"
    ).useAuthorization();
    const response = await req.send();
    if (response.status === 200) {
      this.setState(
        {
          friendButtonText: "Sent",
        },
        () => {
          window.setTimeout(() => {
            this.setState({
              friendButtonText: "",
            });
          }, 1000);
        }
      );
    } else {
      this.setState({
        friendButtonText: "Failed",
      });
    }
  };

  removeFriend = async () => {
    this.setState({
      friendButtonText: "Removing...",
    });
    const req = new ServerRequest(
      "/user/friends/" + this.state.userInfo.id,
      "DELETE"
    ).useAuthorization();
    const response = await req.send();
    if (response.status === 200) {
      this.setState(
        (prevState) => ({
          friendButtonText: "Friend removed :(",
          userInfo: {
            ...prevState.userInfo,
            email: undefined,
            birthDate: undefined,
          },
          postsData: [],
        }),
        () => {
          window.setTimeout(() => {
            this.setState({
              friendButtonText: "",
            });
          }, 1000);
        }
      );
      this.props.removeFriend(this.state.userInfo.id);
    } else {
      this.setState({
        friendButtonText: "Failed",
      });
    }
  };

  fetchPosts = async () => {
    if (this.state.userInfo.email !== undefined) {
      this.setState({
        loadingPosts: true,
      });
      const request = new ServerRequest(
        "/posts/user/" +
          this.state.userInfo.id +
          "?page=" +
          this.state.postsPage
      ).useAuthorization();
      const response = await request.send();
      const data = await response.json();
      if (data.posts === null) {
        data.posts = [];
      }
      this.setState((prevState) => ({
        postsData: [...prevState.postsData, ...data.posts],
        arePostsLoaded: true,
        isLastPostsPage: data.last,
        loadingPosts: false,
      }));
    }
  };

  scrollListener = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      this.state.userInfo !== undefined
    ) {
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
    if (this.state.isMyProfile) {
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
            this.setState(
              {
                userInfo: data.user,
              },
              this.fetchPosts
            );
            document.title =
              "Project Catherine | " +
              data.user.firstName +
              " " +
              data.user.lastName;
          }
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.userInfo === undefined ||
      prevProps.friends.length !== this.props.friends.length
    ) {
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
            this.setState(
              {
                userInfo: data.user,
              },
              this.fetchPosts
            );
            document.title =
              "Project Catherine | " +
              data.user.firstName +
              " " +
              data.user.lastName;
          }
        });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  }

  render() {
    const {
      userInfo,
      isMyProfile,
      postsData,
      loadingPosts,
      arePostsLoaded,
      isLastPostsPage,
      friendButtonText,
    } = this.state;

    if (userInfo !== undefined) {
      const friendButton =
        userInfo.email !== undefined ? (
          <EuiButton color="danger" onClick={this.removeFriend}>
            {friendButtonText.length ? friendButtonText : "Remove friend"}
          </EuiButton>
        ) : (
          <EuiButton color="secondary" fill onClick={this.sendFriendRequest}>
            {friendButtonText.length ? friendButtonText : "Send friend request"}
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
            paddingBottom: "100px",
          }}
        >
          <div className={styles["user-hero"]}>
            <div className={styles["user-info"]}>
              <label htmlFor="avatarUpload">
                <EuiAvatar
                  name={name}
                  imageUrl={new PictureURL(userInfo.profilePicture).url}
                  className={
                    styles.pfp + " " + (isMyProfile ? styles["my-pfp"] : null)
                  }
                  data-private
                />
              </label>
              {isMyProfile ? (
                <EuiFilePicker
                  id="avatarUpload"
                  className={styles["file-picker"]}
                  accept=".png, .jpg, .jpeg"
                  onChange={this.updatePFP}
                />
              ) : null}
              <h1 data-private>{name}</h1>
              {userInfo.email ? (
                <>
                  <p>
                    <b>email</b>
                  </p>
                  <p data-private style={{ marginBottom: "10px" }}>
                    {userInfo.email}
                  </p>
                </>
              ) : null}
              {userInfo.birthDate ? (
                <>
                  <p>
                    <b>birthdate</b>
                  </p>
                  <p data-private style={{ marginBottom: "10px" }}>
                    {userInfo.birthDate}
                  </p>
                </>
              ) : null}
              {isMyProfile ? null : userInfo.email !== undefined ? (
                <EuiButton color="danger" onClick={this.removeFriend}>
                  {friendButtonText.length ? friendButtonText : "Remove friend"}
                </EuiButton>
              ) : (
                <EuiButton
                  color="secondary"
                  fill
                  onClick={this.sendFriendRequest}
                >
                  {friendButtonText.length
                    ? friendButtonText
                    : "Send friend request"}
                </EuiButton>
              )}
            </div>
          </div>
          {isMyProfile ? <AddPost insertPost={this.insertPost} /> : null}
          {postsData.length ? (
            postsData.map((postInfo) => (
              <PostContainer
                key={"pfposts" + postInfo.post.postId}
                author={userInfo}
                postInfo={{ ...postInfo.post, isLiked: postInfo.liked }}
                removePostById={this.removePostById}
              />
            ))
          ) : arePostsLoaded && userInfo.email !== undefined ? (
            <>
              <p style={{ color: "gray", marginTop: "30px", fontSize: "22px" }}>
                It's cold and empty here.
              </p>
              <p style={{ color: "gray", fontSize: "22px" }}>
                This user has no posts.
              </p>
            </>
          ) : null}
          {loadingPosts ? (
            <Spinner
              style={{ marginTop: "30px" }}
              text="Loading posts"
              infinite={true}
              imageSize="80px"
            />
          ) : null}
          {isLastPostsPage && postsData.length ? (
            <p style={{ color: "gray", fontSize: "22px", marginTop: "75px" }}>
              That was all. Go do something productive now.
            </p>
          ) : null}
          {userInfo.email === undefined && (
            <p style={{ color: "gray", marginTop: "30px", fontSize: "22px" }}>
              You must be friends with this user to see any posts.
            </p>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: selectUserInfo,
  friends: selectFriendsRaw,
});
const mapDispatchToProps = (dispatch) => ({
  setUserInfo: (userInfo) => dispatch(setUserInfo(userInfo)),
  removeFriend: (id) => dispatch(removeFriend(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
