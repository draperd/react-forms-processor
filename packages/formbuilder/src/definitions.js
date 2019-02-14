// @flow
import type { FieldDef } from "react-forms-processor";

const simpleValue: FieldDef[] = [
  {
    id: "VALUE",
    name: "value",
    type: "text",
    label: "Value",
    placeholder: "Value...",
    required: true
  }
];

const fieldRules: FieldDef[] = [
  {
    id: "ID",
    name: "id",
    type: "text",
    label: "Description of the rule",
    placeholder: "What does this rule do?",
    required: true
  },
  {
    id: "FIELD",
    name: "field",
    type: "select",
    label: "Field",
    placeholder: "Field to test...",
    required: true
  },
  {
    id: "IS",
    name: "is",
    type: "repeating",
    label: "Is one of the following values...",
    misc: {
      fields: simpleValue,
      idAttribute: "value",
      addButtonLabel: "Add value",
      unidentifiedLabel: "No Value",
      noItemsMessage: "No values added"
    }
  },
  {
    id: "ISNOT",
    name: "isNot",
    type: "repeating",
    label: "Is NOT one of the following values...",
    misc: {
      fields: simpleValue,
      addButtonLabel: "Add value",
      unidentifiedLabel: "No Value",
      noItemsMessage: "No values added"
    }
  }
];

const options: FieldDef[] = [
  {
    id: "LABEL",
    name: "label",
    type: "text",
    label: "Label"
  },
  {
    id: "VALUE",
    name: "value",
    type: "text",
    label: "Value",
    required: true
  }
];

const optionGroups: FieldDef[] = [
  {
    id: "HEADING",
    name: "heading",
    type: "text",
    label: "Heading",
    required: false
  },
  {
    id: "ITEMS",
    name: "items",
    type: "repeating",
    label: "Options",
    misc: {
      fields: options,
      idAttribute: "label",
      addButtonLabel: "Add option",
      unidentifiedLabel: "Unidentified option",
      noItemsMessage: "No options added"
    }
  }
];

const basicInfo: FieldDef[] = [
  {
    id: "ID",
    name: "id",
    type: "text",
    required: true,
    defaultValue: "",
    label: "ID",
    placeholder: "Enter a unique ID..."
  },
  {
    id: "NAME",
    name: "name",
    type: "text",
    required: true,
    defaultValue: " ", // TODO: investigate where it fails
    label: "Name",
    placeholder: "Enter the name for the field"
  },
  {
    id: "TYPE",
    name: "type",
    type: "select",
    defaultValue: "text",
    label: "Type",
    placeholder: "Choose a field type",
    options: [
      {
        items: [
          {
            value: "text",
            label: "Text field"
          },
          {
            value: "textarea",
            label: "Text area"
          },
          {
            value: "select",
            label: "Select field"
          },
          {
            value: "multiselect",
            label: "Multi-Select field"
          },
          {
            value: "radiogroup",
            label: "Radio-button group"
          },
          {
            value: "checkbox",
            label: "Checkbox"
          },
          {
            value: "date",
            label: "Date picker"
          }
        ]
      }
    ]
  },
  {
    id: "LABEL",
    name: "label",
    type: "text",
    required: false,
    defaultValue: "",
    label: "Label",
    placeholder: "Enter the label for the field"
  },
  {
    id: "DESCRIPTION",
    name: "description",
    type: "textarea",
    required: false,
    defaultValue: "",
    label: "Description",
    placeholder: "Enter a description for the field"
  },
  {
    id: "PLACEHOLDER",
    name: "placeholder",
    type: "text",
    required: false,
    defaultValue: "",
    label: "Placeholder Text",
    placeholder: "Placeholder..."
  },
  {
    id: "VALUE",
    name: "defaultValue",
    type: "text",
    defaultValue: "",
    label: "Initial value",
    placeholder: "Enter initial value for the field..."
  }
];

const optionsInfo: FieldDef[] = [
  {
    id: "OPTIONS",
    name: "options",
    type: "repeating",
    defaultValue: [],
    misc: {
      fields: optionGroups,
      idAttribute: "heading",
      addButtonLabel: "Add Option Group",
      noItemsMessage: "No options have been added!",
      unidentifiedLabel: "Unidentified Option Group"
    }
  }
];

const rulesInfo: FieldDef[] = [
  {
    id: "VISIBLE",
    name: "visible",
    type: "checkbox",
    label: "Initially visible",
    defaultValue: true
  },
  {
    id: "REQUIRED",
    name: "required",
    type: "checkbox",
    label: "Initially required",
    defaultValue: false
  },
  {
    id: "DISABLED",
    name: "disabled",
    type: "checkbox",
    label: "Initially disabled",
    defaultValue: false
  },
  {
    id: "VISIBLE_WHEN",
    name: "visibleWhen",
    type: "repeating",
    label: "This field is VISIBLE when...",
    defaultValue: [],
    misc: {
      fields: fieldRules,
      addButtonLabel: "Add Rule",
      unidentifiedLabel: "Unidentified rule"
    }
  },
  {
    id: "REQUIRED_WHEN",
    name: "requiredWhen",
    type: "repeating",
    label: "This field is REQUIRED when...",
    defaultValue: [],
    misc: {
      fields: fieldRules,
      addButtonLabel: "Add Rule",
      unidentifiedLabel: "Unidentified rule"
    }
  },
  {
    id: "DISABLED_WHEN",
    name: "disabledWhen",
    type: "repeating",
    label: "This field is DISABLED when...",
    defaultValue: [],
    misc: {
      fields: fieldRules,
      addButtonLabel: "Add Rule",
      unidentifiedLabel: "Unidentified rule"
    }
  }
];

const validationInfo: FieldDef[] = [
  {
    id: "SHOULD_MATCH_REGEX",
    name: "shouldMatchRegex",
    type: "checkbox",
    label: "Value should match a regular expression?",
    defaultValue: false
  },
  {
    id: "MATCHES_REGEX",
    name: "validWhen.matchesRegEx.pattern",
    type: "text",
    label: "Regular expression",
    defaultValue: "",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "SHOULD_MATCH_REGEX",
        is: [true]
      }
    ]
  },
  {
    id: "MATCHES_REGEX_MESSAGE",
    name: "validWhen.matchesRegEx.message",
    type: "text",
    label: "Error message to show when pattern does not match",
    defaultValue: "",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "SHOULD_MATCH_REGEX",
        is: [true]
      }
    ]
  },
  {
    id: "HAS_MIN_LENGTH",
    name: "hasMinLength",
    type: "checkbox",
    label: "Value should have a minimum length?",
    defaultValue: false
  },
  {
    id: "LENGTH_IS_GREATER_THAN",
    name: "validWhen.lengthIsGreaterThan.length",
    type: "text",
    label: "Length is greater than",
    defaultValue: "",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "HAS_MIN_LENGTH",
        is: [true]
      }
    ],
    validWhen: {
      matchesRegEx: {
        pattern: "^[\\d]+$",
        message: "Length can only be in whole numbers"
      }
    }
  },
  {
    id: "LENGTH_IS_GREATER_THAN_MESSAGE",
    name: "validWhen.lengthIsGreaterThan.message",
    type: "text",
    label: "Error message to show when not enough characters are provided",
    defaultValue: "",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "HAS_MIN_LENGTH",
        is: [true]
      }
    ]
  },
  {
    id: "HAS_MAX_LENGTH",
    name: "hasMaxLength",
    type: "checkbox",
    label: "Value should have a maximum length?",
    defaultValue: false
  },
  {
    id: "LENGTH_IS_LESS_THAN",
    name: "validWhen.lengthIsLessThan.length",
    type: "text",
    label: "Length is less than",
    defaultValue: "",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "HAS_MAX_LENGTH",
        is: [true]
      }
    ],
    validWhen: {
      matchesRegEx: {
        pattern: "^[\\d]+$",
        message: "Length can only be in whole numbers"
      }
    }
  },
  {
    id: "LENGTH_IS_LESS_THAN_MESSAGE",
    name: "validWhen.lengthIsLessThan.message",
    type: "text",
    label: "Error message to show when too many characters are provided",
    defaultValue: "",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "HAS_MAX_LENGTH",
        is: [true]
      }
    ]
  },
  {
    id: "FALLS_WITHIN_NUMERICAL_RANGE",
    name: "hasNumericalRange",
    type: "checkbox",
    label: "Value should fall within numerical range?",
    defaultValue: false
  },
  {
    id: "FALLS_WITHIN_NUMERICAL_RANGE_MIN",
    name: "validWhen.fallsWithinNumericalRange.min",
    type: "text",
    label: "Value must be greater or equal to",
    defaultValue: "",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "FALLS_WITHIN_NUMERICAL_RANGE",
        is: [true]
      }
    ],
    validWhen: {
      matchesRegEx: {
        pattern: "^[\\d]+$",
        message: "Length can only be in whole numbers"
      }
    }
  },
  {
    id: "FALLS_WITHIN_NUMERICAL_RANGE_MAX",
    name: "validWhen.fallsWithinNumericalRange.max",
    type: "text",
    label: "Value must be less than or equal to",
    defaultValue: "",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "FALLS_WITHIN_NUMERICAL_RANGE",
        is: [true]
      }
    ],
    validWhen: {
      matchesRegEx: {
        pattern: "^[\\d]+$",
        message: "Length can only be in whole numbers"
      }
    }
  },
  {
    id: "FALLS_WITHIN_NUMERICAL_RANGE_MESSAGE",
    name: "validWhen.fallsWithinNumericalRange.message",
    type: "text",
    label: "Error message to show when value falls outside of range",
    defaultValue: "",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "FALLS_WITHIN_NUMERICAL_RANGE",
        is: [true]
      }
    ]
  },
  {
    id: "COMPARE_TO",
    name: "shouldCompareTo",
    type: "checkbox",
    label: "Compare value with other field values?",
    description:
      "Check to validate the current field against other fields in the form",
    defaultValue: false
  },
  {
    id: "COMPARED_TO_FIELDS",
    name: "validWhen.comparedTo.fields",
    type: "multiselect",
    label: "These fields...",
    description: "Select the fields to compare the value with",
    placeholder: "Select some fields...",
    omitWhenHidden: true,
    visibleWhen: [
      {
        id: "Hides until checked",
        field: "COMPARE_TO",
        is: [
          {
            value: "true"
          }
        ]
      }
    ]
  },
  {
    id: "COMPARED_TO_IS",
    name: "validWhen.comparedTo.is",
    type: "radiogroup",
    label: "Are all...",
    description: "...than the current field",
    placeholder: "",
    defaultValue: "BIGGER",
    omitWhenHidden: true,
    options: [
      {
        heading: "Comparators",
        items: [
          {
            label: "Bigger (numerically)",
            value: "SMALLER"
          },
          {
            label: "Smaller (numerically)",
            value: "BIGGER"
          },
          {
            label: "Longer (in characters)",
            value: "SHORTER"
          },
          {
            label: "Shorter (in characters)",
            value: "LONGER"
          }
        ]
      }
    ],
    visibleWhen: [
      {
        id: "Hides field",
        field: "COMPARE_TO",
        is: [
          {
            value: "true"
          }
        ]
      }
    ]
  },
  {
    id: "COMPARED_TO_MESSAGE",
    name: "validWhen.comparedTo.message",
    type: "text",
    label: "Error message",
    description: "The message to display when the validation rule fails",
    placeholder: "Error message...",
    defaultValue: "",
    omitWhenHidden: true,
    visibleWhen: [
      {
        id: "Hides",
        field: "COMPARE_TO",
        is: [
          {
            value: "true"
          }
        ]
      }
    ]
  }
];

const advancedInfo: FieldDef[] = [
  {
    id: "OMIT_WHEN_HIDDEN",
    name: "omitWhenHidden",
    label: "Exclude the field value when the field is hidden?",
    type: "checkbox",
    defaultValue: false
  },
  {
    id: "OMIT_WHEN_VALUE_IS",
    name: "omitWhenValueIs",
    type: "repeating",
    label: "Exclude the field value if it is one of these values",
    misc: {
      fields: [
        {
          id: "VALUE",
          name: "value",
          type: "text",
          label: "Value",
          required: true
        }
      ],
      idAttribute: "value",
      addButtonLabel: "Add value",
      unidentifiedLabel: "Unidentified value",
      noItemsMessage: "No value added"
    }
  },
  {
    id: "VALUE_DELIMITER",
    name: "valueDelimiter",
    label: "Split value using this string",
    type: "text",
    defaultValue: ""
  },
  {
    id: "USE_CHANGES_AS_VALUES",
    name: "useChangesAsValues",
    label: "Use field changes as values",
    type: "checkbox",
    defaultValue: false
  },
  {
    id: "ADDED_SUFFIX",
    name: "addedSuffix",
    label: "Apply this string to the field name for added values",
    type: "text",
    defaultValue: "_added",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "USE_CHANGES_AS_VALUES",
        is: [true]
      }
    ]
  },
  {
    id: "REMOVED_SUFFIX",
    name: "removedSuffix",
    label: "Apply this string to the field name for removed values",
    type: "text",
    defaultValue: "_removed",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "USE_CHANGES_AS_VALUES",
        is: [true]
      }
    ]
  }
];

const formBuilder: FieldDef[] = [
  {
    id: "FORM",
    name: "fields",
    type: "repeating",
    label: "Form Definition",
    defaultValue: [],
    misc: {
      idAttribute: "field.id",
      addButtonLabel: "Add Field",
      unidentifiedLabel: "Unidentified field",
      noItemsMessage: "No fields configured yet!",
      fields: [
        {
          id: "FIELD",
          name: "field",
          type: "field"
        }
      ]
    }
  }
];

export {
  formBuilder,
  basicInfo,
  optionsInfo,
  rulesInfo,
  validationInfo,
  advancedInfo
};
