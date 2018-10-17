// @flow
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// import { expect } from "chai";
import Form from "./components/Form";
import FormButton from "./components/Button";
import type { FieldDef } from "./types";
// import FormButton from "../../atlaskit/src/components/buttons/FormButton";

Enzyme.configure({ adapter: new Adapter() });

describe("Default renderer", () => {
  test("single text field", () => {
    const singleField: FieldDef[] = [
      {
        id: "FIELD1",
        name: "prop1",
        defaultValue: "test",
        type: "text"
      }
    ];
    // NOTE: It's not possible to test components using the new React Context API yet in Enzyme,
    //       See https://github.com/airbnb/enzyme/pull/1513
    const wrapper = mount(<Form defaultFields={singleField} />);
    const inputFields = wrapper.find("input");
    expect(inputFields.length).toBe(1);
  });
});

describe("Basic single field form capabilities", () => {
  const onFormChange = jest.fn();
  const onButtonClick = jest.fn();
  const singleField: FieldDef[] = [
    {
      id: "FIELD1",
      name: "prop1",
      defaultValue: "test",
      type: "text"
    }
  ];

  const wrapper = mount(
    <Form defaultFields={singleField} onChange={onFormChange}>
      <FormButton onClick={onButtonClick} />
    </Form>
  );

  test("has single input field", () => {
    expect(wrapper.find("input[type='text']").length).toBe(1);
  });

  test("has a button", () => {
    expect(wrapper.find(FormButton).length).toBe(1);
  });

  const button = wrapper.find(FormButton);
  test("button initially has no value", () => {
    button.prop("onClick")();
    expect(onButtonClick).toHaveBeenCalledTimes(1);
    // expect(onButtonClick).toHaveBeenLastCalledWith({});
  });

  const inputField = wrapper.find("input[type='text']");
  test("changing field value calls onChange", () => {
    inputField.simulate("change", { target: { value: "test" } });
    expect(onFormChange).toHaveBeenLastCalledWith({ prop1: "test" }, true);
  });

  test("button initially has no value", () => {
    button.prop("onClick")();
    expect(onButtonClick).toHaveBeenCalledTimes(2);
    // expect(onButtonClick).toHaveBeenLastCalledWith({ prop1: "test" });
  });
});
