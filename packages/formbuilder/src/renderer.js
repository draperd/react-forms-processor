// @flow
import React from "react";
import akRenderer from "../../atlaskit/src/renderer";
import FieldDefinitionField from "./FieldDefinitionField";
import type { FieldRenderer, FieldDef, OnFieldChange } from "../../../types";

const renderer: FieldRenderer = (field: FieldDef, onChange: OnFieldChange) => {
  const { id, type } = field;
  switch (type) {
    case "field":
      return <FieldDefinitionField key={id} {...field} />;

    default:
      return akRenderer(field, onChange);
  }
};

export default renderer;
