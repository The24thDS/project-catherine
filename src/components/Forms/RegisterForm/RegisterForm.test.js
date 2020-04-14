import React from "react";

import RegisterForm from "./RegisterForm";
import { mount } from "enzyme";

describe("Register form", () => {
  const wrapper = mount(<RegisterForm />);
  test("Inputing text updates the state", () => {
    let input = wrapper.find(`input[name="firstName"]`);
    expect(input.length).toEqual(1);
    expect(input.prop("value")).toBe("");
    input.simulate("change", {
      target: { name: input.prop("name"), value: "Foo" },
    });
    input = wrapper.find(`input[name="firstName"]`);
    expect(input.prop("value")).toBe("Foo");
  });
});
