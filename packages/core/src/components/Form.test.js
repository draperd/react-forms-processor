// @flow
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16.3";
import Form from "./Form";
import FormFragment from "./FormFragment";
import FormContext from "./FormContext";
import type { FieldDef } from "../types";

Enzyme.configure({ adapter: new Adapter() });

describe("Context", () => {
  const onFormChange = jest.fn();
  const singleField: FieldDef[] = [
    {
      id: "FIELD1",
      name: "prop1",
      defaultValue: "test",
      type: "text"
    }
  ];

  test("provides value", () => {
    const propValue = { prop1: "value1" };
    let value;
    const form = mount(
      <Form
        defaultFields={singleField}
        onChange={onFormChange}
        value={propValue}
      >
        <FormContext.Consumer>
          {context => {
            expect(context.value).toEqual(propValue);
          }}
        </FormContext.Consumer>
      </Form>
    );
    expect(form.state().value).toEqual(propValue);
  });

  test("FormFragment has the correct value", () => {
    const propValue = { prop1: "value1" };
    let value;
    const form = mount(
      <Form onChange={onFormChange} value={propValue}>
        <FormFragment defaultFields={singleField} />
      </Form>
    );
    expect(form.state().value).toEqual(propValue);
  });

  test("FormFragment has the correct value after props update", () => {
    const propValue = { prop1: "value1" };
    let value;
    const form = mount(
      <Form onChange={onFormChange} value={propValue}>
        <FormFragment defaultFields={singleField} />
      </Form>
    );
    expect(form.state().value.prop1).toEqual("value1");

    form.setProps({ value: { prop1: "value2" } });
    expect(form.state().value.prop1).toEqual("value2");
  });
});
