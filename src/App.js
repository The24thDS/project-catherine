import React from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { setCurrentUser } from "./redux/user/user.actions";
import { selectCurrentUser } from "./redux/user/user.selectors";

import logo from "./logo.svg";
import "./App.sass";

class App extends React.Component {
  componentDidMount() {
    // just an example
    const { setCurrentUser } = this.props;
    // this user will be available in this.props.currentUser
    setCurrentUser({ name: "Catherine", id: 5 });
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>Project Catherine</p>
            </header>
          </Route>
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
  currentUser: selectCurrentUser
});

// this function will map boundActionCreators to props
const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
