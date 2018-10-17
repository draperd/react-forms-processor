// @flow
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Form, FormContext, FormFragment } from "react-forms-processor";
import FieldDefinitionField from "./FieldDefinitionField";
import type { FieldDef } from "react-forms-processor";

Enzyme.configure({ adapter: new Adapter() });

describe("Context", () => {
  const onFormChange = jest.fn();
  const singleField: FieldDef = {
    id: "FIELD1",
    name: "prop1",
    defaultValue: "test",
    type: "text"
  };

  test("provides value", () => {
    // const propValue = { prop1: "value1" };
    let value;
    const form = mount(
      <Form>
        <FieldDefinitionField {...singleField} />
      </Form>
    );

    const idInputElement = form.find("input[id='ID']");
    // expect(idInputElement.value).toBe

    // expect(form.state().value).toEqual(propValue);
    // expect(value).toEqual(propValue);

    console.log(idInputElement.html());
  });
});
