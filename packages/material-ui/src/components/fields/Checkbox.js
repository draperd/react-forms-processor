// @flow
import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "../../../../../types";

class MaterialCheckbox extends React.Component<Field> {
  render() {
    const {
      disabled,
      id,
      isValid,
      name,
      onFieldChange,
      value,
      label
    } = this.props;
    const stringValue: string | void = value ? value.toString() : undefined;
    return (
      //$FlowFixMe
      <FormControlLabel
        control={
          <Checkbox
            key={id}
            name={name}
            disabled={disabled}
            isInvalid={!isValid}
            value={stringValue}
            checked={value}
            onChange={evt => onFieldChange(id, evt.target.checked)}
          />
        }
        label={label}
      />
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <MaterialCheckbox />
  </FieldWrapper>
);
