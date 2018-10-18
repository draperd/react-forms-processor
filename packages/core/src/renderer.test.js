// @flow
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16.3";
import Form from "./components/Form";
import FormButton from "./components/Button";
import type { FieldDef } from "./types";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import FormFragment from "./components/FormFragment";

chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

// describe("Default renderer", () => {
//   test("single text field", () => {
//     const singleField: FieldDef[] = [
//       {
//         id: "FIELD1",
//         name: "prop1",
//         defaultValue: "test",
//         type: "text"
//       }
//     ];
//     // NOTE: It's not possible to test components using the new React Context API yet in Enzyme,
//     //       See https://github.com/airbnb/enzyme/pull/1513
//     const wrapper = mount(<Form defaultFields={singleField} />);
//     const inputFields = wrapper.find("input");
//     expect(inputFields.length).toBe(1);
//   });
// });

// describe("Basic single field form capabilities", () => {
//   const onFormChange = jest.fn();
//   const onButtonClick = jest.fn();
//   const singleField: FieldDef[] = [
//     {
//       id: "FIELD1",
//       name: "prop1",
//       defaultValue: "test",
//       type: "text"
//     }
//   ];

//   const wrapper = mount(
//     <Form defaultFields={singleField} onChange={onFormChange}>
//       <FormButton onClick={onButtonClick} />
//     </Form>
//   );

//   test("has single input field", () => {
//     expect(wrapper.find("input[type='text']").length).toBe(1);
//   });

//   test("input field has a value", () => {
//     const inputField = wrapper.find("input[type='text']").at(0);
//     expect(inputField.prop("value")).toBe("test");
//   });

//   test("has a button", () => {
//     expect(wrapper.find(FormButton).length).toBe(1);
//   });

//   const button = wrapper.find(FormButton);
//   test("button initially has no value", () => {
//     button.prop("onClick")();
//     expect(onButtonClick).toHaveBeenCalledTimes(1);
//     expect(onButtonClick).toHaveBeenLastCalledWith();
//   });

//   const inputField = wrapper.find("input[type='text']");
//   test("changing field value calls onChange", () => {
//     inputField.simulate("change", { target: { value: "updated" } });
//     expect(onFormChange).toHaveBeenLastCalledWith({ prop1: "updated" }, true);
//   });

//   test("button initially has no value", () => {
//     button.prop("onClick")();
//     expect(onButtonClick).toHaveBeenCalledTimes(2);
//   });
// });

describe("Disabled form", () => {
  const onFormChange = jest.fn();
  const onButtonClick = jest.fn();
  const singleField: FieldDef[] = [
    {
      id: "FIELD1",
      name: "prop1",
      defaultValue: "one",
      type: "text"
    },
    {
      id: "FIELD2",
      name: "prop2",
      defaultValue: "two",
      type: "text"
    }
  ];

  const form = mount(
    <Form defaultFields={singleField} onChange={onFormChange} disabled>
      <FormButton onClick={onButtonClick} />
    </Form>
  );

  test("fields should be disabled", () => {
    const fields = form.find("input[type='text']");
    chai.expect(fields.at(0)).to.be.disabled();
    chai.expect(fields.at(1)).to.be.disabled();
  });

  test("fields are enabled when form is enabled", () => {
    expect(form.prop("disabled")).toBe(true);
    form.setProps({ disabled: false });
    expect(form.prop("disabled")).toBe(false);

    const fields = form.find("input[type='text']");
    chai.expect(fields.at(0)).to.not.be.disabled();
    chai.expect(fields.at(1)).to.not.be.disabled();
  });

  test("fields are disabled when form is disabled", () => {
    expect(form.prop("disabled")).toBe(false);
    form.setProps({ disabled: true });
    expect(form.prop("disabled")).toBe(true);

    const fields = form.find("input[type='text']");
    chai.expect(fields.at(0)).to.be.disabled();
    chai.expect(fields.at(1)).to.be.disabled();
  });
});

describe("Disabled fragment", () => {
  const onFormChange = jest.fn();
  const onButtonClick = jest.fn();
  const fieldDefs: FieldDef[] = [
    {
      id: "FIELD1",
      name: "prop1",
      defaultValue: "one",
      type: "text"
    },
    {
      id: "FIELD2",
      name: "prop2",
      defaultValue: "two",
      type: "text"
    }
  ];

  const form = mount(
    <Form onChange={onFormChange} disabled>
      <FormFragment defaultFields={fieldDefs} />
      <FormButton onClick={onButtonClick} />
    </Form>
  );

  test("fields should be disabled", () => {
    const fields = form.find("input[type='text']");
    chai.expect(fields.at(0)).to.be.disabled();
    chai.expect(fields.at(1)).to.be.disabled();
  });

  test("fields are enabled when form is enabled", () => {
    expect(form.prop("disabled")).toBe(true);
    form.setProps({ disabled: false });
    expect(form.prop("disabled")).toBe(false);

    const fields = form.find("input[type='text']");
    chai.expect(fields.at(0)).to.not.be.disabled();
    chai.expect(fields.at(1)).to.not.be.disabled();
  });

  test("fields are disabled when form is disabled", () => {
    expect(form.prop("disabled")).toBe(false);
    form.setProps({ disabled: true });
    expect(form.prop("disabled")).toBe(true);

    const fields = form.find("input[type='text']");
    chai.expect(fields.at(0)).to.be.disabled();
    chai.expect(fields.at(1)).to.be.disabled();
  });
});
