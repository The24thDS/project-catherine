import React, { Component } from "react";

import AddPost from "../../components/AddPost/AddPost";

export default class FeedPage extends Component {
  constructor(props) {
    super(props);
    document.title = "Project Catherine | Feed";
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
        }}
      >
        <AddPost />
      </div>
    );
  }
}
