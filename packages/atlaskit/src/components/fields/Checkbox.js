// @flow
import React from "react";
import Checkbox from "@atlaskit/checkbox";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "../../../../../types";
import { Field as AkField } from "@atlaskit/form";

class AtlaskitCheckbox extends React.Component<Field> {
  render() {
    const {
      description,
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      onFieldChange,
      value,
      label,
      required
    } = this.props;
    const stringValue: string | void = value ? value.toString() : undefined;
    return (
      //$FlowFixMe
      <AkField
        helperText={description}
        required={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
      >
        <Checkbox
          label={label}
          name={name}
          isDisabled={disabled}
          value={stringValue}
          initiallyChecked={value}
          onChange={evt => onFieldChange(id, evt.isChecked)}
        />
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitCheckbox />
  </FieldWrapper>
);
