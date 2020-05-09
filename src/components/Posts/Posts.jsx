import React from "react";
import PostContainer from "./PostContainer";
import styles from "./Posts.module.sass";
import ServerRequest from "../../utils/ServerRequest";
import { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  selectUserFullName,
  selectUserID,
  selectUserProfilePicture, 
} from "../../redux/user/user.selectors.js";
class Posts extends Component {
  state = {
    p: [],
  };
  async componentDidMount() {
    const request = new ServerRequest("/posts/user/2");
    request.useAuthorization().useJsonBody();
    const response= await request.send();
    response.json().then((data) => {
        this.setState({
          p: data.posts,
        });
      });
  }
  displayPosts() {
    return (
      <div>
        {this.state.p.map((post, index) => {
          return (
            <PostContainer
              key={index}
              profilePicture={this.props.userPFP}
              firstName={this.props.userPFP}
              lastName={this.props.selectUserFullName}
              timePosted={post.date}
              textContent={post.content}
              image={post.imageNames}
              likes={post.likes}
              comments={post.comments}
              shares={post.shares}
            />
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className={styles.posts}>
        {this.displayPosts()}
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
    userName: selectUserFullName,
    userPFP: selectUserProfilePicture,
    userID: selectUserID,
  });
  export default connect(mapStateToProps, null)(Posts);
