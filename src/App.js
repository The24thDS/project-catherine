import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import LogRocket from "logrocket";

import "./App.sass";

import { setLoggedIn, setUserInfo } from "./redux/user/user.actions";
import { selectLoggedIn } from "./redux/user/user.selectors";
import LandingPage from "./pages/landing/LandingPage";
import Activation from "./pages/activation/Activation";
import ServerRequest from "./utils/ServerRequest";
import PrivateRoute from "./components/PrivateRoute";
import FeedPage from "./pages/feed/FeedPage";

class App extends React.Component {
  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    setLoggedIn: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const token =
      window.localStorage.getItem("token") ||
      window.sessionStorage.getItem("token");
    const checkToken = async (token) => {
      const req = new ServerRequest(
        "/auth/verifyToken",
        "POST",
        {
          "Content-Type": "application/json",
        },
        {
          input: token,
        }
      );
      const response = await req.send();
      const data = await response.json();
      return data.success;
    };

    const fetchUserDetails = async (token) => {
      const req = new ServerRequest(
        "/user/details",
        "GET",
        {
          Authorization: "Bearer " + token,
        },
        null
      );
      const response = await req.send();
      if (response.status === 200) {
        return await response.json();
      } else return false;
    };

    if (token !== null) {
      checkToken(token).then((valid) => {
        if (valid) {
          fetchUserDetails(token).then((userDetails) => {
            if (userDetails !== false) {
              LogRocket.identify("123", {
                email: userDetails.email,
                name:
                  userDetails["first_name"] + " " + userDetails["last_name"],
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
          <PrivateRoute isAuthenticated={this.props.loggedIn}>
            <FeedPage />
          </PrivateRoute>
          {/* this route will render if all of the above routes don't */}
          <Route>404 - Not Found</Route>
        </Switch>
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
