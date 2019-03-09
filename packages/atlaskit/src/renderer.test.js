// @flow
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16.3";
import { Form, FormFragment, type FieldDef } from "react-forms-processor";
import FormButton from "./components/buttons/FormButton";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import renderer from "./renderer";

chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

describe("Atlaskit Renderer", () => {
  test("Checkbox is checked", () => {
    const singleField: FieldDef[] = [
      {
        id: "FIELD1",
        name: "cb1",
        defaultValue: "true",
        type: "checkbox"
      }
    ];

    const wrapper = mount(
      <Form defaultFields={singleField} renderer={renderer} />
    );

    const inputFields = wrapper.find("input");
    expect(inputFields.length).toBe(1);
    chai.expect(inputFields.at(0)).to.be.checked();
  });

  test("Checkbox is NOT checked", () => {
    const singleField: FieldDef[] = [
      {
        id: "FIELD1",
        name: "cb1",
        defaultValue: "false",
        type: "checkbox"
      }
    ];

    const wrapper = mount(
      <Form defaultFields={singleField} renderer={renderer} />
    );

    const inputFields = wrapper.find("input");
    expect(inputFields.length).toBe(1);
    chai.expect(inputFields.at(0)).to.not.be.checked();
  });
});
