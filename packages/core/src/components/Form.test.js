// @flow
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16.3";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import Form from "./Form";
import FormFragment from "./FormFragment";
import FormContext from "./FormContext";
import FormButton from "./Button";
import type { FieldDef } from "../types";

chai.use(chaiEnzyme());
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

describe("validation warnings", () => {
  const fields: FieldDef[] = [
    {
      id: "FIELD1",
      type: "text",
      name: "field1",
      validWhen: {
        matchesRegEx: {
          pattern: "^[\\d]+$",
          message: "Numbers only"
        }
      }
    }
  ];

  const onButtonClick = jest.fn();
  const formValue = {
    field1: "test"
  };

  describe("shown immediately", () => {
    const form = mount(
      <Form value={formValue} showValidationBeforeTouched>
        <FormFragment defaultFields={fields} />
        <FormButton onClick={onButtonClick} />
      </Form>
    );

    test("form state is invalid", () => {
      expect(form.state().isValid).toBe(false);
    });

    test("field should be invalid", () => {
      expect(form.state().fields[0].isValid).toBe(false);
    });

    test("warning is shown when field is invalid", () => {
      expect(form.find("span.errors").length).toBe(1);
    });

    test("warning is displayed as configured", () => {
      expect(form.find("span.errors").text()).toBe("Numbers only");
    });
  });

  describe("shown when touched", () => {
    const form = mount(
      <Form value={formValue}>
        <FormFragment defaultFields={fields} />
        <FormButton onClick={onButtonClick} />
      </Form>
    );

    test("form state is invalid", () => {
      expect(form.state().isValid).toBe(false);
    });

    test("field has not been touched", () => {
      expect(form.state().fields[0].touched).toBe(false);
    });

    test("field should be valid (as it's not been touched)", () => {
      expect(form.state().fields[0].isValid).toBe(true);
    });

    test("button should still be disabled", () => {
      chai.expect(form.find("button")).to.be.disabled();
    });

    test("field should be discretely invalid (as it's not been touched)", () => {
      expect(form.state().fields[0].isDiscretelyInvalid).toBe(true);
    });

    test("warning is not shown as field has not been touched", () => {
      expect(form.find("span.errors").length).toBe(0);
    });

    test("field should be touched after focus", () => {
      form.find("input").prop("onFocus")();
      expect(form.state().fields[0].touched).toBe(true);
    });

    test("field should be invalid", () => {
      expect(form.state().fields[0].isValid).toBe(false);
    });

    test("field has correct error message", () => {
      expect(form.state().fields[0].errorMessages).toBe("Numbers only");
    });

    test("warning now shown as field has been touched", () => {
      form.update();
      expect(form.find("span.errors").length).toBe(1);
    });

    test("warning is displayed as configured", () => {
      expect(form.find("span.errors").text()).toBe("Numbers only");
    });
  });
});

describe("changing form value prop", () => {
  const fields: FieldDef[] = [
    {
      id: "FIELD1",
      type: "text",
      name: "field1",
      validWhen: {
        matchesRegEx: {
          pattern: "^[\\d]+$",
          message: "Numbers only"
        }
      }
    }
  ];

  const onButtonClick = jest.fn();
  const formValue1 = {
    field1: "value1"
  };
  const formValue2 = {
    field1: "value2"
  };

  const form = mount(
    <Form value={formValue1}>
      <FormFragment defaultFields={fields} />
    </Form>
  );

  test("field has not been touched", () => {
    expect(form.state().fields[0].touched).toBe(false);
  });

  test("field should be touched after focus", () => {
    form.find("input").prop("onFocus")();
    form.update();
    expect(form.state().fields[0].touched).toBe(true);
  });

  test("field should not be touched after form value update", () => {
    form.setProps({ value: formValue2 });
    form.update();
    expect(form.state().fields[0].touched).toBe(false);
  });
});

describe("Form and FormFragment behave the same with defaultFields and value", () => {
  // This example is taken from issue: https://github.com/draperd/react-forms-processor/issues/35
  const fruit: FieldDef[] = [
    {
      id: "PICKMORETHANONE",
      name: "fruit",
      label: "Pick some fruit",
      placeholder: "Available fruits...",
      type: "multiselect",
      defaultValue: "apple,banana",
      valueDelimiter: ",",
      options: [
        {
          items: ["apple", "banana", "kiwi", "melon", "grapefruit", "plum"]
        }
      ]
    }
  ];

  test("Form field has correct value from defaultFields", () => {
    const form = mount(<Form defaultFields={fruit} />);
    const fieldValue = form.find("select").prop("value");
    expect(fieldValue).toEqual(["apple", "banana"]);
  });

  test("FormFragment field has correct value from defaultFields", () => {
    const form = mount(
      <Form>
        <FormFragment defaultFields={fruit} />
      </Form>
    );
    const fieldValue = form.find("select").prop("value");
    expect(fieldValue).toEqual(["apple", "banana"]);
  });

  test("Form field has correct value from value", () => {
    const form = mount(
      <Form defaultFields={fruit} value={{ fruit: "melon" }} />
    );
    const fieldValue = form.find("select").prop("value");
    expect(fieldValue).toEqual(["melon"]);
  });

  test("FormFragment field has correct value from value", () => {
    const form = mount(
      <Form value={{ fruit: "melon" }}>
        <FormFragment defaultFields={fruit} />
      </Form>
    );
    const fieldValue = form.find("select").prop("value");
    expect(fieldValue).toEqual(["melon"]);
  });
});
