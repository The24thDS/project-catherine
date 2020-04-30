import React, { Component } from "react";
import NavBar from "../../components/NavBar/NavBar";

export default class FeedPage extends Component {
  constructor(props) {
    super(props);
    document.title = "Project Catherine | Feed";
  }
  render() {
    return (
      <>
        <NavBar />
      </>
    );
  }
}
