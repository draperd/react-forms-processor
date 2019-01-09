// @flow
import React from "react";
import MultiSelect from "./components/fields/MultiSelect";
import RadioGroup from "./components/fields/RadioGroup";
import Select from "./components/fields/Select";
import TextField from "./components/fields/TextField";
import Checkbox from "./components/fields/Checkbox";

import type {
  FieldRenderer,
  FieldDef,
  OnFieldChange
} from "react-forms-processor";

const renderer: FieldRenderer = (
  field,
  onChange,
  onFieldFocus,
  onFieldBlur
) => {
  const { id, type, label, misc = {} } = field;
  switch (type) {
    case "text":
      return <TextField key={id} {...field} />;

    case "textarea":
      return <TextField key={id} multifield {...field} />;

    case "checkbox":
      return <Checkbox key={id} {...field} />;

    case "select":
      return <Select key={id} {...field} />;

    case "multiselect":
      return <MultiSelect key={id} {...field} />;

    case "radiogroup":
      return <RadioGroup key={id} {...field} />;

    default:
      return <div>No mapped field</div>;
  }
};

export default renderer;
