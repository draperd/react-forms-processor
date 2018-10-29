// @flow
import React, { Component, Fragment } from "react";
import FormContext from "./FormContext";
import { getFirstDefinedValue } from "../utilities/utils";
import type {
  FieldDef,
  FormFragmentComponentProps,
  FormFragmentComponentWithContextProps,
  FormValue
} from "../types";

const registerFieldIfNew = (
  field: FieldDef,
  currentFields: FieldDef[],
  registerField: FieldDef => void
) => {
  if (currentFields.find(existingField => existingField.id === field.id)) {
    // console.warn("Fragment tried to re-register field", field.id);
  } else {
    registerField(field);
  }
};

const findRegisteredField = (
  fields: FieldDef[],
  targetId: string
): FieldDef | void => {
  const fieldToRender = fields.find(
    registeredField => registeredField.id === targetId
  );
  return fieldToRender;
};

const setFieldValue = (
  fieldToRender: FieldDef,
  defaultDefinition: FieldDef,
  formValue: FormValue
): void => {
  const { name, omitWhenValueIs, value } = defaultDefinition;
  const formValueForName = formValue[name];
  if (
    omitWhenValueIs &&
    omitWhenValueIs.find(targetValue => targetValue === formValueForName) === -1
  ) {
    fieldToRender.value = defaultDefinition.value;
  } else {
    fieldToRender.value = getFirstDefinedValue(formValue[name], value);
  }
};

const renderFieldIfVisible = (
  field: FieldDef,
  props: FormFragmentComponentWithContextProps
) => {
  const {
    defaultFields = [],
    fields,
    onFieldChange,
    onFieldFocus,
    renderer,
    value
  } = props;
  const fieldToRender = findRegisteredField(fields, field.id);
  if (fieldToRender && fieldToRender.visible) {
    setFieldValue(fieldToRender, field, value);
    return renderer(fieldToRender, onFieldChange, onFieldFocus);
  }
  return null;
};

class FormFragment extends Component<
  FormFragmentComponentWithContextProps,
  void
> {
  constructor(props: FormFragmentComponentWithContextProps) {
    super(props);
    const { defaultFields = [], registerField, fields = [] } = props;
    defaultFields.forEach(field =>
      registerFieldIfNew(field, fields, registerField)
    );
  }

  render() {
    const { defaultFields = [] } = this.props;
    const renderedFields = defaultFields.map(field =>
      renderFieldIfVisible(field, this.props)
    );

    return <Fragment>{renderedFields}</Fragment>;
  }
}

export default (props: FormFragmentComponentProps) => (
  <FormContext.Consumer>
    {form => {
      return <FormFragment {...form} {...props} />;
    }}
  </FormContext.Consumer>
);
