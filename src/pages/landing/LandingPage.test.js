import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import LandingPage from "./LandingPage";

describe("Landing page", () => {
  test("snapshot renders", () => {
    const component = renderer.create(<LandingPage />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders the details section", () => {
    const wrapper = shallow(<LandingPage />);
    expect(wrapper.find(".landing--information").length).toEqual(1);
    const title = wrapper.find("h1");
    expect(title.length).toEqual(1);
    expect(title.text()).toEqual("Project Catherine");
    expect(wrapper.find(".logo").length).toEqual(1);
    expect(wrapper.find(".landing--information article").length).toEqual(1);
  });
});
