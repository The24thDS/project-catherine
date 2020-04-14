import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { EuiIcon } from "@elastic/eui";
import "./NotificationItem.module.sass";
import read from "../../../../assets/read.svg";
import notread from "../../../../assets/notread.svg";
class NotificationItem extends Component {

  render() {
    return (
      <div className="item">
          <EuiIcon className='item1' size='l' type={this.props.profilePicture} />
        <div className="item2">
          <div className="item11">
            <div className="name">
              {this.props.firstName} {this.props.lastName}
            </div>
            <div className="time">{this.props.time}</div>
          </div>
          <div className="item22">
            <p>
              {this.props.action}
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
NotificationItem.propTypes = {
  profilePicture: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  read: PropTypes.bool,
  time: PropTypes.string,
  action: PropTypes.string
};
export default NotificationItem;
