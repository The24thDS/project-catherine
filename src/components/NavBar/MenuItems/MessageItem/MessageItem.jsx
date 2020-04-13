import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { EuiIcon } from "@elastic/eui";
import "./MessageItem.sass";
import read from "../../../../assets/read.svg";
import notread from "../../../../assets/notread.svg";
class MessageItem extends Component {

  render() {
    return (
      <div className="item">
          <EuiIcon size="xl" className="item1"  type={this.props.profilePicture} />
        <div className="item2">
          <div className="item11">
            <div className="name">
              {this.props.firstName} {this.props.lastName}
            </div>
            <div className="time">{this.props.time}</div>
          </div>
          <div className="item22">
            <p>
              {this.props.whoLastMessaged ? (
                <Fragment>You</Fragment>
              ) : (
                <Fragment>{this.props.firstName}</Fragment>
              )}
              :{this.props.lastMessage}
            </p>
            <Fragment>
              {this.props.read ? (
                <EuiIcon className="read" type={read} />
              ) : (
                <EuiIcon className="read" type={notread} />
              )}
            </Fragment>
          </div>
        </div>
      </div>
    );
  }
}
MessageItem.propTypes = {
  profilePicture: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  read: PropTypes.bool,
  lastMessage: PropTypes.string,
  whoLastMessaged: PropTypes.bool,
  time: PropTypes.string
};
export default MessageItem;
