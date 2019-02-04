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
import nativeRenderer from "./renderer";

chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

// We want to create a custom renderer that takes numbers as input values but displays them as strings...
const customRenderer: FieldRenderer = (
  field,
  onChange,
  onFieldFocus,
  onFieldBlur
) => {
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
            onBlur={() => onFieldBlur(id)}
          />
          {!isValid ? (
            <span className="errors">{errorMessages}</span>
          ) : (
            <span />
          )}
        </div>
      );
    }
    default: {
      return nativeRenderer(field, onChange, onFieldFocus, onFieldBlur);
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
      required: true,
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

    firstDate.prop("onBlur")();
    secondDate.prop("onBlur")();
    form.update();
    expect(form.state().fields[0].errorMessages).toBe(
      "A value must be provided, Must be before second date"
    );
    expect(form.state().fields[1].errorMessages).toBe("");
  });

  test("warning shown for fields", () => {
    expect(form.find("span.errors").length).toBe(1);
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

  test("setting second date to date before second date causes fields to be invalid", () => {
    secondDate.prop("onChange")({ target: { value: xmasString } });
    expect(form.state().isValid).toBe(false);
    expect(form.state().fields[0].isValid).toBe(false);
    expect(form.state().fields[1].isValid).toBe(false);
    expect(form.state().fields[0].errorMessages).toBe(firstDateError);
    expect(form.state().fields[1].errorMessages).toBe(secondDateError);
  });

  test("updating both dates so first date is before second date makes the form valid", () => {
    firstDate.prop("onChange")({ target: { value: newYearsEveString } });
    secondDate.prop("onChange")({ target: { value: newYearString } });
    expect(form.state().isValid).toBe(true);
    expect(form.state().fields[0].errorMessages).toBe("");
  });

  test("clearing second date makes the form invalid and first date shows an error", () => {
    firstDate.prop("onChange")({ target: { value: newYearsEveString } });
    secondDate.prop("onChange")({ target: { value: "" } });
    expect(form.state().isValid).toBe(false);
    expect(form.state().fields[0].errorMessages).toBe(firstDateError);
    expect(form.state().fields[1].errorMessages).toBe("");
  });
});

// This test was added in an attempt to accurately represent the problem with a failing form...
export const DATE_METHODS = {
  AS_EARLY_AS_POSSIBLE: "asEarlyAsPossible",
  RELATIVE_TO_PREVIOUS_RELEASE: "relativeToPreviousRelease",
  FIXED_DATE: "fixedDate",
  AFTER_ALL_ISSUES_ARE_COMPLETED: "afterAllIssuesAreCompleted"
};

const fields: FieldDef[] = [
  {
    id: "name",
    type: "text",
    name: "name",
    label: "Name",
    required: true,
    defaultValue: "Default name",
    validWhen: {
      lengthIsLessThan: {
        length: 256,
        message: "Too long"
      }
    }
  },
  {
    id: "startMethod",
    type: "select",
    name: "startMethod",
    label: "Start method",
    required: true,
    defaultValue: DATE_METHODS.AS_EARLY_AS_POSSIBLE,
    options: [
      {
        items: [
          {
            label: "As early as possible",
            value: DATE_METHODS.AS_EARLY_AS_POSSIBLE
          },
          {
            label: "Fixed date",
            value: DATE_METHODS.FIXED_DATE
          }
        ]
      }
    ]
  },
  {
    id: "start",
    type: "date",
    name: "start",
    required: true,
    visibleWhen: [
      {
        field: "startMethod",
        is: [DATE_METHODS.FIXED_DATE]
      }
    ],
    validWhen: {
      comparedTo: {
        fields: ["end"],
        is: "SMALLER",
        message: "TOO BIG"
      },
      isNot: {
        values: [""],
        message: "EMPTY STRING"
      }
    }
  },
  {
    id: "endMethod",
    type: "select",
    name: "endMethod",
    label: "End method",
    required: true,
    defaultValue: DATE_METHODS.AFTER_ALL_ISSUES_ARE_COMPLETED,
    options: [
      {
        items: [
          {
            label: "After all completed",
            value: DATE_METHODS.AFTER_ALL_ISSUES_ARE_COMPLETED
          },
          {
            label: "Fixed date",
            value: DATE_METHODS.FIXED_DATE
          }
        ]
      }
    ]
  },
  {
    id: "end",
    type: "date",
    name: "end",
    required: true,
    visibleWhen: [
      {
        field: "endMethod",
        is: [DATE_METHODS.FIXED_DATE]
      }
    ],
    validWhen: {
      comparedTo: {
        fields: ["start"],
        is: "BIGGER",
        message: "TOO SMALL"
      }
    }
  }
];

describe("complex test case", () => {
  const form = mount(
    <Form
      defaultFields={fields}
      renderer={customRenderer}
      showValidationBeforeTouched
    />
  );

  form.update();

  const startMethodField = form.find("select#startMethod").at(0);
  const endMethodField = form.find("select#endMethod").at(0);

  test("form is initially invalid (with default values set)", () => {
    expect(form.state().isValid).toBe(true);
  });

  let fixedStartDateField;
  test("setting a fixed start date makes form invalid", done => {
    startMethodField.prop("onChange")({
      target: { value: DATE_METHODS.FIXED_DATE }
    });
    form.update(); // Need update to force render...

    expect(form.state().isValid).toBe(false);

    setTimeout(() => {
      fixedStartDateField = form.find("input#start").at(0);
      done();
    });
  });

  test("giving the fixed date field a value makes the form valid again", () => {
    fixedStartDateField.prop("onChange")({
      target: { value: newYearsEveString }
    });
    expect(form.state().isValid).toBe(true);
  });

  let fixedEndDateField;
  test("setting a fixed end date makes the form invalid", done => {
    // When the end date comes into play the form should be invalid because it can now be compared against...
    endMethodField.prop("onChange")({ target: { value: "fixedDate" } });
    form.update();

    setTimeout(() => {
      fixedEndDateField = form.find("input#end").at(0);
      done();
    }, 0);
    expect(form.state().isValid).toBe(false);
  });

  test("giving the fixed end date field a value BEFORE the start date keeps the form invalid", () => {
    fixedEndDateField.prop("onChange")({ target: { value: xmasString } });
    expect(form.state().isValid).toBe(false);
  });

  test("giving the fixed end date field a value AFTER the start date makes the form valid", () => {
    fixedEndDateField.prop("onChange")({ target: { value: newYearString } });
    expect(form.state().isValid).toBe(true);
  });
});
