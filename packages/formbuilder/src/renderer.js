// @flow
import React from "react";
import akRenderer from "../../atlaskit/src/renderer";
import FieldDefinitionField from "./FieldDefinitionField";
import type { FieldRenderer, FieldDef, OnFieldChange } from "../../../types";

const renderer: FieldRenderer = (field, onChange, onFieldFocus) => {
  const { id, type } = field;
  switch (type) {
    case "field":
      return <FieldDefinitionField key={id} {...field} />;

    default:
      return akRenderer(field, onChange, onFieldFocus);
  }
};

export default renderer;
