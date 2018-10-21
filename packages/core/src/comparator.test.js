// @flow
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16.3";
import Form from "./components/Form";
import FormButton from "./components/Button";
import type {
  FieldRenderer,
  FieldDef,
  OnFieldChange,
  OnFieldFocus,
  Option
} from "./types";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import FormFragment from "./components/FormFragment";

chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

// We want to create a custom renderer that takes numbers as input values but displays them as strings...
const customRenderer: FieldRenderer = (field, onChange, onFieldFocus) => {
  const {
    disabled = false,
    errorMessages,
    id,
    isValid,
    name,
    placeholder,
    required,
    type,
    value,
    label
  } = field;
  let items;
  switch (type) {
    case "date": {
      // $FlowFixMe - this is OK, we know the value type...
      const convertedValue = value ? new Date(value).toUTCString() : "";
      return (
        <div key={id}>
          <label htmlFor={id}>{label} </label>
          <input
            type="text"
            id={id}
            name={name}
            value={convertedValue}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            onChange={evt => onChange(id, new Date(evt.target.value).getTime())}
            onFocus={() => onFieldFocus(id)}
          />
          {!isValid ? (
            <span className="errors">{errorMessages}</span>
          ) : (
            <span />
          )}
        </div>
      );
    }
  }
};

// Set up some values for comparing dates. We want to be able to pass in number values to the renderer but have
// them displayed as strings and for string values to be output to the form as numbers...
const xmasString = "Tue, 25 Dec 2018 00:00:00 GMT";
const xmasDate = new Date(xmasString);
const xmasNumber = xmasDate.getTime();

const newYearsEveString = "Mon, 31 Dec 2018 00:00:00 GMT";
const newYearsEveDate = new Date(newYearsEveString);
const newYearsEveNumber = newYearsEveDate.getTime();

const newYearString = "Tue, 01 Jan 2019 00:00:00 GMT";
const newYearDate = new Date(newYearString);
const newYearNumber = newYearDate.getTime();

describe("custom renderer", () => {
  const fields: FieldDef[] = [
    {
      id: "DATE1",
      name: "date1",
      type: "date",
      defaultValue: xmasNumber
    }
  ];
  const form = mount(<Form defaultFields={fields} renderer={customRenderer} />);
  const field = form.find("input");

  test("field parses number to date", () => {
    expect(field.prop("value")).toBe(xmasString);
  });

  test("field outputs string value as number", () => {
    expect(form.state().value.date1).toBe(xmasNumber);
  });

  test("updated field value is coverted to a string", () => {
    field.prop("onChange")({ target: { value: newYearString } });
    expect(form.state().value.date1).toBe(newYearNumber);
  });
});

const firstDateError = "Must be before second date";
const secondDateError = "Must be after first date";

describe("compare date fields", () => {
  const fields: FieldDef[] = [
    {
      id: "DATE1",
      name: "date1",
      type: "date",
      validWhen: {
        comparedTo: {
          fields: ["DATE2"],
          is: "SMALLER",
          message: firstDateError
        }
      }
    },
    {
      id: "DATE2",
      name: "date2",
      type: "date",
      validWhen: {
        comparedTo: {
          fields: ["DATE1"],
          is: "BIGGER",
          message: secondDateError
        }
      }
    }
  ];
  const form = mount(<Form defaultFields={fields} renderer={customRenderer} />);
  const firstDate = form.find("input").at(0);
  const secondDate = form.find("input").at(1);

  test("form is initially invalid because no dates are set", () => {
    expect(form.state().isValid).toBe(false);

    firstDate.prop("onFocus")();
    secondDate.prop("onFocus")();
    form.update();
    expect(form.state().fields[0].errorMessages).toBe(firstDateError);
    expect(form.state().fields[1].errorMessages).toBe(secondDateError);
  });

  test("warning shown for fields", () => {
    expect(form.find("span.errors").length).toBe(2);
  });

  test("first date becomes valid when set, but form is still invalid because second date is not set", () => {
    firstDate.prop("onChange")({ target: { value: xmasString } });
    expect(form.state().isValid).toBe(false);
  });

  test("second date becomes valid when set and form is valid because both dates are set", () => {
    secondDate.prop("onChange")({ target: { value: newYearsEveString } });
    expect(form.state().isValid).toBe(true);
  });

  test("fields have no errors in form state", () => {
    expect(form.state().fields[0].isValid).toBe(true);
    expect(form.state().fields[0].errorMessages).toBe("");

    expect(form.state().fields[1].isValid).toBe(true);
    expect(form.state().fields[1].errorMessages).toBe("");
  });

  test("setting first date to date after second date causes fields to be invalid", () => {
    firstDate.prop("onChange")({ target: { value: newYearString } });
    expect(form.state().isValid).toBe(false);
    expect(form.state().fields[0].isValid).toBe(false);
    expect(form.state().fields[0].errorMessages).toBe(firstDateError);
  });

  test("updating both dates so first date is before second date makes the form valid", () => {
    firstDate.prop("onChange")({ target: { value: newYearsEveString } });
    secondDate.prop("onChange")({ target: { value: newYearString } });
    expect(form.state().isValid).toBe(true);
    expect(form.state().fields[0].errorMessages).toBe("");
  });
});
