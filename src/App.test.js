import React from "react";
import renderer from "react-test-renderer";
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
        currentUser: {
          name: "Catherine",
          id: 5
        }
      }
    });
  });

  test("snapshot renders", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
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
