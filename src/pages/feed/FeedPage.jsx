import React, { Component } from "react";

import AddPost from "../../components/AddPost/AddPost";
import PostContainer from "../../components/PostContainer";
import ServerRequest from "../../utils/ServerRequest";

class FeedPage extends Component {
  constructor(props) {
    super(props);
    document.title = "Project Catherine | Feed";
    this.state = {
      posts: [],
      postsPage: 0,
      isPostsLastPage: false,
    };
  }

  fetchPosts = async () => {
    const req = new ServerRequest(
      "/posts?page=" + this.state.postsPage
    ).useAuthorization();
    const response = await req.send();
    const data = await response.json();
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
          paddingBottom: "50px",
        }}
      >
        <AddPost />
        {this.state.posts.length
          ? this.state.posts.map((el) => (
              <PostContainer
                key={"post" + el.post.postId}
                postInfo={{ ...el.post, isLiked: el.liked }}
                author={el.user}
              />
            ))
          : "Loading posts..."}
      </div>
    );
  }
}

export default FeedPage;
