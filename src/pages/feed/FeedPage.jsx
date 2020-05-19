import React, { Component } from "react";

import AddPost from "../../components/AddPost/AddPost";
import PostContainer from "../../components/PostContainer";
import ServerRequest from "../../utils/ServerRequest";
import Spinner from "../../components/Spinner/Spinner";

class FeedPage extends Component {
  constructor(props) {
    super(props);
    document.title = "Project Catherine | Feed";
    this.state = {
      arePostsLoaded: false,
      loadingPosts: false,
      posts: [],
      postsPage: 0,
      isPostsLastPage: false,
    };
  }

  fetchPosts = async () => {
    this.setState({ loadingPosts: true });
    const req = new ServerRequest(
      "/posts?page=" + this.state.postsPage
    ).useAuthorization();
    const response = await req.send();
    const data = await response.json();
    this.setState({ loadingPosts: false });
    return data;
  };

  scrollListener = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (!this.state.isPostsLastPage) {
        this.setState(
          (prevState) => ({
            postsPage: prevState.postsPage + 1,
          }),
          () => {
            this.fetchPosts().then((data) => {
              if (data.posts === null) {
                data.posts = [];
              }
              this.setState((prevState) => ({
                posts: [...prevState.posts, ...data.posts],
                isPostsLastPage: data.last,
              }));
            });
          }
        );
      }
    }
  };

  componentDidMount() {
    this.fetchPosts().then((data) => {
      this.setState({
        posts: data.posts,
        isPostsLastPage: data.last,
        arePostsLoaded: true,
      });
    });
    window.addEventListener("scroll", this.scrollListener);
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
        <AddPost />
        {this.state.posts.length ? (
          this.state.posts.map((el) => (
            <PostContainer
              key={"post" + el.post.postId}
              postInfo={{ ...el.post, isLiked: el.liked }}
              author={el.user}
            />
          ))
        ) : this.state.arePostsLoaded ? (
          <>
            <p style={{ color: "gray", marginTop: "30px", fontSize: "22px" }}>
              It's cold and empty here.
            </p>
            <p style={{ color: "gray", fontSize: "22px" }}>
              We can't find any posts to display here.
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
        {this.state.isPostsLastPage ? (
          <p style={{ color: "gray", fontSize: "22px", marginTop: "75px" }}>
            That was all. Go do something productive now.
          </p>
        ) : null}
      </div>
    );
  }
}

export default FeedPage;
