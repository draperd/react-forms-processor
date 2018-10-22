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
      // matchesRegEx: {},
      allAreTrue: {
        message: "all have to be true",
        conditions: [
          {
            field: "TRIGGER",
            //   isNot:
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
  message: "all have to be true",
  conditions: [
    {
      field: "TRIGGER",
      //   isNot:
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
};

const triggerField = createField({
  id: "TRIGGER",
  name: "trigger",
  value: "on"
});

const targetField = createField({
  id: "TARGET",
  name: "target",
  value: "valid"
});

const allFields = [triggerField, targetField];

describe("allAreTrue", () => {
  test("needs a name", () => {
    expect(
      allAreTrue({
        value: "valid",
        allFields,
        ...allAreTrueExample
      })
    ).toBeUndefined();
  });
});
