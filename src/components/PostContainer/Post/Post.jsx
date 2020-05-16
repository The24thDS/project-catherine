import React, { Component } from "react";
import styles from "./Post.module.sass";
import { EuiFlexGroup } from "@elastic/eui";
import { EuiFlexItem } from "@elastic/eui";
import PostContent from "../PostContent";
import ServerRequest from "../../../utils/ServerRequest";
class Post extends Component {
  state = {
    postID: this.props.postID,
    likes: this.props.likes,
    shares : this.props.shares,
    isLikedBySignedInUser: this.props.isLikedBySignedInUser

}
 

ShareClickHandler(){
  
}
likeClickHandler= async() =>{
  const req = new ServerRequest("/posts/"+this.state.postID+"/like", "POST");
    req.useAuthorization().useJsonBody();
  const response = await req.send();

  if (response.status === 200 && this.state.isLikedBySignedInUser === false) {
    this.setState(
      (prevState) => (
        {
          likes: prevState.likes+1,
          isLikedBySignedInUser: true,
        }
      ), console.log("liked")
    );

  }
}

  render(){

    let likeBackground = "white";
    if(this.state.isLikedBySignedInUser){
      likeBackground="#dde6e4"
      console.log("likes:"+this.state.likes)
    }
    console.log("render");
   
  return (
    <EuiFlexGroup className={styles.post_container}>
      <EuiFlexItem className={styles.profile_details}>
        <PostContent
          className={styles.post_content}
          profilePicture={this.props.profilePicture}
          name={this.props.name}
          timePosted={this.props.timePosted}
          textContent={this.props.textContent}
          image={this.props.image}
        />
      </EuiFlexItem>
      <div className={styles.button_top_numbers_container}>
        <div  className={styles.button_top_numbers}>{this.state.likes}</div>
        <div className={styles.button_top_numbers}>{this.props.comments}</div>
        <div className={styles.button_top_numbers}>{this.state.shares}</div>
      </div>
      <div className={styles.buttton_container}>
        <button  style={{backgroundColor: likeBackground}} className={styles.buttons} onClick={this.likeClickHandler}>Like</button>
        <button style={{backgroundColor: this.props.commBackGround}} className={styles.buttons} onClick={this.props.commentClickHandler}>Comm</button>
        <button className={styles.buttons} onClick={this.ShareClickHandler}>Share</button>
      </div>
    </EuiFlexGroup>
  );
  }
 
}
export default Post;
