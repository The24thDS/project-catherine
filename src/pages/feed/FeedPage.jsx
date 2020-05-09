import React, { Component } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Posts from "../../components/Posts";

export default class FeedPage extends Component {
  constructor(props) {
    super(props);
    document.title = "Project Catherine | Feed";
  }
  render() {
    return (
      <>
        <NavBar />
        <Posts />
      </>
    );
  }
}
