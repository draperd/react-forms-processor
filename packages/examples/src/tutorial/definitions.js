// @flow
import type { FieldDef } from "../../../../types";

export const singleField = [
  {
    id: "FIELD1",
    name: "key",
    type: "text",
    label: "My first field",
    description: "This is an example field",
    defaultValue: "value",
    visible: true,
    required: false,
    disabled: false
  }
];

export const visibility = [
  {
    id: "TEXT",
    name: "key",
    type: "text",
    label: "Name",
    visibleWhen: [
      {
        field: "CHECKBOX",
        is: [true]
      }
    ]
  },
  {
    id: "CHECKBOX",
    name: "show",
    type: "checkbox",
    label: "Show the name field?",
    defaultValue: true
  }
];

export const requiredAndDisabledRules = [
  {
    id: "TEXT",
    name: "key",
    type: "text",
    label: "Name",
    requiredWhen: [
      {
        field: "REQUIRED",
        is: [true]
      }
    ],
    disabledWhen: [
      {
        field: "ENABLED",
        isNot: [true]
      }
    ]
  },
  {
    id: "REQUIRED",
    name: "isRequired",
    type: "checkbox",
    label: "Make the text field required",
    defaultValue: false
  },
  {
    id: "ENABLED",
    name: "isEnabled",
    type: "checkbox",
    label: "Enable the text field",
    defaultValue: true
  }
];

export const fieldsWithOptions = [
  {
    id: "OPTIONS1",
    name: "fruit",
    type: "radiogroup",
    label: "Pick your fruit?",
    defaultValue: "orange",
    options: [
      {
        items: ["apple", "banana", "orange", "pear"]
      }
    ]
  },
  {
    id: "OPTIONS2",
    name: "betterFruit",
    type: "select",
    label: "Pick your better named fruit?",
    defaultValue: "A",
    options: [
      {
        heading: "Round fruits",
        items: [{ label: "Apple", value: "A" }, { label: "Orange", value: "O" }]
      },
      {
        heading: "Other shapes",
        items: [{ label: "Banana", value: "B" }, { label: "Pear", value: "C" }]
      }
    ]
  }
];
