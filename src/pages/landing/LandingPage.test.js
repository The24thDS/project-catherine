import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import LandingPage from "./LandingPage";
import RegisterForm from "../../components/Forms/RegisterForm";
import LoginForm from "../../components/Forms/LoginForm";

describe("Landing page", () => {
  // test("snapshot renders", () => {
  //   const component = renderer.create(<LandingPage />);
  //   let tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });

  const wrapper = shallow(<LandingPage />);

  it("renders the details section", () => {
    expect(wrapper.find(".landing--information").length).toEqual(1);
    const title = wrapper.find("h1");
    expect(title.length).toEqual(1);
    expect(title.text()).toEqual("Project Catherine");
    expect(wrapper.find(".logo").length).toEqual(1);
    expect(wrapper.find(".landing--information article").length).toEqual(1);
  });

  it("renders the signup form", () => {
    expect(wrapper.find(RegisterForm).length).toEqual(1);
  });

  it("doesnt render the login form", () => {
    expect(wrapper.find(LoginForm).length).toEqual(0);
  });

  it("should change to the login form when you click on the login button", () => {
    const loginButton = wrapper.find(".forms-nav .forms-nav-button:last-child");
    loginButton.simulate("click");
    expect(wrapper.find(LoginForm).length).toEqual(1);
    expect(wrapper.find(RegisterForm).length).toEqual(0);
  });
});
