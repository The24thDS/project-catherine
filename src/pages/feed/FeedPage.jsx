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
    };
  }

  fetchPosts = async () => {
    const req = new ServerRequest("/posts?page=0").useAuthorization();
    const response = await req.send();
    const data = await response.json();
    return data;
  };

  componentDidMount() {
    this.fetchPosts().then((data) => {
      this.setState({
        posts: data.posts,
      });
    });
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
