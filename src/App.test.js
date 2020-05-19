import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { mount } from "enzyme";
import configureStore from "redux-mock-store";

import App from "./App";
import LandingPage from "./pages/landing/LandingPage";

const mockStore = configureStore([]);

describe("App", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        loggedIn: false,
        info: null,
      },
    });
  });

  it("renders the Landing page", () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    );
    expect(wrapper.find(LandingPage).length).toEqual(1);
  });
});
