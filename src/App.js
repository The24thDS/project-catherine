import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import LogRocket from "logrocket";

import "./App.sass";

import { setLoggedIn, setUserInfo } from "./redux/user/user.actions";
import { selectLoggedIn } from "./redux/user/user.selectors";
import { setFriendsInfo } from "./redux/friends/friends.actions";
import LandingPage from "./pages/landing";
import Activation from "./pages/activation";
import PrivateRoute from "./components/PrivateRoute";
import FeedPage from "./pages/feed/FeedPage";
import NavBar from "./components/NavBar";
import Chats from "./components/Chats";
import { getUserDetails, checkToken, getUserFriends } from "./utils/user";

import ProfilePage from "./pages/profile";
class App extends React.Component {
  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    setLoggedIn: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const token =
      window.localStorage.getItem("token") ||
      window.sessionStorage.getItem("token");
    if (token !== null) {
      checkToken(token).then((valid) => {
        if (valid) {
          getUserDetails().then(async (userDetails) => {
            if (userDetails !== false) {
              LogRocket.identify(userDetails.id, {
                email: userDetails.email,
                name: `
                  ${userDetails.firstName} ${userDetails.lastName}`,
              });
              const userFriends = (await getUserFriends()).reduce(
                (acc, value) => ({ [value.id]: { ...value }, ...acc }),
                {}
              );
              this.props.setUserInfo(userDetails);
              this.props.setLoggedIn(true);
              this.props.setFriendsInfo(userFriends);
            } else {
              window.localStorage.removeItem("token");
              window.sessionStorage.removeItem("token");
            }
          });
        } else {
          window.localStorage.removeItem("token");
          window.sessionStorage.removeItem("token");
        }
      });
    }
  }

  render() {
    return (
      <div className="App">
        {this.props.loggedIn ? <NavBar /> : null}
        <Switch>
          <Route
            exact
            path="/"
            component={(props) =>
              this.props.loggedIn ? (
                <Redirect to="/feed" />
              ) : (
                <LandingPage {...props} />
              )
            }
          />
          <Route
            exact
            path="/activation/:token"
            component={(props) =>
              this.props.loggedIn ? (
                <Redirect to="/feed" />
              ) : (
                <Activation {...props} />
              )
            }
          />
          <PrivateRoute
            exact
            path="/feed"
            isAuthenticated={this.props.loggedIn}
          >
            <FeedPage />
          </PrivateRoute>
          <PrivateRoute
            exact
            path="/profilePage"
            isAuthenticated={this.props.loggedIn}
          >
            <ProfilePage profilePicture="https://localhost:8443/api/v1/photos/user-default.jpg" userName="David Sima" userID="2" />
          </PrivateRoute>
          {/* this route will render if all of the above routes don't */}
          <Route>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "50vh",
              }}
            >
              404 - Not Found
            </div>
          </Route>
        </Switch>
        {this.props.loggedIn ? <Chats /> : null}
      </div>
    );
  }
}

// this function will select from the store and map the results to props
// propName: selectorName
const mapStateToProps = createStructuredSelector({
  loggedIn: selectLoggedIn,
});

// this function will map boundActionCreators to props
const mapDispatchToProps = (dispatch) => ({
  setLoggedIn: (loggedIn) => dispatch(setLoggedIn(loggedIn)),
  setUserInfo: (userDetails) => dispatch(setUserInfo(userDetails)),
  setFriendsInfo: (friendsArray) => dispatch(setFriendsInfo(friendsArray)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
