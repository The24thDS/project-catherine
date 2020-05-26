import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import rg4js from "raygun4js";

import { store, persistor } from "./redux/store";

import "./index.css";
import App from "./App";

LogRocket.init("iisf1p/project-catherine", {
  network: {
    requestSanitizer: (request) => {
      if (request.url.toLowerCase().indexOf("auth") !== -1) {
        request.body = null;
      }
      request.headers["Authorization"] =
        "Probably a token that you shouldn't see";
      return request;
    },
    responseSanitizer: (response) => {
      if (response.url.toLowerCase().indexOf("auth") !== -1) {
        response.body = null;
      }
      return response;
    },
  },
  release: "v0.9.2-beta : 'Express Yourself' update",
});
setupLogRocketReact(LogRocket);
const getLogRocketSessionURL = () => {
  return {
    "LogRocket Session URL": LogRocket.sessionURL,
  };
};
rg4js("withCustomData", getLogRocketSessionURL);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
