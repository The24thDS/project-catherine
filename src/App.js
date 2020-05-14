import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import LogRocket from "logrocket";

import "./App.sass";

import { setLoggedIn, setUserInfo } from "./redux/user/user.actions";
import { selectLoggedIn } from "./redux/user/user.selectors";
import LandingPage from "./pages/landing";
import Activation from "./pages/activation";
import PrivateRoute from "./components/PrivateRoute";
import FeedPage from "./pages/feed/FeedPage";
import NavBar from "./components/NavBar";
import ChatList from "./components/ChatList";
import { getUserDetails, checkToken } from "./utils/user";

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
          getUserDetails().then((data) => {
            if (data !== false) {
              const userDetails = data.user;
              LogRocket.identify(userDetails.id, {
                email: userDetails.email,
                name: `
                  ${userDetails.firstName} ${userDetails.lastName}`,
              });
              this.props.setUserInfo(userDetails);
              this.props.setLoggedIn(true);
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
        {this.props.loggedIn ? <ChatList /> : null}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
