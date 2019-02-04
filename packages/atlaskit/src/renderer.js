// @flow
import React from "react";
import Date from "./components/fields/Date";
import FieldText from "./components/fields/FieldText";
import FieldTextArea from "./components/fields/FieldTextArea";
import Checkbox from "./components/fields/Checkbox";
import RadioGroup from "./components/fields/RadioGroup";
import Select from "./components/fields/Select";
import MultiSelect from "./components/fields/MultiSelect";
import type { FieldRenderer } from "react-forms-processor";

const renderer: FieldRenderer = (
  field,
  onChange,
  onFieldFocus,
  onFieldBlur
) => {
  const { id, type, label } = field;
  switch (type) {
    case "text":
      return <FieldText key={id} {...field} />;

    case "textarea":
      return <FieldTextArea key={id} {...field} />;

    case "checkbox":
      return <Checkbox key={id} {...field} />;

    case "date":
      return <Date key={id} {...field} />;

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
