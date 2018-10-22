// @flow
import { allAreTrue, someAreTrue } from "./validation";
import { createField } from "./utils.js";
import type { FieldDef, ComplexValidationConfig } from "../types";

// Set up field definitions where the validation rule is dependant upon multiple fields
const fields: FieldDef[] = [
  {
    id: "TRIGGER",
    name: "trigger",
    type: "text",
    defaultValue: "off"
  },
  {
    id: "TARGET",
    name: "target",
    type: "text",
    defaultValue: "",
    validWhen: {
      allAreTrue: {
        message: "all have to be true",
        conditions: [
          {
            field: "TRIGGER",
            matchesRegEx: {
              pattern: "on"
            }
          },
          {
            // NOTE: When there is no 'field' - the current field is used
            matchesRegEx: {
              pattern: "valid"
            }
          }
        ]
      },
      someAreTrue: {
        message: "some are true",
        conditions: [
          {
            field: "TRIGGER",
            isNot: {
              values: ["off"],
              message: "something"
            }
          },
          {
            isNot: {
              values: ["false"],
              message: "Don't be bob when trigger is off"
            }
          }
        ]
      }
    }
  }
];

const allAreTrueExample: ComplexValidationConfig = {
  message: "fail",
  conditions: [
    {
      field: "TRIGGER",
      isNot: {
        values: ["on"]
      }
    },
    {
      isNot: {
        values: ["invalid"]
      }
    }
  ]
};

const triggerField = createField({
  id: "TRIGGER",
  name: "trigger",
  value: "off"
});

const targetField = createField({
  id: "TARGET",
  name: "target",
  value: "valid"
});

const allFields = [triggerField, targetField];

describe("allAreTrue", () => {
  test("should pass when both conditions are true", () => {
    expect(
      allAreTrue({
        value: "valid",
        allFields,
        ...allAreTrueExample
      })
    ).toBeUndefined();
  });
  test("should fail when one conditions is false", () => {
    triggerField.value = "on";
    expect(
      allAreTrue({
        value: "valid",
        allFields,
        ...allAreTrueExample
      })
    ).toBe("fail");
  });
});
