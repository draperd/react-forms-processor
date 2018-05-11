const simpleValue = [
  {
    id: "VALUE",
    name: "value",
    type: "text",
    label: "Value",
    placeholder: "Value...",
    required: true
  }
];

const fieldRules = [
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

const options = [
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

const optionGroups = [
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

const field = [
  {
    id: "ID",
    name: "id",
    type: "text",
    required: true,
    value: "",
    label: "ID",
    placeholder: "Enter a unique ID..."
  },
  {
    id: "NAME",
    name: "name",
    type: "text",
    required: true,
    value: "",
    label: "Name",
    placeholder: "Enter the name for the field"
  },
  {
    id: "TYPE",
    name: "type",
    type: "select",
    value: "text",
    label: "Type",
    placeholder: "Choose a field type",
    options: [
      { items: ["text", "textarea", "select", "radiogroup", "checkbox"] }
    ]
  },
  {
    id: "LABEL",
    name: "label",
    type: "text",
    required: false,
    value: "",
    label: "Label",
    placeholder: "Enter the label for the field"
  },
  {
    id: "PLACEHOLDER",
    name: "placeholder",
    type: "text",
    required: false,
    value: "",
    label: "Placeholder Text",
    placeholder: "Placeholder..."
  },
  {
    id: "VALUE",
    name: "value",
    type: "text",
    value: "",
    label: "Initial value",
    placeholder: "Enter initial value for the field..."
  },
  {
    id: "OPTIONS",
    name: "options",
    type: "repeating",
    value: [],
    misc: {
      fields: optionGroups,
      idAttribute: "heading",
      addButtonLabel: "Add Option Group",
      noItemsMessage: "No options have been added!",
      unidentifiedLabel: "Unidentified Option Group"
    }
  },
  {
    id: "VISIBLE_WHEN",
    name: "visibleWhen",
    type: "repeating",
    label: "This field is visible when...",
    value: [],
    misc: {
      fields: fieldRules,
      addButtonLabel: "Add Rule",
      unidentifiedLabel: "Unidentified rule"
    }
  }
];

const formBuilder = [
  {
    id: "FORM",
    name: "fields",
    type: "repeating",
    label: "Form Definition",
    value: [],
    misc: {
      addButtonLabel: "Add Field",
      unidentifiedLabel: "Unidentified field",
      noItemsMessage: "No fields configured yet!",
      fields: field
    }
  }
];

export { formBuilder };
