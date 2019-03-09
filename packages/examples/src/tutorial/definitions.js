// @flow
import type { FieldDef } from "react-forms-processor";

export const singleField: FieldDef[] = [
  {
    id: "FIELD1",
    name: "key",
    type: "text",
    label: "My first field",
    description: "This is an example field",
    placeholder: "Enter a value",
    defaultValue: "",
    visible: true,
    required: false,
    disabled: false
  }
];

export const visibility: FieldDef[] = [
  {
    id: "TEXT",
    name: "key",
    type: "text",
    label: "Name",
    defaultValue: "Gloria",
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

export const requiredAndDisabledRules: FieldDef[] = [
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

export const allRulesMustPass: FieldDef[] = [
  {
    id: "BEHAVIOUR",
    name: "behvaiour",
    type: "radiogroup",
    label: "What should change?",
    description:
      "Select the attribute to be changed and then confirm the change",
    defaultValue: "Visibility",
    options: [
      {
        items: ["Visibility", "Requirement", "Disability"]
      }
    ]
  },
  {
    id: "CONFIRMATION",
    name: "confirmation",
    type: "checkbox",
    label: "Confirm that you want the attribute to change",
    defaultValue: false
  },
  {
    id: "TARGET",
    name: "target",
    type: "text",
    label: "Target field",
    description: "This is the field that will be updated",
    defaultValue: "Sample",
    visibleWhen: [
      {
        field: "BEHAVIOUR",
        isNot: ["Visibility"]
      },
      {
        field: "CONFIRMATION",
        is: [true]
      }
    ],
    requiredWhenAll: [
      {
        field: "BEHAVIOUR",
        is: ["Requirement"]
      },
      {
        field: "CONFIRMATION",
        is: [true]
      }
    ],
    disabledWhenAll: [
      {
        field: "BEHAVIOUR",
        is: ["Disability"]
      },
      {
        field: "CONFIRMATION",
        is: [true]
      }
    ]
  }
];

export const fieldsWithOptions: FieldDef[] = [
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
  },
  {
    id: "OPTIONS3",
    name: "characters",
    type: "multiselect",
    label: "Pick some characters?",
    defaultValue: []
  }
];

export const manipulateOptions: FieldDef[] = [
  {
    id: "FRUITS",
    name: "fruit",
    type: "multiselect",
    label: "Pick some fruit?",
    defaultValue: "apple,pear",
    options: [
      {
        items: ["apple", "banana", "orange", "pear"]
      }
    ],
    valueDelimiter: ",",
    useChangesAsValues: true,
    addedSuffix: "",
    removedSuffix: ""
  }
];

export const duplicateNames = [
  {
    id: "DEFAULTS",
    name: "number",
    type: "radiogroup",
    label: "Pick a number",
    defaultValue: "One",
    options: [
      {
        items: ["One", "Two", "Three", "Four", "Other"]
      }
    ],
    omitWhenValueIs: ["Other"]
  },
  {
    id: "CUSTOM",
    name: "number",
    type: "text",
    label: "Enter a number",
    visibleWhen: [{ field: "DEFAULTS", is: ["Other"] }],
    omitWhenHidden: true
  }
];

export const validation: FieldDef[] = [
  {
    id: "VALIDATED",
    name: "name",
    type: "text",
    label: "Get it right!",
    trimValue: true,
    validWhen: {
      lengthIsGreaterThan: {
        length: 3,
        message: "The value must have more than 3 characterrs"
      },
      lengthIsLessThan: {
        length: 6,
        message: "The value must less than 6 characters"
      },
      fallsWithinNumericalRange: {
        min: 150,
        max: 80000,
        message: "The value must be more than 150 and less than 80000"
      },
      matchesRegEx: {
        pattern: "^[\\d]+$",
        message: "Only numbers allowed"
      },
      isNot: {
        values: ["2500", "4001"],
        message: "The value cannot be 2500 nor 4001"
      }
    }
  }
];

export const comparisonValidation: FieldDef[] = [
  {
    id: "ONE",
    name: "one",
    type: "text",
    label: "Field one",
    description: "Must be the biggest field",
    trimValue: true,
    validWhen: {
      comparedTo: {
        fields: ["TWO", "THREE"],
        is: "BIGGER"
      }
    }
  },
  {
    id: "TWO",
    name: "two",
    type: "text",
    label: "Field two",
    description: "Must be the shortest field",
    trimValue: true,
    validWhen: {
      comparedTo: {
        fields: ["ONE", "THREE"],
        is: "SHORTER"
      }
    }
  },
  {
    id: "THREE",
    name: "three",
    type: "text",
    label: "Field three",
    description: "Must be the smallest field",
    trimValue: true,
    validWhen: {
      comparedTo: {
        fields: ["ONE", "TWO"],
        is: "SMALLER"
      }
    }
  }
];

export const complexValidation: FieldDef[] = [
  {
    id: "LENGTH_REQUIREMENTS",
    name: "length",
    type: "radiogroup",
    label: "How long should the name be?",
    defaultValue: "Small",
    description: "Choose the length requirements for the name field",
    options: [
      {
        items: ["Small", "Medium", "Large"]
      }
    ]
  },
  {
    id: "NAME",
    name: "name",
    type: "text",
    label: "Name?",
    defaultValue: "",
    description:
      "A name (the length required is determined by the field above)",
    validWhen: {
      someAreTrue: {
        message: "Length must be less than 5 when size is small",
        conditions: [
          {
            field: "LENGTH_REQUIREMENTS",
            is: {
              values: ["Medium", "Large"]
            }
          },
          {
            lengthIsLessThan: {
              length: 5
            }
          }
        ]
      }
    }
  }
];
