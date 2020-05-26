import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";

import AddPost from "../../components/AddPost/AddPost";
import PostContainer from "../../components/PostContainer";
import ServerRequest from "../../utils/ServerRequest";
import Spinner from "../../components/Spinner/Spinner";
import { selectFriendsRaw } from "../../redux/friends/friends.selectors";
import { selectUserInfo } from "../../redux/user/user.selectors";

class FeedPage extends Component {
  constructor(props) {
    super(props);
    document.title = "Project Catherine | Feed";
    this.state = {
      arePostsLoaded: false,
      loadingPosts: false,
      posts: [],
      friendsPostsPage: 0,
      isFriendsPostsLastPage: false,
      myPostsPage: 0,
      isMyPostsLastPage: false,
    };
  }

  fetchPosts = async () => {
    this.setState({ loadingPosts: true });
    let req = new ServerRequest(
      "/posts?page=" + this.state.friendsPostsPage
    ).useAuthorization();
    let response = await req.send();
    const friendsPosts = await response.json();
    req = new ServerRequest(
      "/posts/user/" +
        this.props.currentUser.id +
        "?page=" +
        this.state.myPostsPage
    ).useAuthorization();
    response = await req.send();
    const myPosts = await response.json();
    this.setState({ loadingPosts: false });
    return { friendsPosts, myPosts };
  };

  formatPosts = (data) => {
    if (data.friendsPosts.posts === null) {
      data.friendsPosts.posts = [];
    }
    if (data.myPosts.posts === null) {
      data.myPosts.posts = [];
    }
    data.myPosts.posts = data.myPosts.posts.map((postData) => ({
      user: { ...this.props.currentUser },
      ...postData,
    }));
    const posts = data.friendsPosts.posts.concat(data.myPosts.posts);
    const sortedPosts = posts.sort((a, b) =>
      moment(b.post.date).diff(moment(a.post.date))
    );
    return sortedPosts;
  };

  removePostById = (postId) => {
    this.setState((prevState) => ({
      posts: prevState.posts.filter((el) => el.post.postId !== postId),
    }));
  };

  insertPost = (postObj) => {
    this.setState((prevState) => ({
      posts: [postObj, ...prevState.posts],
    }));
  };

  scrollListener = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (!this.state.isFriendsPostsLastPage || !this.state.isMyPostsLastPage) {
        this.setState(
          (prevState) => ({
            friendsPostsPage: prevState.friendsPostsPage + 1,
            myPostsPage: prevState.myPostsPage + 1,
          }),
          () => {
            this.fetchPosts().then((data) => {
              const posts = this.formatPosts(data);
              this.setState((prevState) => ({
                posts: [...prevState.posts, posts],
                isFriendsPostsLastPage: data.friendsPosts.last,
                isMyPostsLastPage: data.myPosts.last,
              }));
            });
          }
        );
      }
    }
  };

  componentDidMount() {
    this.fetchPosts().then((data) => {
      const posts = this.formatPosts(data);

      this.setState({
        posts: posts,
        isFriendsPostsLastPage: data.friendsPosts.last,
        isMyPostsLastPage: data.myPosts.last,
        arePostsLoaded: true,
      });
    });
    window.addEventListener("scroll", this.scrollListener);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.friends.length !== this.props.friends.length) {
      this.fetchPosts().then((data) => {
        const posts = this.formatPosts(data);

        this.setState({
          posts: posts,
          isFriendsPostsLastPage: data.friendsPosts.last,
          isMyPostsLastPage: data.myPosts.last,
          arePostsLoaded: true,
        });
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  }

  render() {
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
        <AddPost insertPost={this.insertPost} />
        {this.state.posts.length ? (
          this.state.posts.map((el) => (
            <PostContainer
              key={"post" + el.post.postId}
              postInfo={{ ...el.post, isLiked: el.liked }}
              author={el.user}
              removePostById={this.removePostById}
            />
          ))
        ) : this.state.arePostsLoaded ? (
          <>
            <p style={{ color: "gray", marginTop: "30px", fontSize: "22px" }}>
              It's cold and empty here.
            </p>
            <p style={{ color: "gray", fontSize: "22px" }}>
              We can't find any posts to display.
            </p>
            <p style={{ color: "gray", fontSize: "22px" }}>
              You need some friends in your life.
            </p>
          </>
        ) : null}
        {this.state.loadingPosts ? (
          <Spinner
            style={{ marginTop: "30px" }}
            text="Loading posts"
            infinite={true}
            imageSize="80px"
          />
        ) : null}
        {this.state.isFriendsPostsLastPage &&
        this.state.isMyPostsLastPage &&
        this.state.posts.length > 0 ? (
          <p style={{ color: "gray", fontSize: "22px", marginTop: "75px" }}>
            That was all. Go do something productive now.
          </p>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  friends: selectFriendsRaw,
  currentUser: selectUserInfo,
});

export default connect(mapStateToProps)(FeedPage);
