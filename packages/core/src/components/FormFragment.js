// @flow
import React, { Component, Fragment } from "react";
import FormContext from "./FormContext";
import { getFirstDefinedValue } from "../utilities/utils";
import type { FieldDef, FormContextData } from "../../../../types";

export type InnerFormFragmentProps = FormContextData & {
  defaultFields: FieldDef[]
};

export type FormFragmentProps = {
  defaultFields: FieldDef[]
};

class FormFragment extends Component<InnerFormFragmentProps, void> {
  constructor(props: InnerFormFragmentProps) {
    super(props);
    const { defaultFields = [], registerField, fields = [] } = props;
    defaultFields.forEach(field => {
      if (fields.find(existingField => existingField.id === field.id)) {
        // console.warn("Fragment tried to re-register field", field.id);
      } else {
        registerField(field);
      }
    });
  }
  render() {
    const {
      defaultFields = [],
      fields,
      onFieldChange,
      onFieldFocus,
      renderer,
      value
    } = this.props;
    const renderedFields = defaultFields.map(field => {
      const fieldToRender = fields.find(
        registeredField => registeredField.id === field.id
      );
      if (fieldToRender && fieldToRender.visible) {
        const { name, omitWhenValueIs } = field;
        const formValueForName = value[name];
        if (
          omitWhenValueIs &&
          omitWhenValueIs.find(
            targetValue => targetValue === formValueForName
          ) === -1
        ) {
          fieldToRender.value = field.value;
        } else {
          fieldToRender.value = getFirstDefinedValue(
            value[field.name],
            field.value
          );
        }
        return renderer(fieldToRender, onFieldChange, onFieldFocus);
      }
      return null;
    });

    return <Fragment>{renderedFields}</Fragment>;
  }
}

export default (props: FormFragmentProps) => (
  <FormContext.Consumer>
    {form => {
      return <FormFragment {...form} {...props} />;
    }}
  </FormContext.Consumer>
);
