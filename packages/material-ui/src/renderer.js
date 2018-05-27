// @flow
import React from "react";
import Select from "./components/fields/Select";
import TextField from "./components/fields/TextField";
import Checkbox from "./components/fields/Checkbox";

import type { FieldRenderer, FieldDef, OnFieldChange } from "../../../types";

const renderer: FieldRenderer = (field: FieldDef, onChange: OnFieldChange) => {
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

    default:
      return <div>No mapped field</div>;
  }
};

export default renderer;
