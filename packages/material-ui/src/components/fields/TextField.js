// @flow
import React from "react";
import TextField from "@material-ui/core/TextField";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "../../../../../types";

class MaterialUiTextField extends React.Component<Field> {
  render() {
    const {
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      onFieldChange,
      placeholder,
      required,
      value,
      label
    } = this.props;
    return (
      <TextField
        key={id}
        name={name}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
        value={value}
        onChange={(evt: any) => onFieldChange(id, evt.target.value)}
      />
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <MaterialUiTextField />
  </FieldWrapper>
);
