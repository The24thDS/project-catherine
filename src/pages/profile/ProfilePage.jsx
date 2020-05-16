import React, { Component } from "react";
import PostContainer from "../../components/PostContainer";
import ServerRequest from "../../utils/ServerRequest";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  selectUserFullName,
  selectUserID,
  selectUserProfilePicture,
} from "../../redux/user/user.selectors.js";
import AddPost from "../../components/AddPost/AddPost";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    document.title = "Project Catherine | Feed";
    this.state = {
      arePostsloaded: false,
      p: [],
      last: false,
      pageNumber: 0,
    };
  }
  deletePost = async (postID) => {
    if (this.props.userID === this.props.reduxUserID) {
      const req = new ServerRequest("/posts/" + postID, "DELETE");
      req.useAuthorization().useJsonBody();
      const response = await req.send();
      if (response.status === 200) {
        this.setState((prevState) => ({
          p: prevState.p.filter((post) => post.postId !== postID),
        }));
      }
    }
  };
  checkPosts(data) {
    if (this.state.pageNumber === 0) return data.posts;
    else return [...this.state.p, ...data.posts];
  }
  async fetchdata() {
    const request = new ServerRequest(
      "/posts/user/" + this.props.userID + "?page=" + this.state.pageNumber
    );
    request.useAuthorization().useJsonBody();
    const response = await request.send();
    if (response.status === 200) {
      response.json().then((data) => {
        console.log(data);
        this.setState({
          p: this.checkPosts(data),
          arePostsloaded: true,
          last: data.last,
        });
      });
      console.log(this.state);
    } else {
    }
  }
  componentDidMount() {
    console.log("component did mount");
    window.addEventListener("scroll", this.scrollListener);
    this.fetchdata();
  }

  scrollListener = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      console.log("you're at the bottom of the page");
      if (!this.state.last) {
        this.setState(
          (prevState) => (
            {
              pageNumber: prevState.pageNumber++,
            },
            this.fetchdata()
          )
        );
      }
    }
  };
  render() {
    let posts = (
      <div>
        {this.state.p.map((post, index) => {
          return (
            <PostContainer
              deletePost={this.deletePost}
              key={index}
              profilePicture={this.props.profilePicture}
              name={this.props.userName}
              timePosted={post.date}
              textContent={post.content}
              image={post.imageNames}
              likes={post.likes}
              comments={post.comments}
              shares={post.shares}
              postID={post.postId}
              isLikedBySignedInUser={false}
              reduxuserName={this.props.reduxuserName}
              reduxuserPFP={this.props.reduxuserPFP}
            />
          );
        })}
      </div>
    );
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "120px",
        }}
      >
        {posts}
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  reduxuserName: selectUserFullName,
  reduxuserPFP: selectUserProfilePicture,
  reduxUserID: selectUserID,
});
export default connect(mapStateToProps, null)(ProfilePage);
